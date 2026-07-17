(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const utils = {
    debounce(func, delay = 120) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },

    throttle(func, wait = 120) {
      let lastCall = 0;
      return (...args) => {
        const now = Date.now();
        if (now - lastCall >= wait) {
          lastCall = now;
          func(...args);
        }
      };
    },

    formatNumber(value, digits = 2) {
      const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
      return safeValue.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits === 0 ? 0 : 0 });
    },

    formatDate(value) {
      try {
        return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (error) {
        return '';
      }
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    generateId(prefix = 'id') {
      return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
    },

    qs(selector, context = document) {
      return context.querySelector(selector);
    },

    qsa(selector, context = document) {
      return Array.from(context.querySelectorAll(selector));
    },

    on(target, event, handler, options = false) {
      if (!target) return;
      target.addEventListener(event, handler, options);
    },

    off(target, event, handler, options = false) {
      if (!target) return;
      target.removeEventListener(event, handler, options);
    },

    async copyToClipboard(text) {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return false;
    },

    smoothScroll(target, options = {}) {
      const behavior = options.behavior || 'smooth';
      const block = options.block || 'start';
      if (typeof target === 'string') {
        const element = this.qs(target);
        if (element) {
          element.scrollIntoView({ behavior, block });
        }
        return;
      }
      target?.scrollIntoView({ behavior, block });
    },

    getPageName() {
      const path = root.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
      return path.replace(/\.html$/i, '') || 'home';
    },

    escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };

  namespace.utils = utils;
  namespace.modules.utils = {
    init() {
      namespace.debug = namespace.debug ?? false;
    }
  };
})(window);
