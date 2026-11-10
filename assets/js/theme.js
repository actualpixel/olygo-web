/* Applies saved theme before first paint (loaded in <head>, CSP-safe) */
(function () {
  try {
    var t = localStorage.getItem('olygo-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) { /* storage unavailable */ }
  document.documentElement.classList.remove('no-js');
})();
