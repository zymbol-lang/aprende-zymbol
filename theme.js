/* Zymbol course — theme toggle
   Priority: 1) localStorage  2) system prefers-color-scheme  3) dark (default)
   The <head> inline script applies the class before first paint;
   this module injects the toggle button and keeps it in sync. */

(function () {
  var STORAGE_KEY = 'zy-theme';

  function systemPrefersLight() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function isLight() {
    return document.documentElement.classList.contains('light');
  }

  function applyTheme(light) {
    document.documentElement.classList.toggle('light', light);
    localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark');
    var btn = document.getElementById('zy-theme-btn');
    if (btn) btn.textContent = light ? '☀️' : '🌙';
  }

  function resolveTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light') return true;
    if (stored === 'dark')  return false;
    /* No stored preference — use system */
    return systemPrefersLight();
  }

  function injectButton() {
    if (document.getElementById('zy-theme-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'zy-theme-btn';
    btn.title = 'Cambiar tema claro / oscuro';
    btn.setAttribute('aria-label', 'Cambiar tema');
    btn.textContent = isLight() ? '☀️' : '🌙';
    btn.addEventListener('click', function () { applyTheme(!isLight()); });
    document.body.appendChild(btn);
  }

  /* Sync if system preference changes while page is open (no stored override) */
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
