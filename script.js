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
        if (progress < 1) requestAnimationFrame(step);
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
