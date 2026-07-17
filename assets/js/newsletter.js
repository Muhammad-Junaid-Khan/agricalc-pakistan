(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const KEY = 'newsletter-subscribers';
  const newsletter = {
    init() {
      const form = root.document.querySelector('.newsletter form');
      if (!form) return;

      form.setAttribute('data-form-type', 'newsletter');

      // wire into forms engine if present
      document.addEventListener('agri:form:submit', (e) => {
        const { form: f, payload, formType } = e.detail || {};
        if (formType !== 'newsletter') return;
        this._submit(f, payload);
      });

      // fallback for direct submit
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const payload = { email: (form.querySelector('input[type="email"]')?.value || '').trim() };
        this._submit(form, payload);
      });
    },

    _submit(form, payload) {
      const email = (payload.email || '').toLowerCase().trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this._showMessage(form, 'Please enter a valid email address.', 'error');
        return;
      }

      const subs = namespace.storage.get(KEY, []);
      if (Array.isArray(subs) && subs.includes(email)) {
        this._showMessage(form, 'You are already subscribed.', 'info');
        return;
      }

      const next = Array.isArray(subs) ? [...subs, email] : [email];
      namespace.storage.set(KEY, next.slice(-5000));
      this._showMessage(form, 'Thank you for subscribing!', 'success');
      form.reset();
    },

    _showMessage(form, text, type = 'info') {
      let el = form.querySelector('[data-form-message]');
      if (!el) {
        el = document.createElement('div');
        el.setAttribute('data-form-message', '');
        form.appendChild(el);
      }
      el.textContent = text;
      el.className = `form-${type}`;
      try {
        namespace.modules.notifications?.show(type, text);
      } catch (e) {}
    }
  };

  namespace.modules.newsletter = newsletter;
})(window);
