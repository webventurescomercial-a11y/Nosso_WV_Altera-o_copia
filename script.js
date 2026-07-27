  /* ─── FAQ accordion ─────────────────────────────────────────────── */
  var openFaq = -1;
  function toggleFaq(i) {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function(el, idx) {
      if (idx === i) {
        var opening = !el.classList.contains('open');
        el.classList.toggle('open', opening);
        openFaq = opening ? i : -1;
      } else {
        el.classList.remove('open');
      }
    });
  }

  /* ─── Form submit feedback ──────────────────────────────────────── */
  var form = document.querySelector('.the-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var card    = form.closest('.form-card');
      var success = card && card.querySelector('.form-success');
      if (success) {
        form.style.display = 'none';
        success.classList.add('visible');
        success.removeAttribute('aria-hidden');
      } else {
        var btn = form.querySelector('.btn-submit');
        btn.textContent = 'Pedido enviado!';
        btn.style.background = 'rgba(94,234,212,0.15)';
        btn.style.color = '#5EEAD4';
        btn.style.border = '1px solid rgba(94,234,212,0.3)';
        btn.disabled = true;
      }
    });
  }

  /* ─── Enhancement 2: Scroll-triggered reveal ────────────────────── */
  (function () {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: reveal everything immediately for old browsers */
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = el.dataset.delay;
        if (delay) el.style.animationDelay = delay + 'ms';
        el.classList.add('revealed');
        observer.unobserve(el);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }());

  /* ─── Enhancement 3: Counter animation ─────────────────────────── */
  (function () {
    /* Wrap the numeric part of each stat-num in a countable span */
    document.querySelectorAll('.stat-card .stat-num').forEach(function (numEl) {
      var text = numEl.textContent.trim();
      var match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      var counter = document.createElement('span');
      counter.className = 'stat-counter';
      counter.dataset.target = target;
      counter.textContent = '0';
      numEl.textContent = '';
      numEl.appendChild(counter);
      numEl.appendChild(document.createTextNode(suffix));
    });

    function animateCounter(el, target) {
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var counter = entry.target.querySelector('.stat-counter');
          if (counter) animateCounter(counter, parseInt(counter.dataset.target, 10));
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('.stat-card').forEach(function (card) {
        counterObserver.observe(card);
      });
    } else {
      document.querySelectorAll('.stat-counter').forEach(function (el) {
        el.textContent = el.dataset.target;
      });
    }
  }());

  /* ─── Home 2: "Porquê ter um website" count-up stats ────────────── */
  (function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var nums = document.querySelectorAll('.h2-stat-num');
    if (!nums.length) return;

    nums.forEach(function (numEl) {
      var text = numEl.textContent.trim();
      var match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      if (reduceMotion) return; /* leave final value as-is, no animation */
      var counter = document.createElement('span');
      counter.className = 'h2-stat-counter';
      counter.dataset.target = target;
      counter.textContent = '0';
      numEl.textContent = '';
      numEl.appendChild(counter);
      numEl.appendChild(document.createTextNode(suffix));
    });

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    function animateCount(el, target) {
      var duration = 1500;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else if (el.parentElement) {
          /* micro-flash punch when the number lands on its final value */
          el.parentElement.classList.add('h2-stat-pop');
        }
      }
      requestAnimationFrame(step);
    }

    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var counter = entry.target.querySelector('.h2-stat-counter');
        if (counter) animateCount(counter, parseInt(counter.dataset.target, 10));
        statObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.h2-stat').forEach(function (card) {
      statObserver.observe(card);
    });
  }());

  /* ─── Enhancement 6: Hamburger menu ─────────────────────────────── */
  (function () {
    var hamburger = document.getElementById('hamburger');
    var overlay   = document.getElementById('mobileOverlay');
    if (!hamburger || !overlay) return;

    function openMenu() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (hamburger.classList.contains('open')) closeMenu(); else openMenu();
    });

    overlay.querySelectorAll('.mobile-link, .mobile-cta').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
  }());

  /* ─── Enhancement 4: Process timeline animation ─────────────────── */
  (function () {
    var procWrap = document.querySelector('.proc-wrap');
    if (!procWrap) return;
    if (!('IntersectionObserver' in window)) {
      var t = procWrap.querySelector('.proc-track');
      if (t) t.classList.add('drawn');
      procWrap.querySelectorAll('.step-dot').forEach(function (d) { d.classList.add('lit'); });
      return;
    }
    var procObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var track = procWrap.querySelector('.proc-track');
        if (track) track.classList.add('drawn');
        var dots = procWrap.querySelectorAll('.step-dot');
        [300, 600, 900, 1200].forEach(function (delay, i) {
          if (dots[i]) setTimeout(function () { dots[i].classList.add('lit'); }, delay);
        });
        procObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    procObserver.observe(procWrap);
  }());

  /* ─── Home 2: process timeline — line draws, numbers light up ───── */
  (function () {
    var grid = document.querySelector('.h2-process-grid');
    if (!grid) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var steps = grid.querySelectorAll('.h2-step-n');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      /* leave the line as-is and light the numbers without animating */
      steps.forEach(function (n) { n.classList.add('lit'); });
      return;
    }

    grid.classList.add('h2-anim'); /* only hide the line when we can draw it */

    var procObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        grid.classList.add('drawn');
        [400, 800, 1200].forEach(function (delay, i) {
          if (steps[i]) setTimeout(function () { steps[i].classList.add('lit'); }, delay);
        });
        procObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    procObserver.observe(grid);
  }());

  /* ─── Header: subtle shrink once the page starts scrolling ──────── */
  (function () {
    var header = document.querySelector('header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }());

  /* ─── Animated cursor: teal dot + trailing ring + ambient glow ──── */
  (function () {
    if (!window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.documentElement.classList.add('cursor-fx');

    function make(cls) {
      var el = document.createElement('div');
      el.className = cls;
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
      return el;
    }
    var glow = make('cursor-glow');
    var dot  = make('cursor-dot');
    var ring = make('cursor-ring');

    var mx = window.innerWidth / 2,  my = window.innerHeight / 2; /* mouse */
    var rx = mx, ry = my;                                         /* ring (trails) */
    var gx = mx, gy = my;                                         /* glow (drifts) */
    var scale = 1, targetScale = 1, pressed = false;
    var active = false, raf = null;

    function loop() {
      /* lerp: ring chases the mouse, glow drifts even slower */
      rx += (mx - rx) * 0.16;  ry += (my - ry) * 0.16;
      gx += (mx - gx) * 0.09;  gy += (my - gy) * 0.09;
      scale += ((pressed ? targetScale * 0.8 : targetScale) - scale) * 0.2;

      dot.style.transform  = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) scale(' + scale.toFixed(3) + ')';
      glow.style.setProperty('--mx', gx.toFixed(1) + 'px');
      glow.style.setProperty('--my', gy.toFixed(1) + 'px');
      raf = requestAnimationFrame(loop);
    }

    function show() {
      if (active) return;
      active = true;
      glow.classList.add('on'); dot.classList.add('on'); ring.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function hide() {
      active = false;
      glow.classList.remove('on'); dot.classList.remove('on'); ring.classList.remove('on');
    }

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      /* native caret zones: step aside inside text fields */
      if (e.target.closest && e.target.closest('input, textarea, select')) {
        if (active) hide();
        return;
      }
      show();
      var interactive = e.target.closest &&
        e.target.closest('a, button, [role="button"], label, .faq-btn');
      targetScale = interactive ? 1.6 : 1;
      ring.classList.toggle('is-hover', !!interactive);
    }, { passive: true });

    window.addEventListener('mousedown', function () { pressed = true;  }, { passive: true });
    window.addEventListener('mouseup',   function () { pressed = false; }, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
  }());

  /* ─── Pricing carousel arrows ────────────────────────────────────── */
  (function () {
    var grid   = document.getElementById('priceGrid');
    var arrowL = document.getElementById('priceArrowL');
    var arrowR = document.getElementById('priceArrowR');
    if (!grid || !arrowL || !arrowR) return;

    function step() {
      var card = grid.querySelector('.price-card');
      if (!card) return grid.clientWidth;
      var style = window.getComputedStyle(grid);
      var gap = parseFloat(style.columnGap || style.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function updateArrows() {
      var maxScroll = grid.scrollWidth - grid.clientWidth - 1;
      arrowL.disabled = grid.scrollLeft <= 0;
      arrowR.disabled = grid.scrollLeft >= maxScroll;
    }

    arrowL.addEventListener('click', function () {
      grid.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    arrowR.addEventListener('click', function () {
      grid.scrollBy({ left: step(), behavior: 'smooth' });
    });
    grid.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }());

  /* ─── Enhancement 10: Portfolio category filter ─────────────────── */
  (function () {
    var filterBtns = document.querySelectorAll('.port-filter-btn');
    var cards = document.querySelectorAll('.port-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        cards.forEach(function (card) {
          var show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }());
