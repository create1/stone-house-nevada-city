// ─── CONVERSION TRACKING ───
function trackLead(source) {
  // GA4 generate_lead event
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', { event_category: 'Lead', event_label: source });
  }
  // Meta Pixel Lead event
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', { content_name: source });
  }
}

// ─── CURSOR ───
const cur = document.getElementById('cursor'),
  ring = document.getElementById('cursor-ring');
if (cur && ring) {
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
}
document
  .querySelectorAll(
    'a,button,.space-card,.faq-q,.ig-cell,.cat-main,.cat-sm,.rw-main,.rw-sm,.story-img,.wed-img'
  )
  .forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
document.addEventListener('mouseup', () => document.body.classList.remove('clicking'));

// ─── SCROLL PROGRESS ───
// Nav: solid cream when scrolled past clean photo (home) or usual threshold
window.addEventListener('scroll', () => {
  const denom = document.documentElement.scrollHeight - window.innerHeight;
  const pct = denom > 0 ? (window.scrollY / denom) * 100 : 0;
  const sp = document.getElementById('scroll-progress');
  if (sp) sp.style.width = pct + '%';
  const nav = document.getElementById('nav');
  const forceNav =
    document.body.classList.contains('page-inner') &&
    !document.body.classList.contains('page-catering') &&
    !document.body.classList.contains('page-pricing') &&
    !document.body.classList.contains('page-gallery');
  const photo = document.querySelector('.hero-photo, .cat-hero, .visual, .ga-hero');
  const pastPhoto = photo
    ? window.scrollY > Math.max(40, photo.offsetHeight - 48)
    : window.scrollY > 60;
  if (nav)
    nav.classList.toggle(
      'scrolled',
      forceNav || pastPhoto || (!photo && window.scrollY > 60)
    );
  const btt = document.getElementById('btt');
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
  const heroYr = document.getElementById('hero-yr');
  if (heroYr) heroYr.style.transform = `translateY(${window.scrollY * 0.18}px)`;
});
// Inner pages start with solid nav (dark full-bleed pages stay transparent over hero)
if (
  document.body.classList.contains('page-inner') &&
  !document.body.classList.contains('page-catering') &&
  !document.body.classList.contains('page-pricing') &&
  !document.body.classList.contains('page-gallery')
) {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.add('scrolled');
}

// ─── BACK TO TOP ───
const bttBtn = document.getElementById('btt');
if (bttBtn) {
  bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

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
  const mob = document.getElementById('mob-nav');
  if (mob) mob.classList.toggle('open', mobOpen);
  const b1 = document.getElementById('mb1'),
    b2 = document.getElementById('mb2'),
    b3 = document.getElementById('mb3');
  if (!b1 || !b2 || !b3) return;
  b1.style.transform = mobOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  b2.style.opacity = mobOpen ? '0' : '';
  b3.style.transform = mobOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
}


// ─── LIGHTBOX ───
/** Optional multi-photo set for prev/next + swipe (set via setLightboxItems). */
let lbItems = [];
let lbIndex = 0;
let lbTouchX = 0;
let lbTouchY = 0;
let lbTouchActive = false;

function setLightboxItems(items) {
  lbItems = Array.isArray(items)
    ? items.map((it) => ({
        src: it.src || '',
        cap: it.cap || it.caption || '',
      })).filter((it) => it.src)
    : [];
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.toggle('has-nav', lbItems.length > 1);
}

function openLightbox(src, caption = '') {
  const lb = document.getElementById('lightbox');
  if (!lb || !src) return;
  if (lbItems.length) {
    const i = lbItems.findIndex((it) => it.src === src);
    lbIndex = i >= 0 ? i : 0;
    if (i >= 0 && !caption) caption = lbItems[i].cap || '';
  }
  const img = document.getElementById('lb-img');
  if (img) {
    img.src = src;
    img.alt = caption || '';
  }
  const capEl = document.getElementById('lb-caption');
  if (capEl) capEl.textContent = caption;
  lb.classList.add('open');
  document.body.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
}

/** Resolve image URL from Sanity map (if loaded) or first matching img[data-sh-key]. */
function openLightboxKey(key, captionFallback) {
  const row = window.__SH_PHOTO_MAP?.[key];
  const img = document.querySelector(`img[data-sh-key="${key}"]`);
  const url = row?.imageUrl || img?.getAttribute('src') || '';
  const cap = captionFallback || row?.lightboxCaption || '';
  openLightbox(url, cap);
}

function closeLightbox(e) {
  if (
    !e ||
    e.target === document.getElementById('lightbox') ||
    e.currentTarget === document.getElementById('lb-close')
  ) {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.classList.remove('lb-open');
    document.body.style.overflow = '';
  }
}

function lbNav(dir) {
  if (!lbItems.length || lbItems.length < 2) return;
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
  const item = lbItems[lbIndex];
  openLightbox(item.src, item.cap || '');
}

function bindLightboxGestures() {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.dataset.gesturesBound) return;
  lb.dataset.gesturesBound = '1';

  lb.addEventListener(
    'touchstart',
    (e) => {
      if (!lb.classList.contains('open') || !lb.classList.contains('has-nav')) return;
      if (e.touches.length !== 1) return;
      lbTouchActive = true;
      lbTouchX = e.touches[0].clientX;
      lbTouchY = e.touches[0].clientY;
    },
    { passive: true }
  );

  lb.addEventListener(
    'touchend',
    (e) => {
      if (!lbTouchActive || !lb.classList.contains('open') || !lb.classList.contains('has-nav')) {
        lbTouchActive = false;
        return;
      }
      lbTouchActive = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - lbTouchX;
      const dy = t.clientY - lbTouchY;
      // Horizontal swipe only; ignore mostly-vertical drags
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      // Swipe left → next; swipe right → previous
      lbNav(dx < 0 ? 1 : -1);
    },
    { passive: true }
  );
}

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape') {
    closeLightbox({ target: lb });
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    lbNav(-1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    lbNav(1);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindLightboxGestures);
} else {
  bindLightboxGestures();
}

// Back-compat for pages that assigned window.openLightbox
window.setLightboxItems = setLightboxItems;
window.openLightbox = openLightbox;
window.openLightboxKey = openLightboxKey;
window.closeLightbox = closeLightbox;
window.lbNav = lbNav;

// ─── FAQ ───
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ─── LEAD HELPERS (open house + validation) ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/** Accept common US-style numbers; require at least 10 digits. */
function isValidPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

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
function togglePkg(type, btn) {
  const d = pkgData[type];
  if (!d) return;
  document.querySelectorAll('.pkg-toggle-btn').forEach((b) => {
    if (btn) {
      b.classList.toggle('active', b === btn);
      return;
    }
    const label = (b.textContent || '').trim().toLowerCase();
    const isActive =
      (type === 'weddings' && label === 'weddings') ||
      (type === 'corporate' && label === 'corporate') ||
      (type === 'private' && label.indexOf('private') === 0);
    b.classList.toggle('active', isActive);
  });
  [1, 2, 3].forEach((i, idx) => {
    document.getElementById(`p${i}-n`).textContent = d[idx].n;
    document.getElementById(`p${i}-note`).textContent = d[idx].note;
    const ul = document.getElementById(`p${i}-items`);
    ul.innerHTML = d[idx].items.map((it) => `<li>${it}</li>`).join('');
  });
}

// Event-type rows jump to pricing and flip the package tab
document.querySelectorAll('[data-pkg]').forEach((el) => {
  el.addEventListener('click', () => {
    const type = el.getAttribute('data-pkg');
    const btn = Array.from(document.querySelectorAll('.pkg-toggle-btn')).find((b) => {
      const label = (b.textContent || '').trim().toLowerCase();
      if (type === 'weddings') return label === 'weddings';
      if (type === 'corporate') return label === 'corporate';
      return label.indexOf('private') === 0;
    });
    togglePkg(type, btn || null);
  });
});

// ─── EMAIL LIST SUBMIT ───
function submitOH() {
  const nameEl = document.getElementById('oh-name');
  const emailEl = document.getElementById('oh-email');
  const phoneEl = document.getElementById('oh-phone');
  if (!emailEl) return;
  const name = nameEl ? nameEl.value.trim() : '';
  const email = emailEl.value.trim();
  // Honeypot — bots fill hidden phone; real users leave it empty
  if (phoneEl && phoneEl.value.trim()) return;
  if (!isValidEmail(email)) {
    emailEl.focus();
    return;
  }
  const btn = document.querySelector('.oh-btn');
  if (!btn) return;
  btn.disabled = true;
  btn.textContent = 'Subscribing…';
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name || 'Email list',
      phone: '',
      email,
      source: 'Website - Email List',
      _honeypot: '',
    }),
  })
    .then(() => {
      btn.textContent = "✓ You're subscribed!";
      btn.style.background = '#2d6a4f';
      btn.style.color = '#fff';
      if (nameEl) nameEl.disabled = true;
      emailEl.disabled = true;
      trackLead('Website - Email List');
    })
    .catch(() => {
      btn.textContent = "✓ You're subscribed!";
      btn.style.background = '#2d6a4f';
      btn.style.color = '#fff';
      if (nameEl) nameEl.disabled = true;
      emailEl.disabled = true;
      trackLead('Website - Email List');
    });
}

// ─── CHECK YOUR DATE FORM ───
(function initCheckDateForm() {
  const form = document.getElementById('check-date-form');
  if (!form) return;

  const preferredEl = document.getElementById('cd-preferred');
  const backupEl = document.getElementById('cd-backup');
  const statusEl = document.getElementById('cd-status');
  const submitBtn = document.getElementById('cd-submit');

  // Disallow past dates for preferred/backup
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  if (preferredEl) preferredEl.min = minDate;
  if (backupEl) backupEl.min = minDate;

  function markInvalid(el, on) {
    if (!el) return;
    el.classList.toggle('is-invalid', !!on);
  }

  function showStatus(kind, msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove('is-error', 'is-success');
    if (kind) statusEl.classList.add(kind === 'error' ? 'is-error' : 'is-success');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('cd-name');
    const phoneEl = document.getElementById('cd-phone');
    const emailEl = document.getElementById('cd-email');
    const hpEl = document.getElementById('cd-company');

    const name = nameEl?.value.trim() || '';
    const phone = phoneEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const preferredDate = preferredEl?.value || '';
    const backupDate = backupEl?.value || '';
    const honeypot = hpEl?.value || '';

    [nameEl, phoneEl, emailEl, preferredEl, backupEl].forEach((el) => markInvalid(el, false));
    showStatus('', '');

    let firstBad = null;
    if (!preferredDate) {
      markInvalid(preferredEl, true);
      firstBad = firstBad || preferredEl;
    }
    if (!name) {
      markInvalid(nameEl, true);
      firstBad = firstBad || nameEl;
    }
    if (!isValidPhone(phone)) {
      markInvalid(phoneEl, true);
      firstBad = firstBad || phoneEl;
    }
    if (!isValidEmail(email)) {
      markInvalid(emailEl, true);
      firstBad = firstBad || emailEl;
    }
    if (backupDate && preferredDate && backupDate === preferredDate) {
      markInvalid(backupEl, true);
      firstBad = firstBad || backupEl;
      showStatus('error', 'Choose a different backup date from your preferred date.');
    }
    if (firstBad) {
      if (!statusEl?.classList.contains('is-error')) {
        showStatus('error', 'Please complete the required fields so we can check availability.');
      }
      firstBad.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        preferredDate,
        backupDate,
        source: 'Website - Check Your Date',
        _honeypot: honeypot,
      }),
    })
      .then((r) => {
        if (!r.ok && r.status >= 500) throw new Error('server');
        return r.json().catch(() => ({}));
      })
      .then((data) => {
        if (data && data.error) {
          showStatus('error', data.error);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Check Availability →';
          return;
        }
        submitBtn.textContent = "✓ We'll be in touch";
        submitBtn.classList.add('is-success');
        form.querySelectorAll('input, select, textarea, button').forEach((el) => {
          if (el !== submitBtn) el.disabled = true;
        });
        showStatus(
          'success',
          "Thanks — we've received your preferred and backup dates. Our team will let you know if Stone House is available."
        );
        trackLead('Website - Check Your Date');
      })
      .catch(() => {
        // Optimistic success if offline API fails locally; still tracks intent
        submitBtn.textContent = "✓ We'll be in touch";
        submitBtn.classList.add('is-success');
        form.querySelectorAll('input, select, textarea, button').forEach((el) => {
          if (el !== submitBtn) el.disabled = true;
        });
        showStatus(
          'success',
          "Thanks — we've received your request. If this is a local preview, submissions go live once the site API is deployed."
        );
        trackLead('Website - Check Your Date');
      });
  });
})();

// ─── CONTACT FORM ───
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('ct-status');
  const submitBtn = document.getElementById('ct-submit');
  const SOURCE = 'Website - Contact Form';

  function markInvalid(el, on) {
    if (!el) return;
    el.classList.toggle('is-invalid', !!on);
  }

  function showStatus(kind, msg) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.remove('is-error', 'is-success');
    if (kind) statusEl.classList.add(kind === 'error' ? 'is-error' : 'is-success');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('ct-name');
    const emailEl = document.getElementById('ct-email');
    const phoneEl = document.getElementById('ct-phone');
    const notesEl = document.getElementById('ct-notes');
    const hpEl = document.getElementById('ct-company');

    const name = nameEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const phone = phoneEl?.value.trim() || '';
    const notes = notesEl?.value.trim() || '';
    const honeypot = hpEl?.value || '';

    [nameEl, emailEl, phoneEl].forEach((el) => markInvalid(el, false));
    showStatus('', '');

    let firstBad = null;
    if (!name) {
      markInvalid(nameEl, true);
      firstBad = firstBad || nameEl;
    }
    if (!isValidEmail(email)) {
      markInvalid(emailEl, true);
      firstBad = firstBad || emailEl;
    }
    if (!isValidPhone(phone)) {
      markInvalid(phoneEl, true);
      firstBad = firstBad || phoneEl;
    }
    if (firstBad) {
      showStatus('error', 'Please complete name, email, and phone so we can respond.');
      firstBad.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        notes,
        source: SOURCE,
        _honeypot: honeypot,
      }),
    })
      .then((r) => {
        if (!r.ok && r.status >= 500) throw new Error('server');
        return r.json().catch(() => ({}));
      })
      .then((data) => {
        if (data && data.error) {
          showStatus('error', data.error);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message →';
          return;
        }
        submitBtn.textContent = "✓ Message sent";
        submitBtn.classList.add('is-success');
        form.querySelectorAll('input, textarea, button').forEach((el) => {
          if (el !== submitBtn) el.disabled = true;
        });
        showStatus(
          'success',
          "Thanks — we've received your note and will write back within 24 hours."
        );
        if (typeof trackLead === 'function') trackLead(SOURCE);
      })
      .catch(() => {
        submitBtn.textContent = "✓ Message sent";
        submitBtn.classList.add('is-success');
        form.querySelectorAll('input, textarea, button').forEach((el) => {
          if (el !== submitBtn) el.disabled = true;
        });
        showStatus(
          'success',
          "Thanks — we've received your request. If this is a local preview, submissions go live once the site API is deployed."
        );
        if (typeof trackLead === 'function') trackLead(SOURCE);
      });
  });
})();

// ─── PRICING PAMPHLET GATE (modal on lander or pricing page) ───
(function initPricingPamphletGate() {
  const body = document.body;
  const modal = document.getElementById('pp-modal');
  const form = document.getElementById('pp-form');
  const statusEl = document.getElementById('pp-status');
  const submitBtn = document.getElementById('pp-submit');
  const titleEl = document.getElementById('pp-modal-title');
  if (!modal || !form || !submitBtn) return;

  const DEFAULTS = {
    url: body.dataset.pamphletUrl || 'https://services.msgsndr.com/urls/l/NltM0ui95a',
    source: body.dataset.pamphletSource || 'Website - Pricing Pamphlet',
    occasion: body.dataset.pamphletOccasion || '',
    title: titleEl?.textContent || 'Fill out your information to access the pricing pamphlet',
  };

  const config = {
    url: DEFAULTS.url,
    source: DEFAULTS.source,
    occasion: DEFAULTS.occasion,
  };

  let lastFocus = null;

  function markInvalid(el, on) {
    if (!el) return;
    el.classList.toggle('is-invalid', !!on);
  }

  function showStatus(kind, msg) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.remove('is-error', 'is-success');
    if (kind) statusEl.classList.add(kind === 'error' ? 'is-error' : 'is-success');
  }

  function applyTriggerConfig(trigger) {
    if (!trigger || !trigger.dataset) return;
    if (trigger.dataset.pamphletUrl) config.url = trigger.dataset.pamphletUrl;
    if (trigger.dataset.pamphletSource) config.source = trigger.dataset.pamphletSource;
    if (trigger.dataset.pamphletOccasion !== undefined) {
      config.occasion = trigger.dataset.pamphletOccasion;
    }
    if (titleEl && trigger.dataset.ppTitle) {
      titleEl.textContent = trigger.dataset.ppTitle;
    }
  }

  function resetFormUi() {
    form.querySelectorAll('input, button').forEach((el) => {
      el.disabled = false;
    });
    submitBtn.disabled = false;
    submitBtn.classList.remove('is-success');
    submitBtn.textContent = 'Download your Pricing Pamphlet';
    showStatus('', '');
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  }

  function openModal(trigger) {
    applyTriggerConfig(trigger || null);
    if (submitBtn.classList.contains('is-success')) {
      form.reset();
      resetFormUi();
    }
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    const first = document.getElementById('pp-first');
    if (first) first.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.hidden = true;
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }, 200);
  }

  function findPamphletTrigger(kind) {
    const map = {
      wedding: '[data-pp-open][data-pamphlet-occasion="Wedding"]',
      events: '[data-pp-open][data-pamphlet-occasion="Holiday / Corporate / Private"]',
      other: '[data-pp-open][data-pamphlet-occasion="Holiday / Corporate / Private"]',
    };
    const sel = map[kind] || '[data-pp-open]';
    return document.querySelector(sel) || document.querySelector('[data-pp-open]');
  }

  document.querySelectorAll('[data-pp-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A') e.preventDefault();
      openModal(btn);
    });
  });
  document.querySelectorAll('[data-pp-close]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Deep-links: ?form=1 | ?pamphlet=wedding|events | #form | #wedding-pamphlet
  const params = new URLSearchParams(location.search);
  const pamphletKind = (params.get('pamphlet') || params.get('form') || '').toLowerCase();
  const hash = (location.hash || '').toLowerCase();
  if (pamphletKind === '1' || pamphletKind === 'true' || hash === '#form') {
    openModal(findPamphletTrigger('wedding') || null);
  } else if (
    pamphletKind === 'wedding' ||
    hash === '#wedding-pamphlet' ||
    hash === '#form-wedding'
  ) {
    openModal(findPamphletTrigger('wedding'));
  } else if (
    pamphletKind === 'events' ||
    pamphletKind === 'other' ||
    pamphletKind === 'holiday' ||
    pamphletKind === 'corporate' ||
    pamphletKind === 'private' ||
    hash === '#event-pamphlet' ||
    hash === '#form-events'
  ) {
    // Canonical private-events pricing pamphlet lander
    location.assign(
      (location.pathname.indexOf('/blog/') !== -1 ? '../../' : '') +
        'private-events.html' +
        location.search.replace(/[?&]pamphlet=[^&]*/g, '').replace(/^&/, '?')
    );
    return;
  }

  function finishSuccess() {
    const url = config.url;
    const source = config.source;
    submitBtn.textContent = '✓ Pamphlet opened';
    submitBtn.classList.add('is-success');
    form.querySelectorAll('input, button').forEach((el) => {
      if (el !== submitBtn) el.disabled = true;
    });
    if (statusEl) {
      statusEl.innerHTML = '';
      statusEl.classList.remove('is-error');
      statusEl.classList.add('is-success');
      statusEl.appendChild(document.createTextNode('Thanks — if nothing opened, '));
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'download the pamphlet here →';
      statusEl.appendChild(a);
    }
    window.open(url, '_blank', 'noopener');
    if (typeof trackLead === 'function') trackLead(source);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstEl = document.getElementById('pp-first');
    const lastEl = document.getElementById('pp-last');
    const phoneEl = document.getElementById('pp-phone');
    const emailEl = document.getElementById('pp-email');
    const hpEl = document.getElementById('pp-company');
    const smsEl = document.getElementById('pp-sms');

    const first = firstEl?.value.trim() || '';
    const last = lastEl?.value.trim() || '';
    const phone = phoneEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const honeypot = hpEl?.value || '';
    const smsOptIn = !!(smsEl && smsEl.checked);
    const name = [first, last].filter(Boolean).join(' ').trim();

    [firstEl, lastEl, phoneEl, emailEl].forEach((el) => markInvalid(el, false));
    showStatus('', '');

    let firstBad = null;
    if (!first) {
      markInvalid(firstEl, true);
      firstBad = firstBad || firstEl;
    }
    if (!last) {
      markInvalid(lastEl, true);
      firstBad = firstBad || lastEl;
    }
    if (!isValidEmail(email)) {
      markInvalid(emailEl, true);
      firstBad = firstBad || emailEl;
    }
    if (!isValidPhone(phone)) {
      markInvalid(phoneEl, true);
      firstBad = firstBad || phoneEl;
    }
    if (firstBad) {
      showStatus('error', 'Please complete all fields to download the pamphlet.');
      firstBad.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        source: config.source,
        occasion: config.occasion,
        notes: smsOptIn ? 'SMS opt-in: yes' : 'SMS opt-in: no',
        _honeypot: honeypot,
      }),
    })
      .then((r) => {
        if (!r.ok && r.status >= 500) throw new Error('server');
        return r.json().catch(() => ({}));
      })
      .then((data) => {
        if (data && data.error) {
          showStatus('error', data.error);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Download your Pricing Pamphlet';
          return;
        }
        finishSuccess();
      })
      .catch(() => {
        finishSuccess();
      });
  });
})();

// ─── LIVE COUNT ANIMATION ───
const counts = [6, 8, 11, 9, 7, 13, 10, 8];
let ci = 0;
setInterval(() => {
  ci = (ci + 1) % counts.length;
  const el = document.getElementById('live-count');
  if (!el) return;
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

// ─── SANITY SITE PHOTOS (replaces img src with CDN URLs when map loads) ───
(function initSanityPhotos() {
  const root = document.documentElement;
  const projectId = root.dataset.sanityProjectId?.trim();
  const dataset = root.dataset.sanityDataset?.trim() || 'production';
  if (!projectId) return;

  const q =
    '*[_type == "sitePhoto" && defined(key.current)]{ "key": key.current, lightboxCaption, "imageUrl": image.asset->url }';
  const endpoint = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${encodeURIComponent(
    dataset
  )}?query=${encodeURIComponent(q)}`;

  function applySanityPhotoMap(map) {
    window.__SH_PHOTO_MAP = map;
    document.querySelectorAll('img[data-sh-key]').forEach((img) => {
      const key = img.dataset.shKey;
      const row = map[key];
      if (row?.imageUrl) img.src = row.imageUrl;
    });
  }

  fetch(endpoint)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((body) => {
      const map = {};
      (body.result || []).forEach((row) => {
        map[row.key] = row;
      });
      applySanityPhotoMap(map);
    })
    .catch(() => {});
})();

/* Hero carousel — matches production stonehouse.io (3s crossfade) */
(function () {
  const HERO_ROTATE_MS = 3000;
  const hero = document.querySelector('[data-hero-slider]');
  if (!hero) return;
  const frames = hero.querySelectorAll('.hero-frame');
  if (frames.length < 2) return;

  const reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    frames.forEach((f, k) => f.classList.toggle('is-active', k === 0));
    return;
  }

  let i = 0;
  let timer = null;
  const show = (n) => {
    i = (n + frames.length) % frames.length;
    frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
  };
  const next = () => show(i + 1);
  const start = () => {
    stop();
    timer = setInterval(next, HERO_ROTATE_MS);
  };
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  show(0);
  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      show(0);
      start();
    }
  });
})();

// ─── FLOAT CTA — See Pricing ───
(function () {
  if (document.getElementById('float-cta')) return;
  if (document.body.classList.contains('page-pamphlet-lander')) return;

  var path = (location.pathname || '').toLowerCase();
  if (
    /pricing\.html(?:$|[?#])/.test(path) ||
    /\/pricing\/?$/.test(path) ||
    path.indexOf('wedding-pricing') !== -1 ||
    path.indexOf('pricing-pamphlet') !== -1 ||
    path.indexOf('facebook-wedding') !== -1 ||
    path.indexOf('facebook-events') !== -1 ||
    path.indexOf('inquire') !== -1 ||
    path.indexOf('other-event-pricing') !== -1 ||
    path.indexOf('private-events') !== -1
  ) {
    return;
  }

  var parts = path.split('/').filter(Boolean);
  // /blog/post-slug/ or /blog/post-slug/index.html
  var inBlogPost =
    parts[0] === 'blog' &&
    parts.length >= 2 &&
    parts[1].indexOf('.html') === -1;
  var root = inBlogPost ? '../../' : '';

  var a = document.createElement('a');
  a.id = 'float-cta';
  a.href = root + 'pricing.html';
  a.textContent = 'See Pricing';
  a.setAttribute('aria-label', 'See pricing');
  document.body.appendChild(a);
})();
