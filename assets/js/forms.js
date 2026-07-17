(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const utils = namespace.utils || {};
  const storage = namespace.storage || {};

  const forms = {
    init() {
      this._bindGlobal();
      this._enhanceForms();
    },

    _bindGlobal() {
      // sensible defaults for inputs
      root.document.querySelectorAll('input, textarea, select').forEach((input) => {
        if (!input.getAttribute('autocomplete')) input.setAttribute('autocomplete', 'on');
        input.addEventListener('focus', () => input.classList.add('focused'));
        input.addEventListener('blur', () => input.classList.remove('focused'));
      });
    },

    _enhanceForms() {
      const forms = Array.from(root.document.querySelectorAll('form'));
      forms.forEach((form) => {
        // mark enhanced forms
        form.setAttribute('data-enhanced', 'true');

        // attach validation on input
        form.addEventListener('input', this._debounce((event) => {
          const target = event.target;
          if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
            this.validateField(target);
          }
        }, 200));

        // handle submit
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          this.clearValidation(form);
          const payload = this.serialize(form);
          const errors = this.validateForm(form, payload);
          if (errors.length) {
            this.showValidation(form, errors[0]);
            return;
          }

          // form-specific handling via data-form-type or event listener
          const formType = form.getAttribute('data-form-type') || form.dataset.type || null;
          const handlerEvent = new CustomEvent('agri:form:submit', { detail: { form, payload, formType } });
          root.document.dispatchEvent(handlerEvent);
          // mark submitted state
          form.classList.add('submitted');
        });

        // reset handling
        form.addEventListener('reset', () => {
          this.clearValidation(form);
          form.classList.remove('submitted', 'loading');
        });
      });
    },

    _debounce(fn, wait = 120) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    sanitize(value) {
      if (value === null || value === undefined) return '';
      return String(value).trim().replace(/[<>]/g, '');
    },

    serialize(form) {
      const data = {};
      new FormData(form).forEach((value, key) => {
        data[key] = this.sanitize(value);
      });
      return data;
    },

    validateField(field) {
      const name = field.name || field.id || 'field';
      const value = this.sanitize(field.value || '');
      const type = field.getAttribute('type');
      const required = field.hasAttribute('required');
      const max = field.getAttribute('max');
      const min = field.getAttribute('min');
      const maxlength = field.getAttribute('maxlength');

      field.removeAttribute('aria-invalid');
      field.classList.remove('invalid');

      if (required && value === '') {
        this._attachFieldError(field, `${name} is required.`);
        return false;
      }

      if (type === 'email' && value) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!ok) {
          this._attachFieldError(field, 'Please enter a valid email address.');
          return false;
        }
      }

      if ((type === 'number' || field.tagName === 'INPUT' && field.getAttribute('inputmode') === 'numeric') && value) {
        const n = Number(value);
        if (!Number.isFinite(n)) {
          this._attachFieldError(field, `${name} must be a valid number.`);
          return false;
        }
        if (min !== null && min !== '' && n < Number(min)) {
          this._attachFieldError(field, `${name} cannot be less than ${min}.`);
          return false;
        }
        if (max !== null && max !== '' && n > Number(max)) {
          this._attachFieldError(field, `${name} cannot be greater than ${max}.`);
          return false;
        }
      }

      if (maxlength && value.length > Number(maxlength)) {
        this._attachFieldError(field, `${name} cannot exceed ${maxlength} characters.`);
        return false;
      }

      // passed
      this._clearFieldError(field);
      return true;
    },

    validateForm(form, payload) {
      const errors = [];
      const fields = Array.from(form.querySelectorAll('input, textarea, select'));
      fields.forEach((field) => {
        if (!this.validateField(field)) {
          const message = field.getAttribute('aria-describedby') || field.title || `${field.name || field.id} is invalid`;
          errors.push(message);
        }
      });
      return errors;
    },

    _attachFieldError(field, message) {
      field.setAttribute('aria-invalid', 'true');
      field.classList.add('invalid');
      let err = field.nextElementSibling;
      if (!err || !err.classList || !err.classList.contains('field-error')) {
        err = root.document.createElement('div');
        err.className = 'field-error';
        field.insertAdjacentElement('afterend', err);
      }
      err.textContent = message;
      err.setAttribute('role', 'alert');
    },

    _clearFieldError(field) {
      field.removeAttribute('aria-invalid');
      field.classList.remove('invalid');
      const err = field.nextElementSibling;
      if (err && err.classList && err.classList.contains('field-error')) {
        err.remove();
      }
    },

    clearValidation(form) {
      form.querySelectorAll('[aria-invalid]').forEach((f) => {
        f.removeAttribute('aria-invalid');
        f.classList.remove('invalid');
      });
      form.querySelectorAll('.field-error').forEach((el) => el.remove());
    },

    showValidation(form, message) {
      let container = form.querySelector('[data-validation-message]');
      if (!container) {
        container = root.document.createElement('div');
        container.className = 'validation-message error';
        container.setAttribute('data-validation-message', '');
        container.setAttribute('role', 'alert');
        form.insertBefore(container, form.firstChild);
      }
      container.textContent = message;
      // announce via notification if available
      try {
        namespace.modules.notifications?.show('error', message);
      } catch (e) {}
    }
  };

  namespace.modules.forms = forms;
})(window);
