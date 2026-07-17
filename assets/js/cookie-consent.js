(function(){
  const STORAGE_KEY = 'agc_cookie_consent';
  const existing = localStorage.getItem(STORAGE_KEY);
  function createBanner() {
    const container = document.createElement('div');
    container.id = 'agc-cookie-banner';
    container.className = 'agc-cookie-banner';
    container.setAttribute('role','dialog');
    container.setAttribute('aria-live','polite');
    container.innerHTML = `
      <div class="agc-cookie-inner">
        <div class="agc-cookie-text">
          <strong>We use cookies</strong>
          <p>We use cookies and similar technologies to improve site experience, analytics, and optional services. Manage your preferences or accept to continue.</p>
          <p class="agc-cookie-actions">
            <button class="agc-accept">Accept</button>
            <button class="agc-reject">Reject</button>
            <button class="agc-prefs">Preferences</button>
            <a class="agc-privacy" href="/privacy-policy.html">Privacy Policy</a>
          </p>
        </div>
      </div>
    `;
    document.body.insertAdjacentElement('afterbegin', container);
    bind(container);
  }
  function bind(container){
    const accept = container.querySelector('.agc-accept');
    const reject = container.querySelector('.agc-reject');
    const prefs = container.querySelector('.agc-prefs');
    accept.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({status:'accepted', ts:Date.now()}));
      hide(container);
    });
    reject.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({status:'rejected', ts:Date.now()}));
      hide(container);
    });
    prefs.addEventListener('click', () => {
      // simple preferences dialog
      alert('Cookie preferences: You can accept or reject analytics and optional features.');
    });
  }
  function hide(container){
    container.style.display='none';
  }
  // Initialize
  try{
    if(!existing){
      if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createBanner);
      else createBanner();
    }
  }catch(e){console.error('Cookie banner init error',e)}
})();
