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
 * THE FALLBACK IS THE WORD "unavailable", NOT A NUMBER. Ernie, 2026-08-28: "if
 * the json file with all the stats fails, there should be a place holder,
 * unavailable." Nothing here is hardcoded; every figure is read from the file.
 *
 * It used to be a shipped value, and that value rotted -- on 2026-08-28 blind
 * .html carried -46.32u against a published -47.57u, 3-3 against 2-4, and 18-16
 * against 13-16. Every one of those was FLATTERING. A visitor whose fetch failed
 * was shown a better record than the real one, on the page whose only job is
 * proof, and nothing on screen said it was stale. A placeholder cannot be wrong
 * in our favour; a number can, and did.
 *
 * check_published_records.py enforces the pair: an inline value must be either
 * exactly what the JSON publishes or one of its PLACEHOLDERS.
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
        // Opt-in sign colouring. The PUBLISHED string decides it, so a page
        // never re-derives "are we up?" from numbers of its own — that second
        // calculation is how a page ends up green on a losing figure.
        if (nodes[i].hasAttribute('data-record-sign')) {
          var head = value.charAt(0);
          var tail = value.charAt(value.length - 1).toUpperCase();
          nodes[i].classList.remove('pos', 'neg');
          if (head === '+') nodes[i].classList.add('pos');
          else if (head === '-') nodes[i].classList.add('neg');
          // A streak reads "7W" / "3L" — signed by its last character, not its
          // first. Still the PUBLISHED string deciding, which is the point.
          else if (tail === 'W') nodes[i].classList.add('pos');
          else if (tail === 'L') nodes[i].classList.add('neg');
        }
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
