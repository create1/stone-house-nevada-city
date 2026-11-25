// Wedding pricing pamphlet (web version). Load before app.js: the section links below
// must claim their clicks before app.js's generic 80px-offset anchor handler, which
// doesn't account for the sticky section nav.
(function () {
  const body = document.body;
  const toc = document.querySelector('.pm-toc');
  const track = document.querySelector('.pm-toc-track');
  const hero = document.querySelector('.pm-hero');
  const contact = document.getElementById('contact');
  const nav = document.getElementById('nav');
  if (!toc || !track) return;

  const links = Array.from(track.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let stick = 0;
  function measure() {
    stick = (parseFloat(getComputedStyle(toc).top) || 0) + toc.offsetHeight;
    body.style.setProperty('--pm-stick', stick + 'px');
  }

  function goTo(target) {
    target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', '#' + target.id);
  }

  document.querySelectorAll('.pm a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      goTo(target);
    });
  });

  let active = null;
  function setActive(link) {
    if (link === active) return;
    if (active) active.removeAttribute('aria-current');
    active = link;
    if (!link) return;
    link.setAttribute('aria-current', 'true');
    const left = link.offsetLeft - (track.clientWidth - link.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  function update() {
    let current = null;
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top - stick <= 12) current = s;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && sections.length) current = sections[sections.length - 1];
    setActive(current ? links[sections.indexOf(current)] : null);

    if (hero) {
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
      body.classList.toggle('pm-over-hero', hero.getBoundingClientRect().bottom > navBottom + 1);
    }

    if (hero && contact) {
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.85;
      body.classList.toggle('pm-float-on', pastHero && !atContact);
    }
  }

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    onScroll();
  });

  document.addEventListener('click', (e) => {
    const cta = e.target.closest && e.target.closest('[data-cta]');
    if (!cta) return;
    (window.dataLayer = window.dataLayer || []).push({
      event: 'pamphlet_cta_click',
      pamphlet_cta: cta.getAttribute('data-cta'),
    });
  });
})();
