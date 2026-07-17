(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const blog = {
    init() {
      const filterBar = root.document.querySelector('[data-blog-filter]');
      const cards = root.document.querySelectorAll('.article-card, .blog-card');

      if (!filterBar || !cards.length) return;

      filterBar.addEventListener('change', (event) => {
        const value = event.target.value.toLowerCase();
        cards.forEach((card) => {
          const category = card.dataset.category || '';
          const matches = !value || category.includes(value);
          card.style.display = matches ? '' : 'none';
        });
      });
    }
  };

  namespace.modules.blog = blog;
})(window);