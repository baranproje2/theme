/* Pacific Apparel — concept redesign interactions (shared by index.html and products.html) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGSAP && !reduced;

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (!motion) document.documentElement.classList.add('no-motion');

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToEl = (target, instant) => {
    const offset = target === document.body ? 0 : -70;
    if (instant) {
      // Absolute position: Lenis' own position can be stale after the browser's native hash jump
      const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY + offset);
      window.scrollTo(0, y);
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      return;
    }
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  // Same-page anchor links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      scrollToEl(target);
    });
  });

  /* ---------- split words (for scroll-lit text) ---------- */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    return $$('.w', el);
  }

  /* ---------- loader + intro ---------- */
  const loader = $('.loader');
  const titleWords = '.hero__title .word, .pp-hero__title .word';

  function intro() {
    if (!motion) return;
    const tl = gsap.timeline();
    // Nav children animate (not the fixed bar itself) so the bar never ends up offset
    tl.from('.nav > *', { y: -16, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity' }, 0.1)
      .from(titleWords, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.06 }, 0)
      .from('.reveal-up', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.3);
    if ($('.hero__visual')) {
      tl.from('.hv', { y: 60, opacity: 0, scale: 0.94, duration: 1.3, ease: 'expo.out', stagger: 0.1 }, 0.25)
        .from('.hero__stamp', { scale: 0, rotate: -90, duration: 1.1, ease: 'expo.out' }, 0.6);
    }
  }

  // Arriving via a deep link (e.g. from the products page) skips the intro loader
  const deepTarget = location.hash.length > 1 ? $(location.hash) : null;

  if (loader && motion && !deepTarget) {
    document.body.classList.add('is-loading');
    gsap.set(titleWords, { yPercent: 115 });
    const counter = { v: 0 };
    const countEl = $('[data-count]');
    const path = $('.loader__thread path');
    gsap.fromTo(path, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power2.inOut' });
    gsap.to(path, { strokeDashoffset: -300, duration: 6, ease: 'none', repeat: -1 });
    gsap.to(counter, {
      v: 100, duration: 1.3, ease: 'power2.inOut',
      onUpdate: () => { countEl.textContent = Math.round(counter.v); },
      onComplete: () => {
        gsap.set(titleWords, { clearProps: 'transform' });
        gsap.to(loader, {
          clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut',
          onComplete: () => { loader.remove(); document.body.classList.remove('is-loading'); ScrollTrigger.refresh(); }
        });
        intro();
      }
    });
  } else {
    if (loader) loader.remove();
    if (motion) intro();
    const cap = $('.expand__caption');
    if (cap && !motion) cap.style.opacity = 1;
    const media = $('.expand__media');
    if (media && !motion) media.style.clipPath = 'inset(0 round 0)';
    if (deepTarget) {
      // Layout above the target keeps changing while fonts load and ScrollTrigger refreshes
      // (which restores its own saved position), so re-apply until the visitor scrolls themselves.
      const go = () => scrollToEl(deepTarget, true);
      const stop = () => {
        if (hasGSAP) ScrollTrigger.removeEventListener('refresh', go);
        ['wheel', 'touchstart', 'keydown'].forEach(ev => window.removeEventListener(ev, stop));
      };
      if (hasGSAP) ScrollTrigger.addEventListener('refresh', go);
      ['wheel', 'touchstart', 'keydown'].forEach(ev => window.addEventListener(ev, stop, { passive: true }));
      setTimeout(stop, 5000);
      setTimeout(go, 80);
      if (document.fonts) document.fonts.ready.then(() => setTimeout(go, 50));
      window.addEventListener('load', () => setTimeout(go, 120));
    }
  }

  /* ---------- scroll effects ---------- */
  if (motion) {
    if ($('.hero__visual')) {
      gsap.to('.hv--main', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hv--top', { yPercent: -22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hv--bottom', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    if ($('.expand')) {
      const exp = gsap.timeline({ scrollTrigger: { trigger: '.expand', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      // Explicit from/to: the computed start value is shortened by the browser and would tween unevenly
      exp.fromTo('.expand__media', { clipPath: 'inset(18% 26% 18% 26% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 })
         .fromTo('.expand__caption', { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 0.62);
    }

    $$('[data-split-words]').forEach(el => {
      const words = splitWords(el);
      gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } });
    });

    $$('.section-title').forEach(t => {
      gsap.from(t, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 88%' } });
    });

    if ($('.svc-list')) gsap.from('.svc', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.svc-list', start: 'top 80%' } });
    if ($('.p-grid')) gsap.from('.p-card', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.p-grid', start: 'top 85%' } });

    $$('.pp-section, .pp-perks, .pp-catalogs').forEach(sec => {
      gsap.from($$('.pp-card, .pp-wide, .pp-promo, .pp-perk, .pp-cat', sec), { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: sec, start: 'top 82%' } });
    });

    if ($('.work__track')) {
      ScrollTrigger.matchMedia({
        '(min-width: 721px)': () => {
          const track = $('.work__track');
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
          gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + distance(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
          });
          return () => gsap.set(track, { clearProps: 'transform' });
        }
      });
    }

    if ($('.footer__word')) gsap.from('.footer__word span', { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- nav behaviour ---------- */
  const nav = $('.nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });

  const burger = $('.nav__burger');
  const menu = $('.mobile-menu');
  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return closeMenu();
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (lenis) lenis.stop();
  });

  /* ---------- cursor + magnetic ---------- */
  if (finePointer && hasGSAP) {
    const cursor = $('.cursor');
    const label = $('.cursor__label');
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); cursor.style.opacity = 1; }, { passive: true });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; });
    document.addEventListener('mouseover', e => {
      const view = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, summary, input[type="range"]');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-hover', !view && !!hov);
      if (view) label.textContent = view.dataset.cursor;
    });

    if (!reduced) {
      $$('.magnetic').forEach(el => {
        const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        el.addEventListener('mousemove', e => {
          const r = el.getBoundingClientRect();
          mx((e.clientX - r.left - r.width / 2) * 0.3);
          my((e.clientY - r.top - r.height / 2) * 0.35);
        });
        el.addEventListener('mouseleave', () => { mx(0); my(0); });
      });
    }

    const float = $('.svc-float');
    if (float) {
      const floatImg = $('img', float);
      const fx = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'power3' });
      const fy = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'power3' });
      gsap.set(float, { xPercent: -50, yPercent: -50 });
      $('.svc-list').addEventListener('mousemove', e => { fx(e.clientX + 40); fy(e.clientY); });
      $$('.svc').forEach(row => {
        row.addEventListener('mouseenter', () => {
          floatImg.src = row.dataset.img;
          gsap.to(float, { opacity: 1, scale: 1, rotate: gsap.utils.random(-5, 5), duration: 0.5, ease: 'expo.out' });
        });
        row.addEventListener('mouseleave', () => gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power3.out' }));
      });
    }
  }

  /* ---------- process steps ---------- */
  const steps = $$('.step');
  if (steps.length) {
    const stepImgs = $$('.process__frame img');
    const bar = $('.process__progress span');
    const setStep = i => {
      steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
      stepImgs.forEach((im, j) => im.classList.toggle('is-active', j === i));
      bar.style.width = `${(i + 1) * 25}%`;
    };
    setStep(0);
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setStep(+en.target.dataset.step); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  }

  /* ---------- products page: filter + deep links ---------- */
  const filter = $('.pp-filter');
  if (filter) {
    const sections = $$('.pp-section');
    const apply = cat => {
      $$('button', filter).forEach(b => {
        const on = b.dataset.filter === cat;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', on);
      });
      sections.forEach(s => { s.hidden = cat !== 'all' && s.dataset.cat !== cat; });
      if (hasGSAP) ScrollTrigger.refresh();
    };
    filter.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (btn) apply(btn.dataset.filter);
    });
  }

  // "Request a quote" from a product card pre-fills the quote form on the homepage
  $$('[data-product]').forEach(a => a.addEventListener('click', () => store.set('pa-product', a.dataset.product)));

  /* ---------- quote builder ---------- */
  const form = $('.builder__form');
  if (form) {
    const qty = $('#qty');
    const qtyOut = $('[data-qty]');
    const qtyNote = $('[data-qty-note]');
    let minQty = 0;

    $$('.chips').forEach(group => group.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (group.hasAttribute('data-multi')) btn.classList.toggle('is-on');
      else {
        $$('button', group).forEach(b => b.classList.remove('is-on'));
        btn.classList.add('is-on');
      }
      if (group.dataset.name === 'technique') { minQty = +btn.dataset.min || 0; updateQty(); }
    }));

    function updateQty() {
      const v = +qty.value;
      qtyOut.textContent = v >= 1000 ? '1000+' : v;
      const pct = ((v - qty.min) / (qty.max - qty.min)) * 100;
      qty.style.background = `linear-gradient(90deg, #fff ${pct}%, rgba(255,255,255,.3) ${pct}%)`;
      qtyNote.classList.remove('is-warn');
      if (minQty && v < minQty) {
        qtyNote.textContent = `Heads up — screen print starts at ${minQty} pcs. Garment print has no minimum.`;
        qtyNote.classList.add('is-warn');
      } else if (v >= 500) qtyNote.textContent = 'Big run — ask us about contract pricing.';
      else if (v >= 100) qtyNote.textContent = 'Nice run. Mix sizes and colors freely.';
      else qtyNote.textContent = 'Perfect for a team or first drop.';
    }
    qty.addEventListener('input', updateQty);
    updateQty();

    const picked = store.get('pa-product');
    if (picked) {
      form.elements.notes.value = `Interested in: ${picked}`;
      store.del('pa-product');
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = $('.builder__msg');
      const name = form.elements.name, email = form.elements.email;
      let ok = true;
      [name, email].forEach(i => {
        const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle('is-invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { msg.textContent = 'Add your name and a valid email so we can reply.'; return; }
      const pick = n => $$(`[data-name="${n}"] .is-on`).map(b => b.textContent).join(', ') || '—';
      const body = [
        `Products: ${pick('product')}`,
        `Technique: ${pick('technique')}`,
        `Quantity: ${qtyOut.textContent} pcs`,
        `Need it by: ${form.elements.date.value || 'Flexible'}`,
        '',
        `Name: ${name.value}`,
        `Company: ${form.elements.company.value || '—'}`,
        `Email: ${email.value}`,
        '',
        form.elements.notes.value
      ].join('\n');
      const subject = `Quote request — ${form.elements.company.value || name.value}`;
      window.location.href = `mailto:info@pacapparel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      msg.textContent = 'Opening your email app — hit send and we\'ll take it from there.';
    });
  }

  /* ---------- local clock ---------- */
  const clock = $('[data-clock]');
  if (clock) {
    const tick = () => {
      clock.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' }).format(new Date());
    };
    tick();
    setInterval(tick, 30000);
  }
})();
