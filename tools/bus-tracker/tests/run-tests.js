/**
 * tests/run-tests.js
 * Comprehensive fixture-based unit tests for the bus tracker core logic.
 * Run with: node tests/run-tests.js
 */

'use strict';

const path = require('path');
const fs   = require('fs');

// Load the modules under test
const {
  parsePaytmResponse,
  filterAfterTime,
  generateAlerts,
} = require('../server');

// ─── Test harness ─────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

function assertEqual(actual, expected, label) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    console.error(`     Expected: ${JSON.stringify(expected)}`);
    console.error(`     Actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function section(name) {
  console.log(`\n── ${name} ─────────────────────────────────────────`);
}

// ─── Load fixture ─────────────────────────────────────────────────────────────
const fixturePath = path.join(__dirname, '..', 'fixtures', 'bus-response.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

// ─── Tests ────────────────────────────────────────────────────────────────────

section('1. parsePaytmResponse – fixture parsing');
{
  const buses = parsePaytmResponse(fixture);

  assert(Array.isArray(buses), 'Returns an array');
  assert(buses.length > 0, `Parses at least one bus (got ${buses.length})`);

  // Verify first bus fields using the real fixture data
  const first = buses[0];
  assert(typeof first.bus_id === 'string' && first.bus_id.length > 0,
    'bus_id is a non-empty string');
  assert(typeof first.operator === 'string' && first.operator.length > 0,
    'operator is present');
  assert(first.departure && first.departure.includes('2026-11-06'),
    `departure includes travel date (got: ${first.departure})`);
  assert(first.arrival !== null, 'arrival is present');
  assert(typeof first.fare === 'number' && first.fare > 0,
    `fare is a positive number (got: ${first.fare})`);
  assert(typeof first.total_fare === 'number' && first.total_fare >= first.fare,
    `total_fare >= base fare (${first.total_fare} >= ${first.fare})`);
  assert(typeof first.seats === 'number', `seats is a number (got: ${first.seats})`);
  assert([0, 1].includes(first.ac), 'ac flag is 0 or 1');
  assert([0, 1].includes(first.sleeper), 'sleeper flag is 0 or 1');
  assert([0, 1].includes(first.sold_out), 'sold_out flag is 0 or 1');
  assert(typeof first.boarding_pts === 'string', 'boarding_pts is a string');
  assert(typeof first.dropping_pts === 'string', 'dropping_pts is a string');

  // Check that first bus from fixture is B R Travels (from actual data)
  assert(first.operator === 'B R Travels', `First operator is 'B R Travels' (got: ${first.operator})`);
  assertEqual(first.fare, 3333, 'First bus base fare is 3333');
}

section('2. parsePaytmResponse – fare extraction');
{
  // Bus with multiple fare tiers (Raj Ratan Tours & Travels, 3rd bus in fixture)
  const buses = parsePaytmResponse(fixture);
  const rajRatan = buses.find(b => b.operator === 'Raj Ratan Tours & Travels');
  assert(rajRatan !== undefined, 'Found Raj Ratan Tours & Travels');
  if (rajRatan) {
    // Has multiple fares – minimum should be selected (1299 from fixture)
    assert(rajRatan.fare <= 1399,
      `Minimum fare selected from multiple tiers (got: ${rajRatan.fare})`);
    assert(rajRatan.duration_min > 0,
      `Duration parsed (got: ${rajRatan.duration_min} min)`);
  }
}

section('3. parsePaytmResponse – error handling');
{
  // Null input
  try {
    parsePaytmResponse(null);
    assert(false, 'Should throw on null input');
  } catch(e) {
    assert(true, 'Throws on null input');
  }

  // API error response
  try {
    parsePaytmResponse({ error: 'some error', code: 500 });
    assert(false, 'Should throw on error response');
  } catch(e) {
    assert(e.message.includes('Paytm API error'), `Throws meaningful error: ${e.message}`);
  }

  // Missing body.t
  try {
    parsePaytmResponse({ error: null, body: {} });
    assert(false, 'Should throw on missing body.t');
  } catch(e) {
    assert(true, 'Throws on missing body.t');
  }

  // Bus with no fare details
  const nofareFixture = {
    error: null,
    code: 200,
    body: { t: [{ bid: 'test::bus', propn: 'Test Op', btn: 'Sleeper', dep_dt: '2026-11-06 20:00:00', arr_dt: '2026-11-07 06:00:00', dur: '600', df: [], seats: 10, fs: {}, rnr: {}, bp: [], dp: [], btt: [], st: {} }] },
  };
  const noFareBuses = parsePaytmResponse(nofareFixture);
  assert(noFareBuses[0].fare === null, 'fare is null when no valid fare details');
  assert(noFareBuses[0].total_fare === null, 'total_fare is null when no fare');

  // Malformed dep_dt
  const badDateFixture = {
    error: null, code: 200,
    body: { t: [{ bid: 'bad::bus', propn: 'Op', btn: 'Sleeper', dep_dt: null, arr_dt: null, dur: null, df: [{ bf: 500, g: 25, of: 0 }], seats: 5, fs: {}, rnr: {}, bp: [], dp: [], btt: [], st: {} }] },
  };
  const badDateBuses = parsePaytmResponse(badDateFixture);
  assert(badDateBuses[0].departure === null, 'null dep_dt handled gracefully');
}

section('4. filterAfterTime – departure time filtering');
{
  const buses = parsePaytmResponse(fixture);

  // Filter after 17:00 – all fixture buses should pass (they depart 19:00-23:15)
  const after1700 = filterAfterTime(buses, '17:00');
  assert(after1700.length > 0, `After 17:00 filter returns buses (${after1700.length})`);
  assert(after1700.every(b => {
    const h = parseInt((b.departure || '').split(' ')[1]?.split(':')[0] || '0', 10);
    return h >= 17;
  }), 'All filtered buses depart at 17:00 or later');

  // Filter after 23:00 – should reduce results
  const after2300 = filterAfterTime(buses, '23:00');
  assert(after2300.length < after1700.length,
    `After 23:00 returns fewer buses (${after2300.length} < ${after1700.length})`);

  // Bus with null departure is excluded
  const withNullDep = [{ departure: null }, { departure: '2026-11-06 20:00:00' }];
  const result = filterAfterTime(withNullDep, '17:00');
  assert(result.length === 1, 'Bus with null departure is excluded from filter');

  // Exactly at filter time is included
  const exactBus = [{ departure: '2026-11-06 17:00:00' }];
  assert(filterAfterTime(exactBus, '17:00').length === 1,
    'Bus departing exactly at filter time is included');

  // Just before filter time is excluded
  const beforeBus = [{ departure: '2026-11-06 16:59:00' }];
  assert(filterAfterTime(beforeBus, '17:00').length === 0,
    'Bus departing before filter time is excluded');
}

section('5. generateAlerts – new bus detection');
{
  const now = new Date().toISOString();
  const newBus = {
    bus_id: 'new::bus::1',
    operator: 'Test Travels',
    departure: '2026-11-06 20:00:00',
    total_fare: 1500,
  };

  const alerts = generateAlerts([], [newBus], 2000, now);
  const newAlert = alerts.find(a => a.type === 'new_bus');
  assert(newAlert !== undefined, 'New bus alert generated');
  assert(newAlert.bus_id === 'new::bus::1', 'Alert has correct bus_id');
  assert(newAlert.message.includes('Test Travels'), 'Alert message includes operator');
}

section('6. generateAlerts – fare reduction detection');
{
  const now = new Date().toISOString();
  const busId = 'route::bus::1';

  const previous = [{ bus_id: busId, operator: 'Fare Drop Travels', departure: '2026-11-06 21:00:00', total_fare: 1500 }];
  const current  = [{ bus_id: busId, operator: 'Fare Drop Travels', departure: '2026-11-06 21:00:00', total_fare: 1200 }];

  const alerts = generateAlerts(previous, current, 2000, now);
  const fareAlert = alerts.find(a => a.type === 'fare_drop');
  assert(fareAlert !== undefined, 'Fare drop alert generated');
  assert(fareAlert.old_fare === 1500, `old_fare is 1500 (got: ${fareAlert.old_fare})`);
  assert(fareAlert.new_fare === 1200, `new_fare is 1200 (got: ${fareAlert.new_fare})`);
  assert(fareAlert.message.includes('₹1500 → ₹1200'), 'Message shows old → new fare');

  // No fare increase alert
  const currentHigher = [{ bus_id: busId, operator: 'Fare Up', departure: '2026-11-06 21:00:00', total_fare: 1800 }];
  const noAlerts = generateAlerts(previous, currentHigher, 2000, now);
  const falseAlert = noAlerts.find(a => a.type === 'fare_drop');
  assert(falseAlert === undefined, 'No fare_drop alert when fare increases');
}

section('7. generateAlerts – target fare reached');
{
  const now = new Date().toISOString();
  const busId = 'cheap::bus::1';

  // First time at or below target
  const current = [{ bus_id: busId, operator: 'Budget Travels', departure: '2026-11-06 19:00:00', total_fare: 950 }];
  const alerts  = generateAlerts([], current, 1000, now);
  const targetAlert = alerts.find(a => a.type === 'target_reached');
  assert(targetAlert !== undefined, 'Target fare alert generated');
  assert(targetAlert.message.includes('₹950'), 'Alert message includes fare');
  assert(targetAlert.message.includes('₹1000'), 'Alert message includes target');

  // Exactly at target
  const atTarget = [{ bus_id: 'exact::bus', operator: 'X', departure: '2026-11-06 19:00:00', total_fare: 1000 }];
  const atTargetAlerts = generateAlerts([], atTarget, 1000, now);
  assert(atTargetAlerts.some(a => a.type === 'target_reached'),
    'Alert generated when fare exactly equals target');

  // Above target – no alert
  const aboveTarget = [{ bus_id: 'above::bus', operator: 'X', departure: '2026-11-06 19:00:00', total_fare: 1001 }];
  const aboveAlerts = generateAlerts([], aboveTarget, 1000, now);
  assert(!aboveAlerts.some(a => a.type === 'target_reached'),
    'No target_reached alert when fare is above target');
}

section('8. generateAlerts – duplicate alert prevention');
{
  const now = new Date().toISOString();
  const busId = 'dup::bus';

  // Previous observation was already at or below target
  const previous = [{ bus_id: busId, operator: 'X', departure: '2026-11-06 20:00:00', total_fare: 900 }];
  const current  = [{ bus_id: busId, operator: 'X', departure: '2026-11-06 20:00:00', total_fare: 900 }];

  const alerts = generateAlerts(previous, current, 1000, now);
  const targets = alerts.filter(a => a.type === 'target_reached');
  assert(targets.length === 0,
    'No duplicate target_reached when bus was already below target');

  // Same fare, same bus – no fare_drop
  const sameAlerts = generateAlerts(previous, current, 2000, now);
  const drops = sameAlerts.filter(a => a.type === 'fare_drop');
  assert(drops.length === 0, 'No fare_drop when fare is unchanged');
}

section('9. generateAlerts – API failure does NOT trigger fake alerts');
{
  // If current is empty (API error) and previous had buses, no alerts about disappearance
  const now = new Date().toISOString();
  const previous = [
    { bus_id: 'bus::1', operator: 'A', departure: '2026-11-06 20:00:00', total_fare: 1500 },
    { bus_id: 'bus::2', operator: 'B', departure: '2026-11-06 21:00:00', total_fare: 1200 },
  ];
  const emptyAlerts = generateAlerts(previous, [], 1000, now);
  assert(emptyAlerts.length === 0,
    'No spurious alerts when current bus list is empty (API failure scenario)');
}

section('10. Fixture data integrity checks');
{
  const buses = parsePaytmResponse(fixture);

  // Check meta confirmation
  assert(fixture.meta?.scn === 'Ahmedabad', `meta.scn is Ahmedabad (got: ${fixture.meta?.scn})`);
  assert(fixture.meta?.dcn === 'Bhopal', `meta.dcn is Bhopal (got: ${fixture.meta?.dcn})`);
  assert(fixture.meta?.scid === 3461, `meta.scid is 3461 (got: ${fixture.meta?.scid})`);
  assert(fixture.meta?.dcid === 2342, `meta.dcid is 2342 (got: ${fixture.meta?.dcid})`);
  assert(fixture.meta?.dt === '2026-11-06', `meta.dt is 2026-11-06 (got: ${fixture.meta?.dt})`);

  // All buses have bus_id
  const withIds = buses.filter(b => b.bus_id);
  assert(withIds.length === buses.length,
    `All ${buses.length} buses have bus_id`);

  // No bus with fare < 100 (sanity check – fares are in INR)
  const suspiciouslyLow = buses.filter(b => b.fare !== null && b.fare < 100);
  assert(suspiciouslyLow.length === 0,
    `No buses with fare < ₹100 (would indicate wrong units)`);

  // After 17:00 filter on fixture
  const evening = filterAfterTime(buses, '17:00');
  assert(evening.length > 0, `${evening.length} buses depart after 17:00`);
  const lowestFare = Math.min(...evening.filter(b => b.total_fare).map(b => b.total_fare));
  assert(lowestFare > 0, `Lowest fare from fixture: ₹${lowestFare}`);
  console.log(`     ℹ️  Fixture: ${buses.length} total buses, ${evening.length} after 17:00, lowest total fare ₹${lowestFare}`);
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(55)}`);
console.log(`  Tests: ${passed + failed}  Passed: ${passed}  Failed: ${failed}`);
console.log(`${'═'.repeat(55)}\n`);
process.exit(failed > 0 ? 1 : 0);
