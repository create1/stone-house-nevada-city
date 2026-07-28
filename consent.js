/* Stone House — cookie consent banner (region-aware, works with Consent Mode v2)
   Added 2026-07-28. The Consent Mode DEFAULTS run inline in each page <head>
   (before the tags); this file only renders the banner + records the choice.
   Google (GA4 + Ads): gated via gtag consent update. Meta: grant/revoke.        */
(function () {
  var KEY = 'sh_consent';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored === 'granted' || stored === 'denied') return; // already chose — no banner

  function g() { (window.dataLayer = window.dataLayer || []).push(arguments); }

  function record(granted) {
    var v = granted ? 'granted' : 'denied';
    try { localStorage.setItem(KEY, v); } catch (e) {}
    // Google (GA4 + Google Ads) via Consent Mode v2
    g('consent', 'update', {
      ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v
    });
    // Meta pixels
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('consent', granted ? 'grant' : 'revoke');
        // If Meta was denied on load (likely-EU first visit) and the user just granted,
        // fire the PageView that was suppressed.
        if (granted && window.__shMetaDeny) window.fbq('track', 'PageView');
      } catch (e) {}
    }
    hide();
  }

  var bar;
  function hide() { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); }

  function build() {
    if (document.getElementById('sh-consent')) return;
    bar = document.createElement('div');
    bar.id = 'sh-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.style.cssText = [
      'position:fixed', 'left:16px', 'right:16px', 'bottom:16px', 'z-index:2147483000',
      'max-width:820px', 'margin:0 auto', 'background:#1a1714', 'color:#efe9e0',
      'border:1px solid rgba(201,168,76,.35)', 'border-radius:12px',
      'box-shadow:0 12px 40px rgba(0,0,0,.45)', 'padding:18px 20px',
      'font-family:Georgia,\'Times New Roman\',serif', 'font-size:14px', 'line-height:1.5',
      'display:flex', 'flex-wrap:wrap', 'align-items:center', 'gap:12px 16px'
    ].join(';');
    var msg = document.createElement('div');
    msg.style.cssText = 'flex:1 1 320px;min-width:240px';
    msg.innerHTML = 'We use cookies for analytics and marketing to understand how our site is used and to improve your experience. ' +
      'You can accept or decline. See our <a href="/privacy-policy/" style="color:#C9A84C;text-decoration:underline">Privacy Policy</a>.';
    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:10px;flex:0 0 auto';
    function mkBtn(label, primary) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = label;
      b.style.cssText = 'cursor:pointer;font-family:inherit;font-size:14px;padding:10px 20px;border-radius:8px;border:1px solid ' +
        (primary ? '#C9A84C' : 'rgba(239,233,224,.4)') + ';' +
        (primary ? 'background:#C9A84C;color:#1a1714;font-weight:bold' : 'background:transparent;color:#efe9e0');
      return b;
    }
    var decline = mkBtn('Decline', false);
    var accept = mkBtn('Accept', true);
    decline.addEventListener('click', function () { record(false); });
    accept.addEventListener('click', function () { record(true); });
    btns.appendChild(decline); btns.appendChild(accept);
    bar.appendChild(msg); bar.appendChild(btns);
    document.body.appendChild(bar);
  }

  if (document.readyState !== 'loading') build();
  else document.addEventListener('DOMContentLoaded', build);
})();
