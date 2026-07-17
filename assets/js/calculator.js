(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const registry = [];
  const storage = namespace.storage || {};
  const utils = namespace.utils || {};
  const escapeHtml = utils.escapeHtml || ((value) => String(value));

  const formatNumber = (value, digits = 2) => {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    return safeValue.toLocaleString('en-PK', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits === 0 ? 0 : 2
    });
  };

  const formatCurrency = (value) => {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(safeValue);
  };

  const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const calculator = {
    registry,

    registerCalculator(config) {
      registry.push(config);
    },

    init() {
      const forms = root.document.querySelectorAll('form[data-calculator-form]');
      forms.forEach((form) => this.bindForm(form));
    },

    bindForm(form) {
      const result = form.querySelector('[data-calculator-result]');
      const validationMessage = form.querySelector('[data-validation-message]');
      const historyPanel = form.querySelector('[data-history-panel]');
      const historyList = form.querySelector('[data-history-list]');
      const actions = form.querySelector('[data-calculator-actions]');
      const entry = this.getEntry(form);

      if (!result || !entry) return;

      const renderHistory = () => {
        if (!historyList) return;
        const history = storage.get ? storage.get('calculator-history', []) : [];
        const items = Array.isArray(history) ? history.filter((item) => item.formId === form.id) : [];
        if (!items.length) {
          historyList.innerHTML = '<p class="empty-state">No saved calculations yet.</p>';
          return;
        }

        historyList.innerHTML = items.map((item) => `
          <article class="history-item">
            <div>
              <strong>${escapeHtml(item.title || 'Saved result')}</strong>
              <p>${escapeHtml(item.summary || '')}</p>
            </div>
            <div class="history-actions">
              <button type="button" class="ghost-btn" data-history-reuse="${item.id}">Reuse</button>
              <button type="button" class="ghost-btn" data-history-delete="${item.id}">Delete</button>
            </div>
          </article>
        `).join('');
      };

      const clearValidation = () => {
        if (validationMessage) {
          validationMessage.textContent = '';
          validationMessage.className = 'validation-message';
        }
      };

      const showValidation = (message) => {
        if (validationMessage) {
          validationMessage.textContent = message;
          validationMessage.className = 'validation-message error';
        }
      };

      const renderResult = (payload, resultData) => {
        const title = result.querySelector('[data-result-title]');
        const summary = result.querySelector('[data-result-summary]');
        const formula = result.querySelector('[data-result-formula]');
        const details = result.querySelector('[data-result-details]');
        const placeholder = result.querySelector('[data-result-placeholder]');

        if (title) {
          title.textContent = resultData.title || 'Calculation Result';
        }
        if (summary) {
          summary.innerHTML = `<strong>${escapeHtml(resultData.summary || '')}</strong>`;
        }
        if (formula) {
          formula.textContent = resultData.formula || 'Formula applied';
        }
        if (details) {
          details.innerHTML = (resultData.lines || []).map((line) => `<li>${escapeHtml(line)}</li>`).join('');
        }
        if (placeholder) {
          placeholder.remove();
        }
        result.dataset.payload = JSON.stringify(payload);
        result.dataset.summary = resultData.summary || '';
      };

      const saveHistory = (payload, resultData) => {
        if (!storage.set) return;
        const history = Array.isArray(storage.get('calculator-history', [])) ? storage.get('calculator-history', []) : [];
        const entryRecord = {
          id: `${form.id}-${Date.now()}`,
          formId: form.id,
          title: resultData.title || entry.title || form.id,
          summary: resultData.summary || '',
          payload,
          timestamp: new Date().toISOString()
        };
        const nextHistory = [entryRecord, ...history.filter((item) => item.formId !== form.id)].slice(0, 12);
        storage.set('calculator-history', nextHistory);
        renderHistory();
      };

      const handleAction = (action) => {
        const payload = this.getPayload(form);
        if (!result.dataset.summary && action !== 'reset') {
          return;
        }

        switch (action) {
          case 'reset':
            form.reset();
            clearValidation();
            if (result.querySelector('[data-result-summary]')) {
              result.querySelector('[data-result-summary]').innerHTML = '<strong>Enter your values to see the estimate.</strong>';
            }
            if (result.querySelector('[data-result-details]')) {
              result.querySelector('[data-result-details]').innerHTML = '';
            }
            if (result.querySelector('[data-result-formula]')) {
              result.querySelector('[data-result-formula]').textContent = 'Results will appear here.';
            }
            if (result.querySelector('[data-result-title]')) {
              result.querySelector('[data-result-title]').textContent = 'Result';
            }
            if (!result.querySelector('[data-result-placeholder]')) {
              const placeholder = root.document.createElement('p');
              placeholder.setAttribute('data-result-placeholder', '');
              placeholder.textContent = 'Enter your values to see the estimate.';
              result.appendChild(placeholder);
            }
            delete result.dataset.payload;
            delete result.dataset.summary;
            break;
          case 'copy':
            navigator.clipboard?.writeText(result.dataset.summary || '').catch(() => {});
            break;
          case 'print':
            root.print();
            break;
          case 'share':
            if (navigator.share) {
              navigator.share({
                title: entry.title || 'AgriCalc Pakistan result',
                text: result.dataset.summary || ''
              }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(result.dataset.summary || '').catch(() => {});
            }
            break;
          case 'export-json':
            this.exportResult(payload, result.dataset.summary || '', 'json');
            break;
          case 'export-csv':
            this.exportResult(payload, result.dataset.summary || '', 'csv');
            break;
          default:
            break;
        }
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearValidation();
        const payload = this.getPayload(form);
        const errors = this.validateForm(payload, entry);
        if (errors.length) {
          showValidation(errors[0]);
          return;
        }
        const resultData = entry.calculate(payload, form);
        renderResult(payload, resultData);
        saveHistory(payload, resultData);
      });

      actions?.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', () => handleAction(button.getAttribute('data-action')));
      });

      historyList?.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const id = target.getAttribute('data-history-reuse');
        const deleteId = target.getAttribute('data-history-delete');
        if (id) {
          const history = Array.isArray(storage.get('calculator-history', [])) ? storage.get('calculator-history', []) : [];
          const item = history.find((entryItem) => entryItem.id === id);
          if (item?.payload) {
            Object.entries(item.payload).forEach(([name, value]) => {
              const field = form.elements.namedItem(name);
              if (field) {
                field.value = value;
              }
            });
          }
        }
        if (deleteId) {
          const history = Array.isArray(storage.get('calculator-history', [])) ? storage.get('calculator-history', []) : [];
          const nextHistory = history.filter((entryItem) => entryItem.id !== deleteId);
          storage.set('calculator-history', nextHistory);
          renderHistory();
        }
      });

      renderHistory();
    },

    getEntry(form) {
      return registry.find((item) => item.formId === form.id) || registry.find((item) => item.formSelector === `#${form.id}`);
    },

    getPayload(form) {
      return Object.fromEntries(new FormData(form).entries());
    },

    validateForm(payload, entry) {
      const errors = [];
      const fields = entry.fields || [];
      fields.forEach((field) => {
        const value = payload[field.name];
        const label = field.label || field.name;
        if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
          errors.push(`${label} is required.`);
          return;
        }
        if (field.type === 'number' && value !== undefined) {
          const parsed = parseNumber(value);
          if (parsed === null) {
            errors.push(`${label} must be a valid number.`);
          } else if (field.min !== undefined && parsed < field.min) {
            errors.push(`${label} cannot be less than ${field.min}.`);
          }
        }
      });
      if (entry.validate) {
        const customErrors = entry.validate(payload);
        if (Array.isArray(customErrors)) {
          errors.push(...customErrors);
        } else if (typeof customErrors === 'string') {
          errors.push(customErrors);
        }
      }
      return errors;
    },

    exportResult(payload, summary, format = 'json') {
      const content = format === 'csv'
        ? ['field,value', ...Object.entries(payload).map(([key, value]) => `${key},${value}`)].join('\n')
        : JSON.stringify({ payload, summary }, null, 2);
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;' });
      const url = root.URL.createObjectURL(blob);
      const link = root.document.createElement('a');
      link.href = url;
      link.download = `agri-calc-${Date.now()}.${format}`;
      link.click();
      root.URL.revokeObjectURL(url);
    }
  };

  namespace.modules.calculator = calculator;
})(window);