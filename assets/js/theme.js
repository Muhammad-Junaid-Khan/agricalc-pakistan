(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const storage = namespace.storage || {};

  const theme = {
    init() {
      const themeKey = 'theme';
      const buttons = root.document.querySelectorAll('[data-theme-toggle]');
      const storedTheme = storage.get ? storage.get(themeKey, null) : null;
      const systemDark = root.matchMedia('(prefers-color-scheme: dark)').matches;
      const currentTheme = storedTheme || (systemDark ? 'dark' : 'light');

      const applyTheme = (nextTheme) => {
        root.document.documentElement.setAttribute('data-theme', nextTheme);
        root.document.body.classList.toggle('dark-mode', nextTheme === 'dark');
        root.document.documentElement.style.colorScheme = nextTheme;
        buttons.forEach((button) => {
          button.textContent = nextTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        });
      };

      applyTheme(currentTheme);

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const nextTheme = root.document.body.classList.contains('dark-mode') ? 'light' : 'dark';
          applyTheme(nextTheme);
          if (storage.set) {
            storage.set(themeKey, nextTheme);
          }
        });
      });
    }
  };

  namespace.modules.theme = theme;
})(window);
