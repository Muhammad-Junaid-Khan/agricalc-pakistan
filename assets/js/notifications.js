/* Notifications (toasts) module - simple queue, accessible */
(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const containerId = 'agri-notifications';

  function createContainer() {
    let c = document.getElementById(containerId);
    if (c) return c;
    c = document.createElement('div');
    c.id = containerId;
    c.className = 'notifications';
    c.setAttribute('aria-live', 'polite');
    c.setAttribute('aria-atomic', 'true');
    document.body.appendChild(c);
    return c;
  }

  const notifications = {
    show(type, message, opts = {}) {
      const c = createContainer();
      const id = `n-${Date.now()}`;
      const el = document.createElement('div');
      el.className = `notification ${type || 'info'}`;
      el.id = id;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
      el.innerHTML = `<div class="notification-body">${escapeHtml(message)}</div><button class="notification-close" aria-label="Dismiss">×</button>`;
      c.appendChild(el);

      const closeBtn = el.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => this._dismiss(el));

      const timeout = typeof opts.timeout === 'number' ? opts.timeout : (type === 'error' ? 8000 : 4000);
      el._timeout = setTimeout(() => this._dismiss(el), timeout);
      return el;
    },

    _dismiss(el) {
      if (!el) return;
      clearTimeout(el._timeout);
      el.classList.add('dismiss');
      setTimeout(() => el.remove(), 300);
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  namespace.modules.notifications = notifications;
})(window);
