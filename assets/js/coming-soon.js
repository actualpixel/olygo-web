/* Olygo — pre-launch page: countdown + waitlist (no third-party code) */
(function () {
  'use strict';

  /* ---------- Countdown ---------- */
  var cd = document.getElementById('countdown');
  if (cd) {
    var launch = Date.parse(cd.getAttribute('data-launch'));
    var els = {};
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (u) {
      els[u] = cd.querySelector('[data-unit="' + u + '"]');
    });
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    var timer;
    var tick = function () {
      var diff = Math.max(0, launch - Date.now());
      var s = Math.floor(diff / 1000);
      els.days.textContent = pad(Math.floor(s / 86400));
      els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      els.seconds.textContent = pad(s % 60);
      if (diff === 0) {
        clearInterval(timer);
        cd.classList.add('is-live');
        cd.setAttribute('aria-label', 'Olygo is live');
      }
    };
    if (!isNaN(launch)) { tick(); timer = setInterval(tick, 1000); }
  }

  /* ---------- Waitlist ---------- */
  var form = document.getElementById('waitlist');
  if (!form) return;
  var input = form.querySelector('input[type="email"]');
  var honeypot = form.querySelector('input[name="company"]');
  var status = form.querySelector('.wl-status');
  var btn = form.querySelector('button[type="submit"]');
  var btnText = form.querySelector('.wl-btn-text');
  var endpoint = (form.getAttribute('data-endpoint') || '').trim();
  var fallback = (form.getAttribute('data-fallback') || '').trim();
  var EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

  var setStatus = function (msg, kind) {
    status.textContent = msg;
    status.className = 'wl-status' + (kind ? ' is-' + kind : '');
  };
  var done = function () {
    form.classList.add('is-done');
    input.value = '';
    btnText.textContent = 'You’re on the list';
    btn.disabled = true;
    setStatus('Thanks! We’ll email your invite on launch day. 💌', 'ok');
  };

  input.addEventListener('input', function () {
    if (status.classList.contains('is-error')) setStatus('');
    input.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (honeypot && honeypot.value) { done(); return; } // bots fill hidden fields

    var email = input.value.trim();
    if (!EMAIL.test(email) || email.length > 254) {
      input.setAttribute('aria-invalid', 'true');
      setStatus('Please enter a valid email address.', 'error');
      input.focus();
      return;
    }

    if (!endpoint) {
      // No form service configured yet: hand off to the visitor's email app.
      if (fallback) {
        var body = 'Please add me to the Olygo waitlist.\n\nEmail: ' + email;
        window.location.href = 'mailto:' + fallback +
          '?subject=' + encodeURIComponent('Olygo waitlist') + '&body=' + encodeURIComponent(body);
        setStatus('Opening your email app — just hit send to join.', 'ok');
      }
      return;
    }

    btn.disabled = true;
    btnText.textContent = 'Joining…';
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: email, source: 'olygo-coming-soon' }),
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin'
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      done();
    }).catch(function () {
      btn.disabled = false;
      btnText.textContent = 'Join the waitlist';
      setStatus('Something went wrong. Please try again in a moment.', 'error');
    });
  });
})();
