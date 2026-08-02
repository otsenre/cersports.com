/* schedule.js — render the published times from ONE source.
 *
 * Any element with data-schedule="<key>" gets its text replaced by that key
 * from schedule.json. Include with <script defer src="schedule.js"></script>.
 *
 * WHY THIS EXISTS: the times used to be literal strings on every page, and they
 * drifted apart silently. On 2026-08-01 the hero said 7:50, the same page's
 * how-it-works said 8:05, outro.html said 8:05, the bot said 8:30 and the email
 * said ~8:05 — four live promises, because correcting the time meant finding
 * every copy by hand and nobody ever found them all.
 *
 * THE ELEMENT'S EXISTING TEXT IS THE FALLBACK AND MUST STAY CORRECT. If the
 * fetch fails, or a social-card screenshot is captured before it resolves, the
 * page keeps its shipped value rather than going blank. That is why
 * check_published_times.py asserts the inline fallbacks still match the JSON:
 * a fallback that rots is just the old bug with extra steps.
 *
 * NOTE: <meta> tags are deliberately NOT handled here. Crawlers read the static
 * HTML before any JS runs, so og:description must stay a literal string; the
 * checker verifies it against schedule.json instead.
 */
(function () {
  'use strict';

  var URL = 'schedule.json?t=' + Date.now();

  function apply(data) {
    var nodes = document.querySelectorAll('[data-schedule]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-schedule');
      var value = data[key];
      if (typeof value === 'string' && value.length) {
        nodes[i].textContent = value;
      }
      // No else: an unknown key keeps the fallback text on purpose. A missing
      // value must never blank a customer-facing promise.
    }
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
