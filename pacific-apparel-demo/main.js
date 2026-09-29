/* Pacific Apparel — concept redesign interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGSAP && !reduced;

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (!motion) document.documentElement.classList.add('no-motion');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links (smooth with Lenis, native otherwise)
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -20, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
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
  const countEl = $('[data-count]');

  function intro() {
    if (!motion) return;
    const tl = gsap.timeline();
    tl.from('.hero__title .word', { yPercent: 115, rotate: 4, duration: 1.3, ease: 'expo.out', stagger: 0.07 })
      .from('.reveal-up', { y: 28, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.35)
      .from('.hero__stamp', { scale: 0, rotate: -90, duration: 1.2, ease: 'expo.out' }, 0.5)
      .from('.nav', { y: -30, opacity: 0, duration: 1, ease: 'expo.out' }, 0.4);
  }

  if (motion) {
    document.body.classList.add('is-loading');
    gsap.set('.hero__title .word', { yPercent: 115 });
    const counter = { v: 0 };
    const path = $('.loader__thread path');
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: `8 7`, strokeDashoffset: 0 });
    gsap.fromTo(path, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power2.inOut' });
    gsap.to(path, { strokeDashoffset: -len, duration: 6, ease: 'none', repeat: -1 });
    gsap.to(counter, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => { countEl.textContent = Math.round(counter.v); },
      onComplete: () => {
        gsap.set('.hero__title .word', { clearProps: 'transform' });
        gsap.to(loader, {
          clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut',
          onComplete: () => { loader.remove(); document.body.classList.remove('is-loading'); ScrollTrigger.refresh(); }
        });
        intro();
      }
    });
  } else {
    loader.remove();
    const cap = $('.expand__caption');
    if (cap) cap.style.opacity = 1;
    const media = $('.expand__media');
    if (media) media.style.clipPath = 'inset(0 round 0)';
  }

  /* ---------- scroll effects ---------- */
  if (motion) {
    // Moving thread in hero
    const heroThread = $('.hero__thread path');
    gsap.fromTo(heroThread, { strokeDashoffset: 0 }, { strokeDashoffset: -600, duration: 14, ease: 'none', repeat: -1 });
    gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__thread', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Expanding image
    const exp = gsap.timeline({ scrollTrigger: { trigger: '.expand', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    exp.to('.expand__media', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 })
       .to('.expand__media img', { scale: 1, ease: 'none', duration: 1 }, 0)
       .fromTo('.expand__caption', { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 0.62);

    // Scroll-lit words
    $$('[data-split-words]').forEach(el => {
      const words = splitWords(el);
      gsap.to(words, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true }
      });
    });

    // Section titles rise
    $$('.section-title').forEach(t => {
      gsap.from(t, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 88%' } });
    });

    // Service rows
    gsap.from('.svc', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.svc-list', start: 'top 80%' } });

    // Horizontal work gallery (desktop only)
    ScrollTrigger.matchMedia({
      '(min-width: 721px)': () => {
        const track = $('.work__track');
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tween = gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: '.work', start: 'top top', end: () => '+=' + distance(),
            pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
        $$('.card img').forEach(img => {
          gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        return () => gsap.set(track, { clearProps: 'transform' });
      }
    });

    // Lab stage entrance
    gsap.from('.tee', { y: 80, rotate: 6, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.lab', start: 'top 70%' } });

    // Footer giant word
    gsap.from('.footer__word span', { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- nav behaviour ---------- */
  const nav = $('.nav');
  const lightSections = $$('[data-nav-light]');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-light', lightSections.some(el => { const r = el.getBoundingClientRect(); return r.top <= 36 && r.bottom >= 36; }));
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
    const open = !menu.classList.contains('is-open');
    if (!open) return closeMenu();
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
      const hov = e.target.closest('a, button, summary, label.upload, input[type="range"]');
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

    // Floating service image
    const float = $('.svc-float');
    const floatImg = $('img', float);
    const fx = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'power3' });
    const fy = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'power3' });
    gsap.set(float, { xPercent: -50, yPercent: -50 });
    $('.svc-list').addEventListener('mousemove', e => { fx(e.clientX + 40); fy(e.clientY); });
    $$('.svc').forEach(row => {
      row.addEventListener('mouseenter', () => {
        floatImg.src = row.dataset.img;
        gsap.to(float, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: 0.5, ease: 'expo.out' });
      });
      row.addEventListener('mouseleave', () => gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power3.out' }));
    });
  }

  /* ---------- process steps ---------- */
  const steps = $$('.step');
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

  /* ---------- Logo Lab ---------- */
  const lab = {
    text: 'YOUR BRAND', img: null, color: '#f4f1ea', ink: '#11151a', tech: 'embroidery', place: 'chest',
    labels: { embroidery: 'Embroidery', print: 'Print', chest: 'Left chest', center: 'Full front' },
    colorName: 'Natural'
  };
  const teeBase = $('.tee__base');
  const art = $('.tee__art');
  const txt = $('.tee__text');
  const img = $('.tee__img');
  const boxes = {
    chest: { x: 318, y: 172, w: 92, h: 64 },
    center: { x: 250, y: 250, w: 230, h: 190 }
  };

  function renderLab(pop = true) {
    teeBase.setAttribute('fill', lab.color);
    art.setAttribute('filter', lab.tech === 'embroidery' ? 'url(#f-stitch)' : 'url(#f-print)');
    const b = boxes[lab.place];
    if (lab.img) {
      txt.style.display = 'none';
      img.style.display = '';
      img.setAttribute('href', lab.img);
      img.setAttribute('x', b.x - b.w / 2);
      img.setAttribute('y', b.y - b.h / 2);
      img.setAttribute('width', b.w);
      img.setAttribute('height', b.h);
    } else {
      img.style.display = 'none';
      txt.style.display = '';
      txt.textContent = lab.text || 'YOUR BRAND';
      txt.setAttribute('fill', lab.ink);
      txt.setAttribute('x', b.x);
      txt.setAttribute('y', b.y);
      txt.setAttribute('font-size', 100);
      const len = txt.getComputedTextLength() || 1;
      const size = Math.min((b.w / len) * 100, lab.place === 'chest' ? 30 : 62);
      txt.setAttribute('font-size', size.toFixed(1));
    }
    $('[data-lab-tech]').textContent = lab.labels[lab.tech];
    $('[data-lab-place]').textContent = lab.labels[lab.place];
    if (pop && motion) gsap.fromTo(art, { scale: 0.92, transformOrigin: `${b.x}px ${b.y}px` }, { scale: 1, duration: 0.6, ease: 'back.out(2)' });
  }

  $('#lab-text').addEventListener('input', e => { lab.text = e.target.value.toUpperCase(); lab.img = null; renderLab(false); });
  $('#lab-file').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { lab.img = reader.result; renderLab(); };
    reader.readAsDataURL(f);
  });
  $$('.swatch').forEach(s => s.addEventListener('click', () => {
    $$('.swatch').forEach(x => x.classList.remove('is-active'));
    s.classList.add('is-active');
    lab.color = s.dataset.color; lab.ink = s.dataset.ink; lab.colorName = s.getAttribute('aria-label');
    renderLab();
  }));
  $$('.seg').forEach(seg => seg.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('button', seg).forEach(x => x.classList.remove('is-active'));
    btn.classList.add('is-active');
    lab[seg.dataset.group] = btn.dataset.val;
    renderLab();
  }));
  $('#lab-cta').addEventListener('click', () => {
    const notes = $('textarea[name="notes"]');
    const design = lab.img ? 'my uploaded logo' : `"${lab.text}"`;
    notes.value = `Logo Lab: ${design} — ${lab.labels[lab.tech]}, ${lab.labels[lab.place]}, ${lab.colorName} garment.`;
    const techChip = $$('[data-name="technique"] button').find(b => b.textContent.toLowerCase().startsWith(lab.tech === 'embroidery' ? 'embroidery' : 'garment'));
    if (techChip) techChip.click();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => renderLab(false));
  renderLab(false);

  /* ---------- quote builder ---------- */
  const form = $('.builder__form');
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
      qtyNote.textContent = `Heads up — screen print starts at ${minQty} pcs. Embroidery starts at 12.`;
      qtyNote.classList.add('is-warn');
    } else if (v >= 500) qtyNote.textContent = 'Big run — we\'ll include volume options in your quote.';
    else if (v >= 100) qtyNote.textContent = 'Nice run. Mix sizes and colors freely.';
    else qtyNote.textContent = 'Perfect for a team or first drop.';
  }
  qty.addEventListener('input', updateQty);
  updateQty();

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

  /* ---------- local clock ---------- */
  const clock = $('[data-clock]');
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' }).format(new Date());
  };
  tick();
  setInterval(tick, 30000);
})();
