// ─── UTM PARAMETER CAPTURE ───
// Reads UTM params from URL on page load + stores fbc/fbp cookies for Meta CAPI
const __utmParams = (function() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
  // Persist in sessionStorage so they survive page navigation within the session
  if (utm.utm_source) {
    try { sessionStorage.setItem('sh_utm', JSON.stringify(utm)); } catch(e) {}
  } else {
    try {
      const stored = sessionStorage.getItem('sh_utm');
      if (stored) Object.assign(utm, JSON.parse(stored));
    } catch(e) {}
  }
  return utm;
})();

// Get Meta fbc (click ID) and fbp (browser ID) cookies for server-side deduplication
function getMetaCookies() {
  const cookies = document.cookie.split(';').reduce((acc, c) => {
    const [k, v] = c.trim().split('=');
    acc[k] = v;
    return acc;
  }, {});
  return { fbc: cookies._fbc || '', fbp: cookies._fbp || '' };
}

// Google Ads Lead conversion send_to. Leave '' until the conversion action exists.
// Create it in Google Ads > Goals > Conversions > New conversion action > Website,
// then paste the value here in the form 'AW-873753229/XXXXXXXXXXX'. Until set, the
// Ads conversion is skipped (GA4 generate_lead still fires and can be imported).
const ADS_LEAD_SEND_TO = '';

// Shared event id so the browser Meta "Lead" and the server-side CAPI "Lead"
// de-duplicate in Meta (same event_id on both = counted once).
let __leadEventId = '';
function newLeadEventId() {
  return 'lead.' + Date.now().toString(36) + '.' + Math.random().toString(36).slice(2, 11);
}

// Build the tracking payload that gets included in every form POST.
// Mints a fresh event_id per submit and stashes it for the paired trackLead() call.
function getTrackingPayload() {
  const meta = getMetaCookies();
  __leadEventId = newLeadEventId();
  return {
    ...__utmParams,
    fbc: meta.fbc,
    fbp: meta.fbp,
    source_url: window.location.href,
    event_id: __leadEventId,
  };
}

// ─── CONVERSION TRACKING ───
function trackLead(source) {
  // Reuse the event_id minted by getTrackingPayload() for this submit; fall back
  // to a fresh one for call sites that fire a Lead without a form POST (e.g. popups).
  const eventId = __leadEventId || newLeadEventId();
  __leadEventId = '';
  // GA4 generate_lead event
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', { event_category: 'Lead', event_label: source });
  }
  // Meta Pixel Lead event — eventID shared with the server CAPI Lead for de-duplication
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', { content_name: source }, { eventID: eventId });
  }
  // Google Ads Lead conversion (no-op until ADS_LEAD_SEND_TO is filled in above)
  if (ADS_LEAD_SEND_TO && typeof gtag === 'function') {
    gtag('event', 'conversion', { send_to: ADS_LEAD_SEND_TO });
  }
}


// ─── SCROLL PROGRESS ───
window.addEventListener('scroll', () => {
  const pct =
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('btt').classList.toggle('show', window.scrollY > 400);
  document.getElementById('hero-yr').style.transform = `translateY(${window.scrollY * 0.18}px)`;
});

// ─── BACK TO TOP ───
document.getElementById('btt').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── REVEAL ───
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => obs.observe(el));

// ─── STAT COUNTERS ───
const counters = document.querySelectorAll('[data-count]');
const cObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.count,
          dur = 1800,
          step = dur / target;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + Math.ceil(target / 60), target);
          e.target.textContent = cur;
          if (cur >= target) clearInterval(t);
        }, step < 16 ? 16 : step);
        cObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => cObs.observe(c));

// ─── MOBILE NAV ───
let mobOpen = false;
function toggleMob() {
  mobOpen = !mobOpen;
  document.getElementById('mob-nav').classList.toggle('open', mobOpen);
  const b1 = document.getElementById('mb1'),
    b2 = document.getElementById('mb2'),
    b3 = document.getElementById('mb3');
  b1.style.transform = mobOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  b2.style.opacity = mobOpen ? '0' : '';
  b3.style.transform = mobOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
}


// ─── LIGHTBOX ───
function openLightbox(src, caption = '') {
  const lb = document.getElementById('lightbox');
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-caption').textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (
    !e ||
    e.target === document.getElementById('lightbox') ||
    e.currentTarget === document.getElementById('lb-close')
  ) {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
}
function lbNav() {
  /* Gallery prev/next — wire to lbImgs when needed */
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox({ target: document.getElementById('lightbox') });
});

// ─── FAQ ───
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ─── DATE CHECK FORM ───
function submitDC() {
  const name = document.getElementById('dc-name').value.trim();
  const email = document.getElementById('dc-email').value.trim();
  const date = document.getElementById('dc-date').value;
  const guestEl = document.getElementById('dc-guests');
  const guests = guestEl ? guestEl.value : '';
  let valid = true;
  document.getElementById('err-name').classList.toggle('show', !name);
  if (!name) valid = false;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('err-email').classList.toggle('show', !emailOk);
  if (!emailOk) valid = false;
  document.getElementById('err-date').classList.toggle('show', !date);
  if (!date) valid = false;
  if (!valid) return;
  const btn = document.getElementById('dc-btn');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, date, guests, event_type: 'wedding', source: 'Website - Date Checker', _honeypot: '', ...getTrackingPayload() }),
  })
    .then((r) => r.json())
    .then(() => {
      btn.textContent = "✓ Request sent — we'll respond within 24 hours";
      btn.classList.add('success');
      trackLead('Website - Date Checker');
    })
    .catch(() => {
      btn.textContent = "✓ Request sent — we'll respond within 24 hours";
      btn.classList.add('success');
      trackLead('Website - Date Checker');
    });
}

// ─── EVENT-TYPE POPUP (exit-intent + timed popup) ───────────────
// Wires up the multi-step "Wedding / Private / Corporate" flow used in
// #exit-popup and #lead-popup. Step 1 = pick type. Step 2 = capture form.
// `prefix` is "exit" or "lead" — selects the right DOM scope.
const __eventTypeState = { exit: 'wedding', lead: 'wedding' };

function popupPickType(prefix, type) {
  if (type !== 'wedding' && type !== 'private' && type !== 'corporate') type = 'wedding';
  __eventTypeState[prefix] = type;

  // Close whichever popup the user clicked from
  if (prefix === 'exit' && typeof closeExit === 'function') closeExit();
  else if (prefix === 'lead') {
    const lp = document.getElementById('lead-popup');
    if (lp) lp.classList.remove('show');
  }

  // Track the click (best-effort) so we know which popup + type drove the page view
  try {
    const sourceLabel = prefix === 'exit'
      ? `Website - Exit Intent (${type === 'wedding' ? 'Wedding' : type === 'private' ? 'Private' : 'Corporate'} Event)`
      : `Website - Timed Popup (${type === 'wedding' ? 'Wedding' : type === 'private' ? 'Private' : 'Corporate'} Event)`;
    if (typeof trackLead === 'function') trackLead(sourceLabel);
  } catch (_) {}

  // Route to the matching page — every option navigates, no in-popup form
  const dest = type === 'wedding' ? '/wedding-pricing/'
             : type === 'private' ? '/private-events/'
             : '/corporate-events/';
  window.location.href = dest;
}

// Expose globally (HTML uses inline onclick handlers)
window.popupPickType = popupPickType;

// ─── PRICING TOGGLE ───
const pkgData = {
  weddings: [
    {
      n: '$69 – $79',
      note: 'per guest · buffet · plated',
      items: [
        'Cocktail hour: choice of two hors d’oeuvres (classic selection)',
        'Salad, rolls & butter, two entrées + chef’s veg/vegan entrée',
        'Beverage station, toast champagne & sparkling cider',
        'Linens, china, stemware, silverware · cake cutting · screen & mic',
        'Entrées: lemon chicken piccata, sirloin, herb chicken, tilapia, short rib, salmon',
      ],
    },
    {
      n: '$79 – $89',
      note: 'per guest · buffet · plated',
      items: [
        'Cocktail hour: choice of three hors d’oeuvres (classic + premium)',
        'Same reception meal structure as Prospector',
        'Expanded entrées — ale & whiskey steaks, champagne & riesling chicken, tri tip, madeira, mahi, sea bass, and more',
        'Premium hors d’oeuvres — coconut shrimp, prawns, artisan cheese, antipasto, salmon',
        'Linens, china, stemware, silverware · cake cutting · screen & mic',
      ],
    },
    {
      n: '$89 – $99',
      note: 'per guest · buffet · plated',
      items: [
        'Cocktail hour: choice of four hors d’oeuvres (classic + premium)',
        'Premium entrées: NY steak, prime rib, stuffed chicken cordon bleu',
        'Or any entrées from Prospector or Brewmaster menus',
        'All Brewmaster premium hors d’oeuvres available',
        'Linens, china, stemware, silverware · cake cutting · screen & mic',
      ],
    },
  ],
  corporate: [
    {
      n: '$3,500',
      note: 'up to 40 guests',
      items: [
        'Single space',
        '4-hour rental',
        'AV equipment included',
        'Catering available add-on',
        'Breakout space available',
      ],
    },
    {
      n: '$7,500',
      note: 'up to 100 guests',
      items: [
        'Two spaces',
        '8-hour rental window',
        'Full AV + presentation setup',
        'Catering package included',
        'Dedicated event coordinator',
      ],
    },
    {
      n: '$14,000',
      note: 'full venue buyout',
      items: [
        'All six spaces',
        '12-hour exclusive access',
        'Complete AV setup',
        'Premium catering',
        'Dedicated coordinator',
        'Evening reception option',
      ],
    },
  ],
  private: [
    {
      n: '$2,500',
      note: 'up to 30 guests',
      items: [
        'Single space',
        '3-hour rental',
        'Basic catering options',
        'Bar service available',
        'Flexible setup',
      ],
    },
    {
      n: '$5,500',
      note: 'up to 80 guests',
      items: [
        'Two spaces',
        '6-hour rental',
        'Catering package included',
        'Full bar service',
        'Event coordinator support',
      ],
    },
    {
      n: '$11,000',
      note: 'full venue',
      items: [
        'All six spaces',
        '10-hour access',
        'Premium catering',
        'Full bar service',
        'Planning coordination',
        'Customised décor assistance',
      ],
    },
  ],
};
// Price-unit label per pricing type (weddings = per-guest; corporate/private = flat package)
const pkgFromLabel = {
  weddings: 'Per guest',
  corporate: 'Package',
  private: 'Package',
};
function togglePkg(type, btn) {
  document.querySelectorAll('.pkg-toggle-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  const d = pkgData[type];
  const fromLabel = pkgFromLabel[type] || 'Per guest';
  [1, 2, 3].forEach((i, idx) => {
    document.getElementById(`p${i}-n`).textContent = d[idx].n;
    document.getElementById(`p${i}-note`).textContent = d[idx].note;
    const ul = document.getElementById(`p${i}-items`);
    ul.innerHTML = d[idx].items.map((it) => `<li>${it}</li>`).join('');
  });
  // Update the "Per guest"/"Package" label on each card to match the active type
  document.querySelectorAll('#pricing-grid .price-from').forEach((el) => {
    el.textContent = fromLabel;
  });
}

// ─── OPEN HOUSE COUNTDOWN ───
function updateCountdown() {
  const target = new Date('2026-06-14T10:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return;
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  document.getElementById('cd-d').textContent = d;
  document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ─── OPEN HOUSE SUBMIT ───
function submitOH() {
  const inp = document.getElementById('oh-email');
  if (inp.value.includes('@')) {
    const btn = inp.nextElementSibling;
    btn.disabled = true;
    btn.textContent = 'Reserving…';
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inp.value, source: 'Website - Open House RSVP', _honeypot: '', ...getTrackingPayload() }),
    })
      .then(() => {
        btn.textContent = "✓ You're on the list!";
        btn.style.background = '#2d6a4f';
        btn.style.color = '#fff';
        inp.disabled = true;
        trackLead('Website - Open House RSVP');
      })
      .catch(() => {
        btn.textContent = "✓ You're on the list!";
        btn.style.background = '#2d6a4f';
        btn.style.color = '#fff';
        inp.disabled = true;
        trackLead('Website - Open House RSVP');
      });
  }
}

// ─── EXIT INTENT ───
let exitShown = false;
document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0 && !exitShown) {
    exitShown = true;
    showExit();
  }
});
function showExit() {
  document.getElementById('exit-popup').classList.add('show');
}
function closeExit() {
  document.getElementById('exit-popup').classList.remove('show');
}
function submitExit() {
  const em = document.getElementById('ep-email');
  if (em.value.includes('@')) {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: em.value, source: 'Website - Exit Intent (Pricing Guide)', _honeypot: '', ...getTrackingPayload() }),
    }).catch(() => {});
    trackLead('Website - Exit Intent (Pricing Guide)');
    em.parentElement.innerHTML =
      '<p style="color:#4ecf9a;font-size:14px;font-weight:300;padding:12px 0">✓ Pricing guide on its way to your inbox!</p>';
    setTimeout(closeExit, 2200);
  }
}

// ─── TIMED LEAD POPUP SUBMIT ───
function submitLead(btn) {
  const inp = btn.previousElementSibling;
  if (inp && inp.value.includes('@')) {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inp.value, source: 'Website - Pricing Guide Popup', _honeypot: '', ...getTrackingPayload() }),
    }).catch(() => {});
    trackLead('Website - Pricing Guide Popup');
    btn.textContent = '✓ Sent!';
    inp.disabled = true;
    setTimeout(() => document.getElementById('lead-popup').classList.remove('show'), 2000);
  }
}

// ─── TIMED LEAD POPUP (30s) ───
setTimeout(() => {
  if (!exitShown) document.getElementById('lead-popup').classList.add('show');
}, 30000);

// ─── LIVE COUNT ANIMATION ───
const counts = [6, 8, 11, 9, 7, 13, 10, 8];
let ci = 0;
setInterval(() => {
  ci = (ci + 1) % counts.length;
  const el = document.getElementById('live-count');
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = counts[ci] + ' couples viewing this week';
    el.style.opacity = '1';
  }, 300);
}, 8000);

// ─── SMOOTH ANCHOR SCROLL WITH NAV OFFSET ───
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

