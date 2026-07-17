(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  namespace.debug = namespace.debug ?? false;

  const moduleOrder = [
    'utils',
    'storage',
    'notifications',
    'performance',
    'theme',
    'navigation',
    'search',
    'blog',
    'faq',
    'newsletter',
    'forms',
    'analytics',
    'calculator',
    'crop-calculator',
    'fertilizer-calculator',
    'profit-calculator',
    'seed-calculator',
    'water-calculator',
    'converter'
  ];

  const loadModule = (name) => new Promise((resolve, reject) => {
    if (namespace.modules[name]?.init) {
      resolve();
      return;
    }

    const isNestedPage = root.location.pathname.includes('/tools/');
    const script = root.document.createElement('script');
    script.src = isNestedPage ? `../assets/js/${name}.js` : `assets/js/${name}.js`;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${name}`));
    root.document.head.appendChild(script);
  });

  const bootstrap = async () => {
    try {
      for (const name of moduleOrder) {
        await loadModule(name);
      }

      for (const name of moduleOrder) {
        if (namespace.modules[name]?.init) {
          namespace.modules[name].init();
        }
      }
    } catch (error) {
      if (namespace.debug) {
        console.error('[app]', error);
      }
    }
  };

  root.addEventListener('DOMContentLoaded', () => {
    bootstrap().then(() => {
      // Register service worker when available
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          if (namespace.debug) console.log('SW registered', reg);
          // listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // new content available
                  document.dispatchEvent(new CustomEvent('agri:sw:update')); 
                }
              }
            });
          });
        }).catch((err) => { if (namespace.debug) console.warn('SW failed', err); });
      }

      // beforeinstallprompt - keep event and show install UI
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.AgriCalc = window.AgriCalc || {};
        window.AgriCalc.deferredPrompt = e;
        // show a subtle UI affordance
        try {
          namespace.modules.notifications.show('info', 'Install AgriCalc for quick access (tap to install)');
        } catch (err) {}

        // add install button to nav-actions if present
        const nav = document.querySelector('.nav-actions');
        if (nav && !document.getElementById('install-app')) {
          const btn = document.createElement('button');
          btn.id = 'install-app';
          btn.className = 'secondary-btn';
          btn.type = 'button';
          btn.textContent = 'Install App';
          btn.addEventListener('click', async () => {
            const promptEvent = window.AgriCalc.deferredPrompt;
            if (!promptEvent) return;
            promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            if (choice.outcome === 'accepted') {
              namespace.modules.notifications.show('success', 'Thanks — AgriCalc installed');
            }
            window.AgriCalc.deferredPrompt = null;
            btn.remove();
          });
          nav.appendChild(btn);
        }
      });
    });
  });
})(window);
