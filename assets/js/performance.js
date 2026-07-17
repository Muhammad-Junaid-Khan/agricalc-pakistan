(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const utils = namespace.utils || {};

  const performance = {
    init() {
      const images = Array.from(root.document.querySelectorAll('img[loading="lazy"]'));
      if (!('IntersectionObserver' in root) || !images.length) {
        images.forEach((image) => image.classList.add('loaded'));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const image = entry.target;
          image.classList.add('loaded');
          observer.unobserve(image);
        });
      }, { rootMargin: '200px 0px' });

      images.forEach((image) => observer.observe(image));

      const onScroll = utils.throttle(() => {
        root.requestAnimationFrame(() => {
          root.document.body.classList.toggle('is-scrolling', root.scrollY > 20);
        });
      }, 120);

      root.addEventListener('scroll', onScroll, { passive: true });
    }
  };

  namespace.modules.performance = performance;
})(window);
