(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const analytics = {
    init() {
      const trackEvent = (eventName, payload = {}) => {
        if (root.gtag) {
          root.gtag('event', eventName, payload);
          return;
        }
        if (namespace.debug) {
          console.info('[analytics]', eventName, payload);
        }
      };

      root.document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-analytics]');
        if (!trigger) return;
        trackEvent(trigger.dataset.analytics, { label: trigger.textContent.trim() });
      });

      trackEvent('page_view', { path: root.location.pathname });
    }
  };

  namespace.modules.analytics = analytics;
})(window);
