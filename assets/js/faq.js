(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const faq = {
    init() {
      const buttons = root.document.querySelectorAll('.faq-card button');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', String(!expanded));
          const panel = button.nextElementSibling;
          if (panel) {
            panel.style.display = expanded ? 'none' : 'block';
          }
        });
      });
    }
  };

  namespace.modules.faq = faq;
})(window);
