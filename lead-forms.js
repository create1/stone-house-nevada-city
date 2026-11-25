/* Website lead forms → Stone House agent (n8n).
   The agent sends the reply/pamphlet and creates the Tripleseat lead,
   so these forms must not post anywhere else or leads get duplicated. */
(function () {
  'use strict';

  var ENDPOINT = 'https://stonehouse107.app.n8n.cloud/webhook/website-forms';
  var TIMEOUT_MS = 10000;
  var ERROR_MSG = 'Something went wrong — please email bookings@stonehouse.io or call 530-265-5050.';
  var DEFAULT_THANKS = 'Thank you! Check your email — we’ve just sent you a reply.';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Same booking pages the agent's reply email links to; keep the two in sync.
  var TOUR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1hlWtyqdPilSrP1nshTen3vieADnQSbm-V9OMZP4G-wDATPK7rWNJ0uNoRwUocwd8UbsxMeLk4';
  var CALL_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1K2koMgdAlGvNUPMGVEuxD6PS-a9wBPd7lmfz5pkyDuP-VUDh-hlI39Y0gHko0G_-HgJO0udsL';
  // The web pamphlet (api/wedding-pamphlet.js) only opens once this cookie is set; it must
  // match COOKIE_MAX_AGE there.
  var PAMPHLET_URL = '/wedding-pamphlet';
  var PAMPHLET_COOKIE = 'sh_pamphlet_wedding';
  var PAMPHLET_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

  var forms = document.querySelectorAll('form[data-lead-form]');
  if (!forms.length) return;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var now = new Date();
  var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());

  function control(form, name) {
    var el = form.elements.namedItem(name);
    return el && typeof el.value === 'string' ? el : null;
  }

  function value(form, name) {
    var el = control(form, name);
    return el ? el.value.trim() : '';
  }

  function digitCount(s) { return s.replace(/\D/g, '').length; }

  function setStatus(form, kind, msg) {
    var el = form.querySelector('[data-lead-status]');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.remove('is-error', 'is-success');
    if (kind) el.classList.add(kind === 'error' ? 'is-error' : 'is-success');
  }

  function problemFor(el) {
    var v = el.value.trim();
    var bad = el.validity && el.validity.badInput;
    if (el.required && !v && !bad) return 'Please fill in the required fields.';
    if (el.type === 'email' && v && !EMAIL_RE.test(v)) return 'Please enter a valid email address.';
    if (el.type === 'tel' && v && (digitCount(v) < 10 || digitCount(v) > 15)) return 'Please enter a valid phone number.';
    if (el.type === 'date' && (bad || (v && v < today))) return 'Please choose a valid upcoming date.';
    if (el.type === 'number' && (bad || (v && !(parseInt(v, 10) >= 1)))) return 'Please enter the number of guests.';
    return '';
  }

  function validate(form) {
    var problems = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name === 'website' || typeof el.value !== 'string') return;
      el.classList.remove('is-invalid');
      var msg = problemFor(el);
      if (msg) {
        el.classList.add('is-invalid');
        problems.push({ el: el, msg: msg });
      }
    });
    var backup = control(form, 'backup_date');
    if (backup && backup.value && backup.value === value(form, 'event_date')) {
      backup.classList.add('is-invalid');
      problems.push({ el: backup, msg: 'Choose a different backup date from your preferred date.' });
    }
    return problems;
  }

  function buildPayload(form) {
    var first = value(form, 'first_name');
    var last = value(form, 'last_name');
    var fullName = value(form, 'full_name');
    if (fullName && !first && !last) {
      var parts = fullName.split(/\s+/);
      first = parts.shift();
      last = parts.join(' ');
    }

    var notes = [];
    if (form.getAttribute('data-lead-note')) notes.push(form.getAttribute('data-lead-note'));
    if (value(form, 'backup_date')) notes.push('Backup date: ' + value(form, 'backup_date'));
    var message = value(form, 'message');
    if (notes.length) message = notes.join('. ') + (message ? '\n\n' + message : '');

    var guests = parseInt(value(form, 'guest_count'), 10);

    return {
      form_type: form.getAttribute('data-lead-form'),
      first_name: first,
      last_name: last,
      partner_name: value(form, 'partner_name'),
      email: value(form, 'email'),
      phone: value(form, 'phone'),
      event_type: value(form, 'event_type'),
      event_date: value(form, 'event_date'),
      guest_count: guests >= 1 ? guests : '',
      budget: value(form, 'budget'),
      message: message,
      page_url: window.location.href
    };
  }

  function send(payload) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer;
    var timeout = new Promise(function (_, reject) {
      timer = setTimeout(function () {
        if (ctrl) ctrl.abort();
        reject(new Error('timeout'));
      }, TIMEOUT_MS);
    });
    var request = fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      cache: 'no-store',
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
    });
    return Promise.race([request, timeout]).then(
      function () { clearTimeout(timer); },
      function (err) { clearTimeout(timer); throw err; }
    );
  }

  function track(form) {
    var source = form.getAttribute('data-lead-source') || form.getAttribute('data-lead-form');
    try {
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: source });
    } catch (e) {}
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { event_category: 'Lead', event_label: source });
      }
    } catch (e) {}
  }

  function showSuccess(form, btn) {
    form.removeAttribute('data-lead-state');
    form.removeAttribute('aria-busy');
    Array.prototype.forEach.call(form.elements, function (el) { el.disabled = true; });
    if (btn) {
      btn.textContent = form.getAttribute('data-lead-done') || '✓ Sent';
      btn.classList.add('is-success');
    }
    setStatus(form, 'success', form.getAttribute('data-lead-thanks') || DEFAULT_THANKS);
  }

  function make(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function isWeddingLead(payload) {
    return payload.form_type === 'pamphlet_wedding' || payload.event_type === 'Wedding';
  }

  function popupCopy(payload) {
    var hi = payload.first_name ? 'Hi ' + payload.first_name + ' — ' : 'Hi — ';
    var followUp = 'A member of our team will follow up personally, usually within one business day';
    switch (payload.form_type) {
      case 'contact':
        return { eyebrow: 'Message received', intro: hi + 'we’ve received your message, and a reply is on its way to your inbox. ' + followUp + ', to answer your questions.' };
      case 'pamphlet_wedding':
        return { eyebrow: 'Request received', intro: hi + 'we’ve received your request, and the pricing pamphlet is on its way to your inbox. ' + followUp + '.' };
      case 'pamphlet_other':
        return { eyebrow: 'Request received', intro: hi + 'we’ve received your request, and a reply is on its way to your inbox. ' + followUp + ', to answer your questions.' };
      default:
        return { eyebrow: 'Inquiry received', intro: hi + 'we’ve received your inquiry, and a reply is on its way to your inbox. ' + followUp + ', to confirm availability for your date and answer your questions.' };
    }
  }

  function popupSteps(payload) {
    var steps = [
      { key: 'tour', text: 'The best way to get a feel for the space is to see it in person.', label: 'Book a tour', href: TOUR_URL },
      { key: 'call', text: 'Prefer to talk things through first? Set up a quick 30-minute call.', label: 'Book a call', href: CALL_URL }
    ];
    if (isWeddingLead(payload)) {
      var pamphlet = { key: 'pamphlet', label: 'View pamphlet', href: PAMPHLET_URL };
      if (payload.form_type === 'pamphlet_wedding') {
        pamphlet.text = 'Here’s the pricing pamphlet you asked for.';
        steps.unshift(pamphlet);
      } else {
        pamphlet.text = 'In the meantime, our pricing pamphlet is a helpful place to start.';
        steps.push(pamphlet);
      }
    }
    return steps;
  }

  function trackStep(key, formType) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'lead_popup_click', { link_type: key, form_type: formType });
      } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push({ event: 'lead_popup_click', link_type: key, form_type: formType });
      }
    } catch (e) {}
  }

  var popup = null;

  function closePopup() {
    if (!popup) return;
    var current = popup;
    popup = null;
    current.root.classList.remove('is-open');
    document.body.style.overflow = current.overflow;
    setTimeout(function () {
      if (current.root.parentNode) current.root.parentNode.removeChild(current.root);
    }, 250);
    if (current.returnTo) {
      current.returnTo.setAttribute('tabindex', '-1');
      current.returnTo.focus();
    }
  }

  function openPopup(form, payload) {
    closePopup();
    if (isWeddingLead(payload)) {
      document.cookie = PAMPHLET_COOKIE + '=1; Path=/; Max-Age=' + PAMPHLET_COOKIE_MAX_AGE + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    }
    var copy = popupCopy(payload);
    var root = make('div', 'lf-pop');
    var panel = make('div', 'lf-pop-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'lf-pop-title');
    panel.setAttribute('aria-describedby', 'lf-pop-intro');
    panel.tabIndex = -1;

    var x = make('button', 'lf-pop-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    panel.appendChild(x);
    panel.appendChild(make('p', 'lf-pop-eyebrow', copy.eyebrow));
    var title = make('h2', 'lf-pop-title', 'Thanks for reaching out to Stone House!');
    title.id = 'lf-pop-title';
    panel.appendChild(title);
    var intro = make('p', 'lf-pop-intro', copy.intro);
    intro.id = 'lf-pop-intro';
    panel.appendChild(intro);

    var list = make('div', 'lf-pop-steps');
    popupSteps(payload).forEach(function (step, i) {
      var row = make('div', 'lf-pop-step');
      row.appendChild(make('p', 'lf-pop-step-text', step.text));
      var link = make('a', 'lf-pop-btn' + (i === 0 ? ' is-primary' : ''), step.label);
      link.href = step.href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('data-step', step.key);
      link.addEventListener('click', function () { trackStep(step.key, payload.form_type); });
      row.appendChild(link);
      list.appendChild(row);
    });
    panel.appendChild(list);

    var foot = make('p', 'lf-pop-foot', 'Questions? Email ');
    var mail = make('a', '', 'bookings@stonehouse.io');
    mail.href = 'mailto:bookings@stonehouse.io';
    var tel = make('a', '', '(530) 265-5050');
    tel.href = 'tel:+15302655050';
    foot.appendChild(mail);
    foot.appendChild(document.createTextNode(' or call '));
    foot.appendChild(tel);
    foot.appendChild(document.createTextNode('.'));
    panel.appendChild(foot);

    var done = make('button', 'lf-pop-close', 'Close');
    done.type = 'button';
    panel.appendChild(done);
    root.appendChild(panel);

    popup = { root: root, overflow: document.body.style.overflow, returnTo: form.querySelector('[data-lead-status]') };
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';

    x.addEventListener('click', closePopup);
    done.addEventListener('click', closePopup);
    var pressedBackdrop = false;
    root.addEventListener('mousedown', function (e) { pressedBackdrop = e.target === root; });
    root.addEventListener('click', function (e) {
      if (pressedBackdrop && e.target === root) closePopup();
    });
    // Handled on the overlay so Escape doesn't also reach page-level handlers (e.g. the pricing modal).
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closePopup();
        return;
      }
      if (e.key !== 'Tab') return;
      var items = panel.querySelectorAll('a[href], button');
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    requestAnimationFrame(function () { root.classList.add('is-open'); });
    panel.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    if (form.getAttribute('data-lead-state') === 'sending') return;
    var btn = form.querySelector('[type="submit"]');
    setStatus(form, '', '');

    if (value(form, 'website')) {
      showSuccess(form, btn);
      return;
    }

    var problems = validate(form);
    if (problems.length) {
      setStatus(form, 'error', problems[0].msg);
      problems[0].el.focus();
      return;
    }

    var payload = buildPayload(form);
    form.setAttribute('data-lead-state', 'sending');
    form.setAttribute('aria-busy', 'true');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    send(payload).then(
      function () {
        showSuccess(form, btn);
        track(form);
        openPopup(form, payload);
      },
      function () {
        form.removeAttribute('data-lead-state');
        form.removeAttribute('aria-busy');
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.getAttribute('data-label');
        }
        setStatus(form, 'error', ERROR_MSG);
      }
    );
  }

  Array.prototype.forEach.call(forms, function (form) {
    form.setAttribute('novalidate', '');
    var btn = form.querySelector('[type="submit"]');
    if (btn && !btn.hasAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
    Array.prototype.forEach.call(form.querySelectorAll('input[type="date"]'), function (el) {
      if (!el.min) el.min = today;
    });
    Array.prototype.forEach.call(form.elements, function (el) {
      el.addEventListener('input', function () { el.classList.remove('is-invalid'); });
    });
    form.addEventListener('submit', onSubmit);
  });
})();
