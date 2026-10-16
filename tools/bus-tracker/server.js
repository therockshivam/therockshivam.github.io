/**
 * server.js – Paytm Bus Fare Tracker
 * Local Node.js/Express backend that:
 *   1. Serves the static dashboard (public/)
 *   2. Proxies POST requests to travel.paytm.com so the browser's own session
 *      cookies are sent from the same machine (bypassing browser CORS restrictions
 *      that would otherwise block cross-origin requests from the frontend).
 *   3. Persists fare snapshots in SQLite.
 *   4. Exposes a REST API consumed by the frontend dashboard.
 *
 * IMPORTANT – Authorization note:
 *   The Paytm bus search endpoint is undocumented / private. This proxy does NOT
 *   bypass any authentication; it relies on the existing browser session the user
 *   has established at travel.paytm.com. No credentials are stored by this app.
 *   The server must run on the same machine as the logged-in browser.
 *   Automated polling is rate-limited (minimum 60 s) to avoid excessive traffic.
 */

'use strict';

require('dotenv').config();

const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');
const Database = require('better-sqlite3');

// ─── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  port:              parseInt(process.env.PORT              || '3747', 10),
  paytmApiUrl:       process.env.PAYTM_API_URL              || 'https://travel.paytm.com/bus/v4/search',
  sourceDocId:       parseInt(process.env.SOURCE_DOC_ID      || '3461', 10),
  destinationDocId:  parseInt(process.env.DESTINATION_DOC_ID || '2342', 10),
  travelDate:        process.env.TRAVEL_DATE                 || '2026-11-06',
  minIntervalSec:    parseInt(process.env.MIN_INTERVAL_SECONDS     || '60',  10),
  defaultIntervalSec:parseInt(process.env.DEFAULT_INTERVAL_SECONDS || '300', 10),
  dbPath:            process.env.DB_PATH                     || 'bus_tracker.db',
};

// ─── Database setup ───────────────────────────────────────────────────────────
const db = new Database(CONFIG.dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS snapshots (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    checked_at   TEXT    NOT NULL,
    bus_id       TEXT    NOT NULL,
    operator     TEXT,
    bus_type     TEXT,
    departure    TEXT,
    arrival      TEXT,
    duration_min INTEGER,
    fare         REAL,
    gst          REAL,
    total_fare   REAL,
    seats        INTEGER,
    ac           INTEGER,
    sleeper      INTEGER,
    cancellable  INTEGER,
    rating_avg   REAL,
    rating_cnt   INTEGER,
    boarding_pts TEXT,
    dropping_pts TEXT,
    bus_tags     TEXT,
    sold_out     INTEGER DEFAULT 0,
    departed     INTEGER DEFAULT 0,
    source       TEXT    DEFAULT 'live'
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT    NOT NULL,
    type       TEXT    NOT NULL,
    bus_id     TEXT,
    operator   TEXT,
    departure  TEXT,
    old_fare   REAL,
    new_fare   REAL,
    message    TEXT    NOT NULL,
    dismissed  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS checks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    checked_at  TEXT NOT NULL,
    status      TEXT NOT NULL,
    bus_count   INTEGER,
    error_msg   TEXT,
    source      TEXT DEFAULT 'live'
  );
`);

// ─── Prepared statements ──────────────────────────────────────────────────────
const insertSnapshot = db.prepare(`
  INSERT INTO snapshots
    (checked_at,bus_id,operator,bus_type,departure,arrival,duration_min,
     fare,gst,total_fare,seats,ac,sleeper,cancellable,rating_avg,rating_cnt,
     boarding_pts,dropping_pts,bus_tags,sold_out,departed,source)
  VALUES
    (@checked_at,@bus_id,@operator,@bus_type,@departure,@arrival,@duration_min,
     @fare,@gst,@total_fare,@seats,@ac,@sleeper,@cancellable,@rating_avg,@rating_cnt,
     @boarding_pts,@dropping_pts,@bus_tags,@sold_out,@departed,@source)
`);

const insertAlert = db.prepare(`
  INSERT INTO alerts (created_at,type,bus_id,operator,departure,old_fare,new_fare,message)
  VALUES (@created_at,@type,@bus_id,@operator,@departure,@old_fare,@new_fare,@message)
`);

const insertCheck = db.prepare(`
  INSERT INTO checks (checked_at,status,bus_count,error_msg,source)
  VALUES (@checked_at,@status,@bus_count,@error_msg,@source)
`);

// ─── API response parsing ─────────────────────────────────────────────────────
/**
 * Parse the real Paytm response JSON into a normalised bus array.
 * Field mapping (from the actual response):
 *   body.t[]     – bus list
 *   bid          – stable bus identifier
 *   propn        – operator name
 *   btn          – bus type name
 *   dep_dt       – departure datetime "YYYY-MM-DD HH:mm:ss" (IST assumed)
 *   arr_dt       – arrival datetime "YYYY-MM-DD HH:mm:ss" (IST assumed)
 *   dur          – journey duration string (minutes, e.g. "1220")
 *   df[].bf      – base fare in INR (integer)
 *   df[].g       – GST amount in INR
 *   df[].of      – offer discount
 *   seats        – available seats
 *   fs.ac        – air-conditioned (boolean)
 *   fs.sl        – sleeper (boolean)
 *   fs.can       – cancellable (boolean)
 *   rnr.avg      – rating average
 *   rnr.cnt      – rating count
 *   bp[]         – boarding point names
 *   dp[]         – dropping point names
 *   btt[]        – bus type tags
 *   st.so        – sold out
 *   st.d         – already departed
 */
function parsePaytmResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Response is not a JSON object');
  }
  if (raw.error) {
    throw new Error(`Paytm API error: ${JSON.stringify(raw.error)}`);
  }
  if (!raw.body || !Array.isArray(raw.body.t)) {
    throw new Error('Unexpected response shape: body.t array missing');
  }

  return raw.body.t.map(bus => {
    // Extract minimum fare from the df (fare detail) array
    const fareDetails = Array.isArray(bus.df) ? bus.df : [];
    const validFares = fareDetails
      .filter(f => typeof f.bf === 'number' && f.bf > 0);
    const minFareDetail = validFares.length
      ? validFares.reduce((a, b) => (a.bf < b.bf ? a : b))
      : null;

    const baseFare  = minFareDetail ? minFareDetail.bf : null;
    const gst       = minFareDetail ? (minFareDetail.g || 0) : null;
    const offer     = minFareDetail ? (minFareDetail.of || 0) : 0;
    const totalFare = (baseFare != null && gst != null)
      ? baseFare + gst - offer
      : null;

    return {
      bus_id:       bus.bid        || null,
      operator:     bus.propn      || 'Unknown Operator',
      bus_type:     bus.btn        || '',
      departure:    bus.dep_dt     || null,  // "YYYY-MM-DD HH:mm:ss" IST
      arrival:      bus.arr_dt     || null,
      duration_min: bus.dur ? parseInt(bus.dur, 10) : null,
      fare:         baseFare,
      gst:          gst,
      total_fare:   totalFare,
      seats:        typeof bus.seats === 'number' ? bus.seats : null,
      ac:           bus.fs?.ac    ? 1 : 0,
      sleeper:      bus.fs?.sl    ? 1 : 0,
      cancellable:  bus.fs?.can   ? 1 : 0,
      rating_avg:   bus.rnr?.avg  ?? null,
      rating_cnt:   bus.rnr?.cnt  ?? null,
      boarding_pts: Array.isArray(bus.bp) ? bus.bp.join(' | ') : '',
      dropping_pts: Array.isArray(bus.dp) ? bus.dp.join(' | ') : '',
      bus_tags:     Array.isArray(bus.btt) ? bus.btt.join(', ') : '',
      sold_out:     bus.st?.so ? 1 : 0,
      departed:     bus.st?.d  ? 1 : 0,
    };
  });
}

/**
 * Filter buses to only those departing at or after 17:00 IST on the travel date.
 * Times in dep_dt are already in IST.
 */
function filterAfterTime(buses, afterTimeHHMM = '17:00') {
  const [filterH, filterM] = afterTimeHHMM.split(':').map(Number);
  return buses.filter(bus => {
    if (!bus.departure) return false;
    // dep_dt format: "YYYY-MM-DD HH:mm:ss"
    const timePart = bus.departure.split(' ')[1] || '';
    const [h, m]   = timePart.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return false;
    return h > filterH || (h === filterH && m >= filterM);
  });
}

// ─── Alert generation ─────────────────────────────────────────────────────────
function generateAlerts(previous, current, targetFare, checkedAt) {
  const prevMap = new Map(previous.map(b => [b.bus_id, b]));
  const alerts  = [];

  for (const bus of current) {
    if (!bus.bus_id) continue;
    const prev = prevMap.get(bus.bus_id);

    if (!prev) {
      // New bus discovered
      alerts.push({
        created_at: checkedAt,
        type: 'new_bus',
        bus_id: bus.bus_id,
        operator: bus.operator,
        departure: bus.departure,
        old_fare: null,
        new_fare: bus.total_fare,
        message: `New bus found: ${bus.operator} departing ${formatTime(bus.departure)}` +
                 (bus.total_fare != null ? ` at ₹${bus.total_fare}` : ''),
      });
    } else if (bus.total_fare != null && prev.total_fare != null
               && bus.total_fare < prev.total_fare) {
      // Fare decreased
      const drop = prev.total_fare - bus.total_fare;
      const pct  = ((drop / prev.total_fare) * 100).toFixed(1);
      alerts.push({
        created_at: checkedAt,
        type: 'fare_drop',
        bus_id: bus.bus_id,
        operator: bus.operator,
        departure: bus.departure,
        old_fare: prev.total_fare,
        new_fare: bus.total_fare,
        message: `Fare drop: ${bus.operator} ${formatTime(bus.departure)} – ₹${prev.total_fare} → ₹${bus.total_fare} (−${pct}%)`,
      });
    }

    // Target fare reached
    if (bus.total_fare != null && bus.total_fare <= targetFare) {
      const alreadyAlerted = prev &&
        prev.total_fare != null &&
        prev.total_fare <= targetFare;
      if (!alreadyAlerted) {
        alerts.push({
          created_at: checkedAt,
          type: 'target_reached',
          bus_id: bus.bus_id,
          operator: bus.operator,
          departure: bus.departure,
          old_fare: prev?.total_fare ?? null,
          new_fare: bus.total_fare,
          message: `🎯 Target fare! ${bus.operator} ${formatTime(bus.departure)} – ₹${bus.total_fare} ≤ ₹${targetFare}`,
        });
      }
    }
  }

  return alerts;
}

function formatTime(depDt) {
  if (!depDt) return '?';
  return depDt.split(' ')[1]?.slice(0, 5) || depDt;
}

// ─── Snapshot persistence ─────────────────────────────────────────────────────
function saveBatch(buses, checkedAt, source) {
  const tx = db.transaction(list => {
    for (const b of list) {
      insertSnapshot.run({ ...b, checked_at: checkedAt, source });
    }
  });
  tx(buses);
}

function getLatestPerBus() {
  return db.prepare(`
    SELECT s.* FROM snapshots s
    INNER JOIN (
      SELECT bus_id, MAX(id) as max_id FROM snapshots GROUP BY bus_id
    ) latest ON s.id = latest.max_id
    ORDER BY s.fare ASC NULLS LAST
  `).all();
}

function getHistory(limit = 200) {
  return db.prepare(
    'SELECT * FROM snapshots ORDER BY id DESC LIMIT ?'
  ).all(limit);
}

function getAlerts(limit = 50) {
  return db.prepare(
    'SELECT * FROM alerts WHERE dismissed = 0 ORDER BY id DESC LIMIT ?'
  ).all(limit);
}

function getChecks(limit = 20) {
  return db.prepare(
    'SELECT * FROM checks ORDER BY id DESC LIMIT ?'
  ).all(limit);
}

function getFareHistory(busId) {
  return db.prepare(
    'SELECT checked_at, fare, total_fare, seats FROM snapshots WHERE bus_id = ? ORDER BY id ASC'
  ).all(busId);
}

// ─── Express app ──────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── GET /api/config ───────────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => {
  res.json({
    sourceDocId:        CONFIG.sourceDocId,
    destinationDocId:   CONFIG.destinationDocId,
    travelDate:         CONFIG.travelDate,
    minIntervalSec:     CONFIG.minIntervalSec,
    defaultIntervalSec: CONFIG.defaultIntervalSec,
    sourceName:         'Ahmedabad',
    destinationName:    'Bhopal',
  });
});

// ── POST /api/fetch ───────────────────────────────────────────────────────────
// Proxies a single request to the Paytm API and returns parsed bus list.
// The caller (dashboard) sends { cookies, targetFare, afterTime, filterActive }
app.post('/api/fetch', async (req, res) => {
  const {
    cookies    = '',
    targetFare = 1000,
    afterTime  = '17:00',
    filterActive = true,
  } = req.body || {};

  const checkedAt = new Date().toISOString();

  const payload = {
    source_doc_id:       CONFIG.sourceDocId,
    destination_doc_id:  CONFIG.destinationDocId,
    is_last_minute_booking: true,
    date:                CONFIG.travelDate,
    sort_by:             [{ field: 'popular', order: 'desc' }],
    is_sold_out:         true,
    is_departed:         true,
    is_deal_applicable:  true,
    request_type:        'one_way',
    leg_number:          0,
    utm_campaign:        '',
    utm_medium:          '',
    utm_source:          '',
  };

  const headers = {
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'User-Agent':    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer':       'https://travel.paytm.com/',
    'Origin':        'https://travel.paytm.com',
  };
  // Only forward cookie header if the caller explicitly provided one.
  // SECURITY: never log or store cookie values.
  if (cookies && cookies.trim()) {
    headers['Cookie'] = cookies.trim();
  }

  let fetchResult;
  try {
    const url = `${CONFIG.paytmApiUrl}?client=web&isH5=true&site_id=1&child_site_id=1&isV3=true`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      timeout: 20000,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      insertCheck.run({
        checked_at: checkedAt,
        status: 'error',
        bus_count: null,
        error_msg: `HTTP ${response.status}: ${text.slice(0, 200)}`,
        source: 'live',
      });
      return res.status(502).json({
        error: true,
        code: response.status,
        message: `Paytm API returned HTTP ${response.status}. ` +
                 (response.status === 403
                   ? 'Session may have expired – open travel.paytm.com in your browser and log in again.'
                   : 'Check the Paytm website for maintenance.'),
      });
    }

    fetchResult = await response.json();
  } catch (err) {
    insertCheck.run({
      checked_at: checkedAt,
      status: 'error',
      bus_count: null,
      error_msg: String(err),
      source: 'live',
    });
    return res.status(502).json({
      error: true,
      message: `Network error reaching Paytm: ${err.message}`,
    });
  }

  // Parse response
  let allBuses;
  try {
    allBuses = parsePaytmResponse(fetchResult);
  } catch (parseErr) {
    insertCheck.run({
      checked_at: checkedAt,
      status: 'error',
      bus_count: null,
      error_msg: `Parse error: ${parseErr.message}`,
      source: 'live',
    });
    return res.status(502).json({
      error: true,
      message: `Could not parse Paytm response: ${parseErr.message}`,
    });
  }

  // Filter
  const filtered = filterActive ? filterAfterTime(allBuses, afterTime) : allBuses;

  // Generate alerts against previous snapshot
  const previous = getLatestPerBus();
  const alerts   = generateAlerts(previous, filtered, targetFare, checkedAt);

  // Persist
  saveBatch(allBuses, checkedAt, 'live');
  const tx = db.transaction(() => {
    for (const a of alerts) insertAlert.run(a);
  });
  tx();
  insertCheck.run({
    checked_at: checkedAt,
    status: 'ok',
    bus_count: allBuses.length,
    error_msg: null,
    source: 'live',
  });

  return res.json({
    checkedAt,
    total:    allBuses.length,
    matching: filtered.length,
    buses:    filtered,
    alerts,
  });
});

// ── POST /api/demo ────────────────────────────────────────────────────────────
// Loads the bundled fixture (bus-response.txt) and runs the same pipeline.
// Clearly labelled as demo data – never presented as live fares.
app.post('/api/demo', (req, res) => {
  const { targetFare = 1000, afterTime = '17:00', filterActive = true } = req.body || {};
  const checkedAt = new Date().toISOString();

  let raw;
  try {
    const fs = require('fs');
    const fixturePath = path.join(__dirname, 'fixtures', 'bus-response.json');
    raw = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  } catch (err) {
    return res.status(500).json({ error: true, message: `Cannot load fixture: ${err.message}` });
  }

  let allBuses;
  try {
    allBuses = parsePaytmResponse(raw);
  } catch (err) {
    return res.status(500).json({ error: true, message: `Fixture parse error: ${err.message}` });
  }

  const filtered = filterActive ? filterAfterTime(allBuses, afterTime) : allBuses;
  const previous = getLatestPerBus();
  const alerts   = generateAlerts(previous, filtered, targetFare, checkedAt);

  saveBatch(allBuses, checkedAt, 'demo');
  const tx = db.transaction(() => {
    for (const a of alerts) insertAlert.run(a);
  });
  tx();
  insertCheck.run({
    checked_at: checkedAt,
    status: 'ok',
    bus_count: allBuses.length,
    error_msg: null,
    source: 'demo',
  });

  return res.json({
    checkedAt,
    total:    allBuses.length,
    matching: filtered.length,
    buses:    filtered,
    alerts,
    isDemo:   true,
  });
});

// ── GET /api/history ──────────────────────────────────────────────────────────
app.get('/api/history', (_req, res) => {
  res.json(getHistory(200));
});

// ── GET /api/alerts ───────────────────────────────────────────────────────────
app.get('/api/alerts', (_req, res) => {
  res.json(getAlerts(50));
});

// ── POST /api/alerts/dismiss ──────────────────────────────────────────────────
app.post('/api/alerts/dismiss', (req, res) => {
  const { id } = req.body || {};
  if (id) {
    db.prepare('UPDATE alerts SET dismissed=1 WHERE id=?').run(id);
  } else {
    db.prepare('UPDATE alerts SET dismissed=1').run();
  }
  res.json({ ok: true });
});

// ── GET /api/checks ───────────────────────────────────────────────────────────
app.get('/api/checks', (_req, res) => {
  res.json(getChecks(20));
});

// ── GET /api/fare-history/:busId ──────────────────────────────────────────────
app.get('/api/fare-history/:busId', (req, res) => {
  const busId = decodeURIComponent(req.params.busId);
  res.json(getFareHistory(busId));
});

// ── Exported parsers for testing ──────────────────────────────────────────────
module.exports = { parsePaytmResponse, filterAfterTime, generateAlerts, formatTime };

// ─── Start server ─────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(CONFIG.port, () => {
    console.log(`\n🚌 Paytm Bus Tracker running at http://localhost:${CONFIG.port}`);
    console.log(`   Route: Ahmedabad (${CONFIG.sourceDocId}) → Bhopal (${CONFIG.destinationDocId})`);
    console.log(`   Date:  ${CONFIG.travelDate}`);
    console.log(`   DB:    ${CONFIG.dbPath}`);
    console.log('\n   Open the URL above in the same browser where you are logged into travel.paytm.com.\n');
  });
}
