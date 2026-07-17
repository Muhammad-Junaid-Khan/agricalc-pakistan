(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const utils = namespace.utils || {};

  const navigation = {
    init() {
      const header = root.document.querySelector('.header');
      const navToggle = root.document.querySelector('.menu-toggle');
      const navList = root.document.querySelector('.nav__list');
      const overlay = root.document.querySelector('.site-overlay');
      const backToTop = root.document.querySelector('.back-to-top');
      const links = Array.from(root.document.querySelectorAll('.nav__list a'));
      const activeLink = links.find((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return false;
        const normalizedPath = root.location.pathname.replace(/\/$/, '');
        const normalizedHref = href.replace(/^\.\//, '').replace(/\.html$/i, '');
        return normalizedPath.endsWith(`/${normalizedHref}`) || normalizedPath === `/${normalizedHref}`;
      });

      if (activeLink) {
        activeLink.classList.add('active');
      }

      const setMenuState = (isOpen) => {
        navList?.classList.toggle('active', isOpen);
        overlay?.classList.toggle('active', isOpen);
        navToggle?.setAttribute('aria-expanded', String(isOpen));
        root.document.body.style.overflow = isOpen ? 'hidden' : '';
        root.document.body.classList.toggle('nav-open', isOpen);

        if (isOpen) {
          const focusableItem = navList?.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          focusableItem?.focus();
        }
      };

      const closeMenu = () => setMenuState(false);
      const openMenu = () => setMenuState(true);

      navToggle?.addEventListener('click', () => {
        const isActive = navList?.classList.contains('active');
        if (isActive) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      overlay?.addEventListener('click', closeMenu);
      root.document.addEventListener('click', (event) => {
        if (!navList?.contains(event.target) && !navToggle?.contains(event.target) && navList?.classList.contains('active')) {
          closeMenu();
        }
      });

      root.document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navList?.classList.contains('active')) {
          closeMenu();
          navToggle?.focus();
        }
      });

      const trapFocus = (event) => {
        if (!navList?.classList.contains('active') || event.key !== 'Tab') return;
        const focusableItems = Array.from(navList.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        if (!focusableItems.length) {
          event.preventDefault();
          return;
        }

        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];
        if (event.shiftKey && root.document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && root.document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      };

      root.document.addEventListener('keydown', trapFocus);

      const onScroll = utils.throttle(() => {
        header?.classList.toggle('header--scrolled', root.scrollY > 20);
        backToTop?.classList.toggle('visible', root.scrollY > 500);
      }, 100);

      root.addEventListener('scroll', onScroll, { passive: true });

      backToTop?.addEventListener('click', () => {
        utils.smoothScroll(root.document.body);
      });

      utils.qsa('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
          const href = anchor.getAttribute('href');
          const target = href ? root.document.querySelector(href) : null;
          if (target) {
            event.preventDefault();
            utils.smoothScroll(target);
            closeMenu();
          }
        });
      });
    }
  };

  namespace.modules.navigation = navigation;
})(window);
