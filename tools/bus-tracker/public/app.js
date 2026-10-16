/**
 * app.js – Paytm Bus Fare Tracker Frontend
 *
 * Responsibilities:
 *   - Monitoring scheduler (start/pause/stop, configurable interval, min 60s)
 *   - API calls to local backend (/api/fetch for live, /api/demo for fixture)
 *   - Bus card rendering from real API field names
 *   - Alert rendering and browser notifications
 *   - Fare history display per bus
 *   - Persistence of UI state in localStorage (NO credentials stored)
 */

'use strict';

// ─── Global state ─────────────────────────────────────────────────────────────
const State = {
  status: 'idle',       // idle | running | paused | checking | error
  intervalId: null,     // setInterval handle
  countdownId: null,    // setInterval handle for countdown
  secondsLeft: 0,
  totalSeconds: 0,
  lastCheckAt: null,
  lastResultSource: null, // 'live' | 'demo' | null
  buses: [],            // currently displayed buses (after filter)
  allBuses: [],         // unfiltered latest fetch
  targetFare: 1000,
  newBusIds: new Set(), // bus_ids seen in this session
};

// ─── DOM helpers ──────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (text) e.textContent = text;
  return e;
};

// ─── Initialisation ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  loadPreferences();
  await fetchConfig();
  await loadAlerts();
  requestNotificationPermission();
  setupNotifToggle();
});

async function fetchConfig() {
  try {
    const cfg = await apiFetch('/api/config');
    // Could show route names from server config here
    console.log('Server config:', cfg);
  } catch (_) { /* non-critical */ }
}

// ─── Preferences (localStorage, NO secrets) ──────────────────────────────────
function loadPreferences() {
  const prefs = JSON.parse(localStorage.getItem('bus-tracker-prefs') || '{}');
  if (prefs.targetFare)  $('input-target-fare').value = prefs.targetFare;
  if (prefs.afterTime)   $('input-after-time').value  = prefs.afterTime;
  if (prefs.interval)    $('input-interval').value    = prefs.interval;
  if (prefs.sortBy)      $('select-sort').value       = prefs.sortBy;
  if (prefs.filterActive === false) $('toggle-filter').checked = false;
}

function savePreferences() {
  localStorage.setItem('bus-tracker-prefs', JSON.stringify({
    targetFare:   Number($('input-target-fare').value),
    afterTime:    $('input-after-time').value,
    interval:     Number($('input-interval').value),
    sortBy:       $('select-sort').value,
    filterActive: $('toggle-filter').checked,
  }));
}

// ─── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json;
}

// ─── Main check dispatch ──────────────────────────────────────────────────────
const App = {

  async runCheck() {
    if (State.status === 'checking') return;
    setStatus('checking');
    showLoading(true);
    savePreferences();

    const targetFare  = Number($('input-target-fare').value) || 1000;
    const afterTime   = $('input-after-time').value || '17:00';
    const filterActive = $('toggle-filter').checked;

    State.targetFare = targetFare;

    try {
      const result = await apiFetch('/api/fetch', {
        method: 'POST',
        body: JSON.stringify({ targetFare, afterTime, filterActive }),
      });
      handleResult(result, 'live');
    } catch (err) {
      handleError(err);
    } finally {
      showLoading(false);
      if (State.status === 'checking') {
        setStatus(State.intervalId ? 'running' : 'idle');
      }
    }
  },

  async runDemo() {
    setStatus('checking');
    showLoading(true);
    savePreferences();

    const targetFare  = Number($('input-target-fare').value) || 1000;
    const afterTime   = $('input-after-time').value || '17:00';
    const filterActive = $('toggle-filter').checked;

    State.targetFare = targetFare;

    try {
      const result = await apiFetch('/api/demo', {
        method: 'POST',
        body: JSON.stringify({ targetFare, afterTime, filterActive }),
      });
      result.isDemo = true;
      handleResult(result, 'demo');
    } catch (err) {
      handleError(err);
    } finally {
      showLoading(false);
      if (State.status === 'checking') {
        setStatus(State.intervalId ? 'running' : 'idle');
      }
    }
  },

  startMonitoring() {
    savePreferences();
    const rawMinutes = Number($('input-interval').value) || 5;
    const minutes    = Math.max(1, rawMinutes); // UI minimum; server enforces 60s
    const seconds    = minutes * 60;

    clearInterval(State.intervalId);
    clearInterval(State.countdownId);

    setStatus('running');
    $('btn-start').disabled  = true;
    $('btn-pause').disabled  = false;
    $('btn-stop').disabled   = false;

    App.runCheck(); // immediate first check

    State.totalSeconds = seconds;
    State.secondsLeft  = seconds;
    State.intervalId   = setInterval(() => App.runCheck(), seconds * 1000);
    startCountdown(seconds);
  },

  pauseMonitoring() {
    clearInterval(State.intervalId);
    clearInterval(State.countdownId);
    State.intervalId = null;
    setStatus('paused');
    $('btn-start').disabled  = false;
    $('btn-pause').disabled  = true;
    $('btn-stop').disabled   = false;
    $('countdown-label').textContent = 'Paused';
    $('countdown-bar').style.width = '0%';
  },

  stopMonitoring() {
    clearInterval(State.intervalId);
    clearInterval(State.countdownId);
    State.intervalId = null;
    setStatus('idle');
    $('btn-start').disabled  = false;
    $('btn-pause').disabled  = true;
    $('btn-stop').disabled   = true;
    $('countdown-label').textContent = '–';
    $('countdown-bar').style.width = '0%';
  },

  resort() {
    savePreferences();
    renderBuses(State.buses);
  },

  switchTab(name) {
    ['buses', 'alerts', 'history'].forEach(t => {
      $(`tab-${t}`).classList.toggle('active', t === name);
      $(`tab-${t}`).setAttribute('aria-selected', t === name);
      $(`panel-${t}`).hidden = t !== name;
    });
    if (name === 'history') loadHistory();
    if (name === 'alerts')  loadAlerts();
  },

  async dismissAllAlerts() {
    await apiFetch('/api/alerts/dismiss', { method: 'POST', body: JSON.stringify({}) });
    await loadAlerts();
  },
};

// Make App globally accessible (called from inline onclick attributes)
window.App = App;

// ─── Status management ────────────────────────────────────────────────────────
function setStatus(status) {
  State.status = status;
  const dot   = $('status-dot');
  const label = $('status-label');
  const map = {
    idle:     ['idle',     'Idle'],
    running:  ['running',  'Monitoring'],
    paused:   ['paused',   'Paused'],
    checking: ['checking', 'Checking…'],
    error:    ['error',    'Error'],
  };
  const [cls, text] = map[status] || ['idle', 'Idle'];
  dot.className = `status-dot ${cls}`;
  label.textContent = text;
}

function showLoading(on) {
  const list = $('bus-list');
  let overlay = list.querySelector('.spinner-overlay');
  if (on && !overlay) {
    overlay = el('div', 'spinner-overlay');
    overlay.innerHTML = '<div class="spinner"></div>';
    list.style.position = 'relative';
    list.appendChild(overlay);
  } else if (!on && overlay) {
    overlay.remove();
  }
}

// ─── Result handler ───────────────────────────────────────────────────────────
function handleResult(result, source) {
  State.lastCheckAt      = result.checkedAt;
  State.lastResultSource = source;
  State.allBuses         = result.buses || [];
  State.buses            = result.buses || [];

  // Update stat cards
  $('stat-matching-val').textContent = result.matching ?? State.buses.length;
  $('stat-total-val').textContent    = result.total    ?? State.buses.length;

  const fares = State.buses.filter(b => b.total_fare).map(b => b.total_fare);
  if (fares.length) {
    const lowest = Math.min(...fares);
    $('stat-lowest-val').textContent = `₹${lowest.toLocaleString('en-IN')}`;
    $('stat-lowest').classList.toggle('target-hit', lowest <= State.targetFare);
  } else {
    $('stat-lowest-val').textContent = '–';
  }

  const checkedTime = new Date(result.checkedAt);
  $('stat-last-check-val').textContent =
    checkedTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Freshness tag
  const fresh = $('data-freshness');
  if (result.isDemo) {
    fresh.textContent = '🎭 Demo data – not live fares';
    fresh.className = 'freshness-tag demo';
  } else {
    fresh.textContent = '🟢 Live data';
    fresh.className = 'freshness-tag live';
  }

  // Results meta
  $('results-meta').textContent =
    `${State.buses.length} bus${State.buses.length !== 1 ? 'es' : ''} · Last: ${checkedTime.toLocaleTimeString('en-IN')}`;

  renderBuses(State.buses);

  // Handle alerts
  if (result.alerts && result.alerts.length) {
    processAlerts(result.alerts, source);
  }

  // Reset countdown if monitoring
  if (State.intervalId) {
    clearInterval(State.countdownId);
    startCountdown(State.totalSeconds);
  }
}

function handleError(err) {
  setStatus('error');
  showToast(`⚠️ ${err.message}`, 'danger');
  $('data-freshness').textContent = '⚠️ Check failed – previous data preserved';
  $('data-freshness').className = 'freshness-tag stale';
  console.error('Bus check failed:', err);
  // Do NOT clear existing buses – preserve last successful result
}

// ─── Bus rendering ────────────────────────────────────────────────────────────
function sortBuses(buses) {
  const by = $('select-sort').value;
  return [...buses].sort((a, b) => {
    if (by === 'fare') {
      const fa = a.total_fare ?? Infinity;
      const fb = b.total_fare ?? Infinity;
      return fa - fb;
    }
    if (by === 'departure') {
      return (a.departure || '').localeCompare(b.departure || '');
    }
    if (by === 'duration') {
      return (a.duration_min ?? Infinity) - (b.duration_min ?? Infinity);
    }
    return 0;
  });
}

function renderBuses(buses) {
  const list = $('bus-list');
  const empty = $('empty-state');

  // Remove existing cards (not the empty state)
  list.querySelectorAll('.bus-card').forEach(c => c.remove());

  if (!buses.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const sorted = sortBuses(buses);
  const tmpl   = $('bus-card-template');

  for (const bus of sorted) {
    const card = tmpl.content.firstElementChild.cloneNode(true);
    populateCard(card, bus);
    list.insertBefore(card, empty);
  }
}

function populateCard(card, bus) {
  const isTargetHit = bus.total_fare != null && bus.total_fare <= State.targetFare;
  const isNew       = State.newBusIds && !State.newBusIds.has(bus.bus_id);

  if (isTargetHit) card.classList.add('target-hit');
  if (bus.ac)      card.classList.add('ac');
  else             card.classList.add('non-ac');

  // Header
  card.querySelector('.bus-card-operator').innerHTML =
    `<div>${escHtml(bus.operator)}</div>
     <div class="bus-card-type">${escHtml(bus.bus_type)}</div>`;

  const fareEl = card.querySelector('.bus-card-fare');
  if (bus.total_fare != null) {
    fareEl.textContent = `₹${bus.total_fare.toLocaleString('en-IN')}`;
    if (isTargetHit) fareEl.classList.add('target-fare');
  } else if (bus.fare != null) {
    fareEl.textContent = `₹${bus.fare.toLocaleString('en-IN')}`;
  } else {
    fareEl.textContent = 'N/A';
  }

  const sub = card.querySelector('.bus-card-fare-sub');
  if (bus.fare != null && bus.gst != null && bus.gst > 0) {
    sub.textContent = `Base ₹${bus.fare} + GST ₹${bus.gst}`;
  } else {
    sub.textContent = 'incl. taxes';
  }

  // Times
  card.querySelector('.dep-time').textContent = formatTime(bus.departure);
  card.querySelector('.arr-time').textContent = formatTime(bus.arrival);
  card.querySelector('.duration-label').textContent = formatDuration(bus.duration_min);

  // Tags
  const tagsEl = card.querySelector('.bus-card-tags');
  const tags = [];
  if (bus.ac)         tags.push(['AC', 'tag-ac']);
  else                tags.push(['Non-AC', 'tag-non-ac']);
  if (bus.sleeper)    tags.push(['Sleeper', 'tag-sleeper']);
  else                tags.push(['Seater', 'tag-seater']);
  if (bus.cancellable) tags.push(['Cancellable', 'tag-cancel']);
  if (bus.sold_out)   tags.push(['Sold Out', 'tag-sold-out']);
  if (isNew)          tags.push(['New', 'tag-new']);
  if (isTargetHit)    tags.push(['🎯 Target!', 'tag-new']);

  tags.forEach(([text, cls]) => {
    tagsEl.appendChild(el('span', `tag ${cls}`, text));
  });

  // Boarding / dropping
  const bp = card.querySelector('.boarding-pts');
  const dp = card.querySelector('.dropping-pts');
  if (bus.boarding_pts) {
    bp.textContent = bus.boarding_pts.replace(/ \| /g, ', ');
  } else {
    card.querySelector('.boarding-row').hidden = true;
  }
  if (bus.dropping_pts) {
    dp.textContent = bus.dropping_pts.replace(/ \| /g, ', ');
  } else {
    card.querySelector('.dropping-row').hidden = true;
  }

  // Footer
  const seatsEl = card.querySelector('.bus-seats');
  if (bus.seats != null) {
    seatsEl.textContent = `💺 ${bus.seats} seat${bus.seats !== 1 ? 's' : ''} left`;
    if (bus.seats <= 5) seatsEl.style.color = 'var(--clr-danger)';
  } else {
    seatsEl.textContent = '';
  }

  const ratingEl = card.querySelector('.bus-rating');
  if (bus.rating_avg && bus.rating_cnt) {
    ratingEl.textContent = `⭐ ${bus.rating_avg.toFixed(1)} (${bus.rating_cnt})`;
  }

  // Book link – build Paytm search URL (not a direct booking)
  const bookBtn = card.querySelector('.bus-book-btn');
  const bookUrl = `https://travel.paytm.com/bus/search/Ahmedabad/Bhopal/2026-11-06/1`;
  bookBtn.href = bookUrl;
  bookBtn.title = 'Opens Paytm bus search – verify and book manually';

  // Fare history toggle
  const toggle = card.querySelector('.bus-fare-history-toggle');
  const hist   = card.querySelector('.bus-fare-history');
  toggle.addEventListener('click', async () => {
    if (hist.hidden) {
      hist.hidden = false;
      toggle.textContent = 'Hide fare history ▴';
      await loadAndRenderFareHistory(bus.bus_id, hist);
    } else {
      hist.hidden = true;
      toggle.textContent = 'Show fare history ▾';
    }
  });
  toggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
  });
}

async function loadAndRenderFareHistory(busId, container) {
  container.textContent = 'Loading…';
  try {
    const rows = await apiFetch(`/api/fare-history/${encodeURIComponent(busId)}`);
    if (!rows.length) { container.textContent = 'No history yet.'; return; }
    container.innerHTML = '';
    const header = el('div', 'fare-history-row');
    header.innerHTML = '<span><strong>Time</strong></span><span><strong>Fare</strong></span><span><strong>Seats</strong></span>';
    container.appendChild(header);
    rows.forEach(r => {
      const row = el('div', 'fare-history-row');
      const t   = new Date(r.checked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const f   = r.total_fare != null ? `₹${r.total_fare}` : (r.fare ? `₹${r.fare}` : '–');
      row.innerHTML = `<span>${t}</span><span>${f}</span><span>${r.seats ?? '–'}</span>`;
      container.appendChild(row);
    });
  } catch (_) {
    container.textContent = 'Failed to load history.';
  }
}

// ─── Alert processing ─────────────────────────────────────────────────────────
const ALERT_ICONS = {
  new_bus:        '🆕',
  fare_drop:      '📉',
  target_reached: '🎯',
};

function processAlerts(alerts, source) {
  if (source === 'demo' && alerts.length) {
    // Still show demo alerts – they demonstrate the feature
  }
  alerts.forEach(a => {
    const icon = ALERT_ICONS[a.type] || '🔔';
    showToast(`${icon} ${a.message}`,
              a.type === 'target_reached' ? 'target' :
              a.type === 'fare_drop'      ? 'success' : 'default');
    tryBrowserNotif(a.message, icon);
  });
  loadAlerts();
}

async function loadAlerts() {
  const list = $('alert-list');
  try {
    const alerts = await apiFetch('/api/alerts');
    $('alert-badge').textContent = alerts.length || '';
    list.innerHTML = '';
    if (!alerts.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <p>No active alerts.</p>
          <p class="hint">Alerts appear when fares drop, new buses appear, or your target fare is reached.</p>
        </div>`;
      return;
    }
    alerts.forEach(a => {
      const item = el('div', `alert-item type-${a.type}`);
      const icon = ALERT_ICONS[a.type] || '🔔';
      const time = new Date(a.created_at).toLocaleString('en-IN');
      item.innerHTML = `
        <span class="alert-icon">${icon}</span>
        <div class="alert-body">
          <div class="alert-msg">${escHtml(a.message)}</div>
          <div class="alert-time">${escHtml(time)}</div>
        </div>
        <button class="alert-dismiss" title="Dismiss" onclick="dismissAlert(${a.id}, this.closest('.alert-item'))">✕</button>`;
      list.appendChild(item);
    });
  } catch (err) {
    list.innerHTML = `<p class="hint" style="padding:12px">Failed to load alerts: ${escHtml(err.message)}</p>`;
  }
}

window.dismissAlert = async (id, el) => {
  await apiFetch('/api/alerts/dismiss', { method: 'POST', body: JSON.stringify({ id }) });
  el?.remove();
  loadAlerts();
};

// ─── History ──────────────────────────────────────────────────────────────────
async function loadHistory() {
  const container = $('history-list');
  container.innerHTML = '<p class="hint" style="padding:12px">Loading…</p>';
  try {
    const rows = await apiFetch('/api/history');
    if (!rows.length) {
      container.innerHTML = '<p class="hint" style="padding:12px">No history yet.</p>';
      return;
    }
    const table = document.createElement('table');
    table.className = 'history-table';
    table.innerHTML = `
      <thead><tr>
        <th>Time</th><th>Operator</th><th>Dep</th><th>Fare</th><th>Total</th><th>Seats</th><th>Source</th>
      </tr></thead>
      <tbody></tbody>`;
    const tbody = table.querySelector('tbody');
    rows.forEach(r => {
      const tr = document.createElement('tr');
      const t  = new Date(r.checked_at).toLocaleString('en-IN');
      const f  = r.fare != null ? `₹${r.fare}` : '–';
      const tf = r.total_fare != null ? `₹${r.total_fare}` : '–';
      const src = r.source === 'demo'
        ? `<span class="source-demo">demo</span>`
        : `<span class="source-live">live</span>`;
      tr.innerHTML = `
        <td>${escHtml(t)}</td>
        <td>${escHtml(r.operator || '')}</td>
        <td>${formatTime(r.departure)}</td>
        <td>${f}</td><td>${tf}</td>
        <td>${r.seats ?? '–'}</td>
        <td>${src}</td>`;
      tbody.appendChild(tr);
    });
    container.innerHTML = '';
    container.appendChild(table);
  } catch (err) {
    container.innerHTML = `<p class="hint" style="padding:12px">Failed: ${escHtml(err.message)}</p>`;
  }
}

// ─── Browser notifications ────────────────────────────────────────────────────
function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    // Don't auto-request; let user enable via toggle
  }
}

function setupNotifToggle() {
  const toggle = $('toggle-notif');
  toggle.checked = Notification.permission === 'granted';
  toggle.addEventListener('change', async () => {
    if (!('Notification' in window)) {
      showToast('Browser notifications not supported.', 'danger');
      toggle.checked = false;
      return;
    }
    if (toggle.checked) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        toggle.checked = false;
        showToast('Notification permission denied. In-app alerts are still active.', 'default');
      } else {
        showToast('Browser notifications enabled.', 'success');
      }
    }
  });
}

function tryBrowserNotif(message, icon = '🚌') {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!$('toggle-notif').checked) return;
  try {
    new Notification(`${icon} Bus Tracker`, {
      body: message,
      icon: '/favicon.ico',
      tag: message, // deduplicates same notification
    });
  } catch (_) { /* silent */ }
}

// ─── In-app toast ─────────────────────────────────────────────────────────────
function showToast(message, type = 'default') {
  const tray  = $('notification-tray');
  const toast = el('div', `notif-toast type-${type}`);
  toast.textContent = message;
  tray.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function startCountdown(totalSeconds) {
  State.totalSeconds = totalSeconds;
  State.secondsLeft  = totalSeconds;
  clearInterval(State.countdownId);

  State.countdownId = setInterval(() => {
    State.secondsLeft--;
    if (State.secondsLeft <= 0) {
      clearInterval(State.countdownId);
      $('countdown-label').textContent = 'Checking…';
      $('countdown-bar').style.width = '100%';
      return;
    }
    const m = Math.floor(State.secondsLeft / 60);
    const s = State.secondsLeft % 60;
    $('countdown-label').textContent =
      `Next check in ${m > 0 ? `${m}m ` : ''}${s}s`;
    const pct = ((totalSeconds - State.secondsLeft) / totalSeconds) * 100;
    $('countdown-bar').style.width = `${pct}%`;
  }, 1000);
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatTime(dt) {
  if (!dt) return '–';
  // dt format: "YYYY-MM-DD HH:mm:ss"
  const timePart = dt.split(' ')[1] || '';
  const [h, m]   = timePart.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return timePart || '–';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDuration(minutes) {
  if (!minutes || isNaN(minutes)) return '–';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m > 0 ? ` ${m}m` : ''}`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
