/* record.js — render the published RECORD from ONE source.
 *
 * Any element with data-record="<key>" gets its text replaced by that key from
 * scorecard.json's `keys` block. Include with:
 *     <script defer src="record.js"></script>
 *
 * WHY THIS EXISTS: this is schedule.js's bug one field over. The times used to
 * be literals on every page and drifted apart silently; records are worse,
 * because a record is not just inconsistent when it rots, it is FALSE — and the
 * shirt QR sends a stranger to a landing page whose only job is proof. On
 * 2026-08-26 blind.html showed a settled LOSS from the previous day as "today's
 * free pick" to anyone who scanned a shirt, because it resolved the pick by
 * guessing instead of reading the snapshot.
 *
 * THE ELEMENT'S EXISTING TEXT IS THE FALLBACK AND MUST STAY CORRECT. If the
 * fetch fails, or a social-card screenshot is captured before it resolves, the
 * page keeps its shipped value rather than going blank or showing a zero.
 * check_published_records.py asserts those inline fallbacks still match the
 * JSON: a fallback that rots is just the old bug with extra steps.
 *
 * KEYS ARE COMPUTED BY THE PRODUCER (brand/gauge.py:_flat_keys), not here. This
 * file does no arithmetic and no formatting on purpose — a page must never be
 * able to compute a record, only display one that the ledger already published.
 *
 * NOTE: <meta> tags are deliberately NOT handled here. Crawlers read the static
 * HTML before any JS runs, so og:description stays a literal string.
 */
(function () {
  'use strict';

  var URL = 'scorecard.json?t=' + Date.now();

  function apply(data) {
    var keys = (data && data.keys) || {};
    var nodes = document.querySelectorAll('[data-record]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-record');
      var value = keys[key];
      if (typeof value === 'string' && value.length) {
        nodes[i].textContent = value;
      }
      // No else: an unknown key, or one whose value is empty because the pick
      // is still held, keeps the fallback text on purpose. A missing value must
      // never blank — or worse, zero out — a customer-facing claim.
    }
    document.documentElement.setAttribute('data-record-ready', '1');
  }

  function load() {
    fetch(URL)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) apply(d); })
      .catch(function () { /* keep the inline fallbacks */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
