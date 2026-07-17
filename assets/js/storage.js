(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const VERSION = 'v1';
  const storageAvailable = (() => {
    try {
      const testKey = '__agri_test__';
      root.localStorage.setItem(testKey, testKey);
      root.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  })();

  const storage = {
    get(key, fallback = null) {
      if (!storageAvailable) return fallback;
      const value = root.localStorage.getItem(`${VERSION}:${key}`);
      if (!value) return fallback;
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    },

    set(key, value) {
      if (!storageAvailable) return false;
      const serialised = typeof value === 'string' ? value : JSON.stringify(value);
      root.localStorage.setItem(`${VERSION}:${key}`, serialised);
      return true;
    },

    remove(key) {
      if (!storageAvailable) return false;
      root.localStorage.removeItem(`${VERSION}:${key}`);
      return true;
    },

    push(key, value) {
      const list = this.get(key, []);
      const next = Array.isArray(list) ? [...list, value] : [value];
      this.set(key, next.slice(-8));
      return next;
    }
    ,

    has(key) {
      if (!storageAvailable) return false;
      return root.localStorage.getItem(`${VERSION}:${key}`) !== null;
    },

    clear() {
      if (!storageAvailable) return false;
      // Remove only our keys (prefix with VERSION:)
      try {
        Object.keys(root.localStorage).forEach((k) => {
          if (k && k.indexOf(`${VERSION}:`) === 0) {
            root.localStorage.removeItem(k);
          }
        });
        return true;
      } catch (e) {
        return false;
      }
    },

    exportJSON(key) {
      const data = this.get(key, null);
      try {
        return JSON.stringify({ key, data }, null, 2);
      } catch (e) {
        return null;
      }
    },

    importJSON(jsonText) {
      try {
        const parsed = JSON.parse(jsonText);
        if (!parsed || typeof parsed !== 'object') return false;
        if (parsed.key && parsed.data !== undefined) {
          this.set(parsed.key, parsed.data);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  };

  namespace.storage = storage;
  namespace.modules.storage = {
    init() {
      namespace.storage = storage;
    }
  };
})(window);
