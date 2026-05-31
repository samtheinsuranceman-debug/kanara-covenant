/**
 * Simple client-side partial injector for header/footer.
 * Keeps the site pure vanilla while improving maintainability.
 * Include this script at the end of <body> in pages that want the shared nav.
 */
(function () {
  'use strict';

  async function injectPartial(selector, url) {
    const target = document.querySelector(selector);
    if (!target) return;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      const html = await res.text();
      target.innerHTML = html;
    } catch (e) {
      // Fallback: if partials fail to load (e.g. file:// protocol), leave existing content
      console.warn('Nav partial injection failed (using inline fallback):', e.message);
    }
  }

  // Inject when DOM is ready
  function init() {
    // Header
    injectPartial('header[data-partial="header"]', 'partials/header.html');
    // Footer
    injectPartial('footer[data-partial="footer"]', 'partials/footer.html');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();