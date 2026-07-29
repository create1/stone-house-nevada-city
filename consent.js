/* Stone House — cookie consent banner (region-aware, works with Consent Mode v2)
   Added 2026-07-28. The Consent Mode DEFAULTS run inline in each page <head>
   (before the tags); this file only renders the banner + records the choice.
   Google (GA4 + Ads): gated via gtag consent update. Meta: grant/revoke.
   2026-07-29: slimmed to a low-profile bar so it no longer overpowers the hero CTAs. */
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
      'position:fixed', 'left:16px', 'right:16px', 'bottom:12px', 'z-index:2147483000',
      'max-width:640px', 'margin:0 auto', 'background:rgba(26,23,20,.92)', 'color:#efe9e0',
      'border:1px solid rgba(201,168,76,.22)', 'border-radius:10px',
      'box-shadow:0 4px 16px rgba(0,0,0,.26)', '-webkit-backdrop-filter:blur(3px)', 'backdrop-filter:blur(3px)',
      'padding:9px 14px',
      'font-family:var(--sans,\'Jost\',-apple-system,sans-serif)', 'font-size:12.5px', 'line-height:1.5',
      'display:flex', 'flex-wrap:wrap', 'align-items:center', 'gap:8px 14px'
    ].join(';');
    var msg = document.createElement('div');
    msg.style.cssText = 'flex:1 1 300px;min-width:200px;opacity:.92';
    msg.innerHTML = 'We use cookies for analytics and marketing. ' +
      'Accept or decline — see our <a href="/privacy-policy/" style="color:#C9A84C;text-decoration:underline">Privacy Policy</a>.';
    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:8px;flex:0 0 auto';
    function mkBtn(label, primary) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = label;
      b.style.cssText = 'cursor:pointer;font-family:inherit;font-size:12.5px;padding:6px 14px;border-radius:7px;border:1px solid ' +
        (primary ? '#C9A84C' : 'rgba(239,233,224,.35)') + ';' +
        (primary ? 'background:#C9A84C;color:#1a1714;font-weight:600' : 'background:transparent;color:#efe9e0');
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
