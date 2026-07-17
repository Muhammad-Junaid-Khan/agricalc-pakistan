(function () {
  'use strict';
  document.addEventListener('agri:form:submit', function (e) {
    const { form, payload, formType } = e.detail || {};
    if (formType !== 'contact') return;
    try {
      window.AgriCalc.modules.notifications.show('success', 'Message prepared. Use your email client to send or we will respond soon.');
    } catch (err) {
      console.log('Contact submitted', payload);
    }
  });
})();
