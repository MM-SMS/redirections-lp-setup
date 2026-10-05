/* ═══════════════════════════════════════════════════════════════════════
   WELLARAY US — conversion layer
   Countdown · quiz · cup mini-game · bonus timer · stock meter
   exit intent · social proof · FAQ · scroll reveal
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var CTA = 'https://scalingurl7.com/click?o=15169&a=1712';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function clock(sec) { return pad(Math.floor(sec / 60)) + ':' + pad(Math.max(0, sec) % 60); }
  function get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ───────────────────────────────── footer date ───────────────────── */
  (function dateline() {
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var d = new Date();
    var el = $('#dateNow');
    if (el) el.textContent = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    var y = $('#yearNow');
    if (y) y.textContent = d.getFullYear();
  })();

  /* ───────────────────────────────── scroll progress ───────────────── */
  (function progress() {
    var bar = $('#progressBar');
    if (!bar) return;
    var tick = function () {
      var top = window.pageYOffset || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (h > 0 ? (top / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  })();

  /* ───────────────────────────────── top countdown ─────────────────── */
  (function topCountdown() {
    var el = $('#topTimer');
    if (!el) return;
    var KEY = 'wl_top_end';
    var end = parseInt(get(KEY) || '0', 10);
    if (!end || isNaN(end) || end < Date.now()) {
      end = Date.now() + 15 * 60 * 1000;
      set(KEY, String(end));
    }
    var tick = function () {
      var left = Math.round((end - Date.now()) / 1000);
      if (left <= 0) { end = Date.now() + 15 * 60 * 1000; set(KEY, String(end)); left = 900; }
      el.textContent = clock(left);
    };
    tick();
    setInterval(tick, 1000);
  })();

  /* ───────────────────────────────── scroll reveal ─────────────────── */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    // Positive bottom margin: elements are revealed BEFORE they hit the viewport,
    // so fast scrolling never leaves empty sections.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '200px 0px 40% 0px', threshold: 0 });
    items.forEach(function (n) { io.observe(n); });

    // Safety net: anything still hidden after 6 seconds is shown.
    setTimeout(function () {
      $$('.reveal:not(.in)').forEach(function (n) { n.classList.add('in'); });
    }, 6000);
  })();

  /* ───────────────────────────────── FAQ ───────────────────────────── */
  $$('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentNode;
      var panel = $('.faq-a', item);
      var open = item.classList.contains('open');
      $$('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        $('.faq-a', other).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ───────────────────────────────── comments ──────────────────────── */
  (function comments() {
    var more = $('#moreCmts');
    if (more) {
      more.addEventListener('click', function () {
        $$('[data-extra]').forEach(function (n) { n.hidden = false; });
        more.remove();
      });
    }
    $$('[data-like]').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.classList.toggle('liked');
        var counter = $('.reacts span', b.parentNode);
        if (counter) counter.textContent = parseInt(counter.textContent, 10) + (on ? 1 : -1);
      });
    });
  })();

  /* ───────────────────────────────── confetti ──────────────────────── */
  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = document.createElement('div');
    box.className = 'confetti';
    var colors = ['#E3B23C', '#F3D689', '#2C7A62', '#E9A7B5', '#14513F'];
    for (var i = 0; i < 90; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = -20 - Math.random() * 120 + 'px';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (2.4 + Math.random() * 2.2) + 's';
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 5200);
  }

  /* ───────────────────────────────── modals ────────────────────────── */
  function openModal(sel) {
    var m = $(sel);
    if (!m) return;
    m.classList.add('visible');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m) {
    m.classList.remove('visible');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  $$('.modal-overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.hasAttribute('data-close-modal')) closeModal(ov);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $$('.modal-overlay.visible').forEach(closeModal);
  });

  /* ───────────────────────────────── quiz ──────────────────────────── */
  var QUIZ = [
    {
      q: 'How many cups of coffee do you usually drink a day?',
      a: ['1 cup — the morning one', '2–3 cups', '4 or more', 'I mostly drink tea']
    },
    {
      q: 'What has most often derailed your past attempts?',
      a: ['Busy workdays', 'Evening snacking on the couch', 'Dinners out and weekends', 'I just lost motivation']
    },
    {
      q: 'How much time would you spend on a new morning routine?',
      a: ['Under a minute', 'Up to 5 minutes', '15 minutes or more', 'Ideally no time at all']
    }
  ];

  (function quiz() {
    var card = $('#quizCard');
    if (!card) return;
    var qEl = $('#quizQ'), optsEl = $('#quizOpts'), fill = $('#quizFill'), label = $('#quizStepLabel');
    var step = 0;

    function render() {
      var item = QUIZ[step];
      qEl.textContent = item.q;
      label.textContent = 'Question ' + (step + 1) + ' of ' + QUIZ.length;
      fill.style.width = ((step + 1) / QUIZ.length) * 100 + '%';
      optsEl.innerHTML = '';
      item.a.forEach(function (text, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'quiz-opt';
        b.innerHTML = '<span class="kbd">' + 'ABCD'[i] + '</span><span></span>';
        $('span:last-child', b).textContent = text;
        b.addEventListener('click', next);
        optsEl.appendChild(b);
      });
    }

    function next() {
      step++;
      if (step < QUIZ.length) { render(); return; }
      card.innerHTML =
        '<div class="quiz-done">' +
          '<div class="tickbig"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg></div>' +
          '<h3 class="quiz-q" style="margin-bottom:8px">Thanks — your profile qualifies for the US allocation</h3>' +
          '<p style="color:var(--ink-muted);margin:0">Now pick your morning cup below to unlock your bonus.</p>' +
        '</div>';
      var wrap = $('#gameWrap');
      wrap.hidden = false;
      setTimeout(function () {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 260);
    }

    render();
  })();

  /* ───────────────────────────────── cup mini-game ─────────────────── */
  var PRIZES = [
    { name: 'Gold Cup',  def: 'the Gold Cup',  label: 'Biggest bonus', win: true },
    { name: 'Green Cup', def: 'the Green Cup', label: 'Standard',      win: false },
    { name: 'Empty Cup', def: 'the Empty Cup', label: 'No bonus',      win: false }
  ];

  function cupSvg(open) {
    if (open) {
      return '<svg width="62" height="62" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">' +
             '<path d="M12 22h32v16a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12z"/>' +
             '<path d="M44 26h4a7 7 0 0 1 0 14h-4"/>' +
             '<path d="M22 8c-2 4 2 5 0 9M32 6c-2 4.5 2 5.5 0 10M42 8c-2 4 2 5 0 9"/></svg>';
    }
    return '<svg width="62" height="62" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">' +
           '<path d="M12 22h32v16a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12z"/>' +
           '<path d="M44 26h4a7 7 0 0 1 0 14h-4"/>' +
           '<path d="M8 18h40" /><circle cx="32" cy="34" r="6"/><path d="M32 30v8M29 34h6"/></svg>';
  }

  (function cupGame() {
    var stage = $('#gameStage');
    if (!stage) return;
    var status = $('#gameStatus');
    var picked = false;

    // winning cup is placed at random
    var order = [0, 1, 2].sort(function () { return Math.random() - 0.5; });

    for (var i = 0; i < 3; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cup';
      b.setAttribute('data-idx', String(i));
      b.innerHTML = '<span class="cupface" style="color:var(--green-700)">' + cupSvg(false) + '</span>' +
                    '<span class="cup-label">Cup ' + (i + 1) + '</span>';
      b.addEventListener('click', pick);
      stage.appendChild(b);
    }

    function openCup(el, prize, isPick) {
      el.classList.add('is-open');
      if (prize.win) el.classList.add('is-win');
      else if (!isPick) el.classList.add('is-dud');
      $('.cupface', el).innerHTML = cupSvg(true);
      $('.cup-label', el).textContent = prize.label;
      var p = document.createElement('span');
      p.className = 'cup-prize';
      p.textContent = prize.name;
      el.appendChild(p);
    }

    function pick(e) {
      if (picked) return;
      picked = true;
      var el = e.currentTarget;
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      var prize = PRIZES[order[idx]];

      $$('.cup').forEach(function (c) { c.disabled = true; });
      el.classList.add('shake');
      status.textContent = 'Opening your cup…';

      setTimeout(function () {
        el.classList.remove('shake');
        openCup(el, prize, true);

        // reveal the other cups shortly after
        setTimeout(function () {
          $$('.cup').forEach(function (c) {
            var j = parseInt(c.getAttribute('data-idx'), 10);
            if (j !== idx) openCup(c, PRIZES[order[j]], false);
          });

          var won = prize.win ? PRIZES[0].def : PRIZES[1].def;
          status.innerHTML = prize.win
            ? '🎉 You found <b>the Gold Cup</b> — today\'s biggest bonus is yours.'
            : 'Your cup unlocks <b>the standard bonus</b> — and it\'s still active for this session.';

          var title = $('#rewardTitle');
          if (title) title.innerHTML = 'You got <span style="color:var(--gold-600)">' + won + '</span>';
          var wp = $('#winPrize');
          if (wp) wp.textContent = won;

          var box = $('#rewardBox');
          box.hidden = false;
          startRewardTimer();
          startStock();
          if (prize.win) confetti();
          setTimeout(function () { openModal('#winModal'); }, 500);
        }, 620);
      }, 700);
    }
  })();

  /* ───────────────────────────────── bonus timer ───────────────────── */
  var rewardStarted = false;
  function startRewardTimer() {
    if (rewardStarted) return;
    rewardStarted = true;
    var el = $('#rewardTimer');
    if (!el) return;
    var left = 600;
    var id = setInterval(function () {
      left--;
      el.textContent = clock(left);
      if (left <= 0) {
        clearInterval(id);
        el.textContent = 'extended';
        var wrap = el.parentNode;
        if (wrap) wrap.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> Your reservation has been extended once — last chance';
      }
    }, 1000);
  }

  /* ───────────────────────────────── stock meter ───────────────────── */
  var stockStarted = false;
  function startStock() {
    if (stockStarted) return;
    stockStarted = true;
    var fill = $('#stockFill'), num = $('#stockNum');
    if (!fill || !num) return;
    var left = 66;
    var paint = function () {
      num.textContent = left;
      fill.style.width = Math.max(4, (left / 300) * 100) + '%';
    };
    paint();
    (function drip() {
      setTimeout(function () {
        if (left > 12) { left -= 1 + Math.floor(Math.random() * 2); paint(); drip(); }
      }, 6000 + Math.random() * 9000);
    })();
  }

  /* ───────────────────────────────── sticky buy bar ────────────────── */
  (function buybar() {
    var bar = $('#buybar');
    if (!bar) return;
    var closed = false;
    $('#buybarClose').addEventListener('click', function () {
      closed = true;
      bar.classList.remove('show');
    });
    var tick = function () {
      if (closed) return;
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var footer = $('.site-footer');
      var nearEnd = footer && (y + window.innerHeight) > (footer.offsetTop + 120);
      if (y > 700 && !nearEnd) bar.classList.add('show');
      else bar.classList.remove('show');
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  })();

  /* ───────────────────────────────── exit intent ───────────────────── */
  (function exitIntent() {
    if (get('wl_exit_seen')) return;
    var armed = false;
    setTimeout(function () { armed = true; }, 15000);

    function fire() {
      if (!armed || get('wl_exit_seen')) return;
      if ($$('.modal-overlay.visible').length) return;
      set('wl_exit_seen', '1');
      openModal('#exitModal');
    }

    // desktop: mouse leaves the viewport through the top
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 4) fire();
    });

    // mobile: fast upward swipe after being far down the page.
    // Touch devices only, and never right after an anchor jump or a
    // programmatic scroll (otherwise menu links and #links trigger the modal).
    var touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!touch) return;

    var quietUntil = 0;
    var hush = function () { quietUntil = Date.now() + 1500; };
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) hush();
    }, true);
    window.addEventListener('hashchange', hush);

    var lastY = 0, lastT = 0, deep = false;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var t = Date.now();
      if (y > 1600) deep = true;
      var dy = lastY - y;                 // positive = moving up
      var dt = t - lastT;
      // only real, continuous swipes: moderate jump over a short time
      if (deep && t > quietUntil && dt > 16 && dt < 400 && dy > 90 && dy < 700 && y < 900) fire();
      lastY = y; lastT = t;
    }, { passive: true });
  })();

  /* ───────────────────────────────── social proof ──────────────────── */
  var PEOPLE = [
    ['Jennifer K.', 'Austin, TX'], ['Mark B.', 'Denver, CO'], ['Linda P.', 'Minneapolis, MN'],
    ['Steve H.', 'Columbus, OH'], ['Ashley V.', 'Phoenix, AZ'], ['Donna L.', 'Tampa, FL'],
    ['Jason T.', 'Charlotte, NC'], ['Pam N.', 'Nashville, TN'], ['Rachel S.', 'Portland, OR'],
    ['Mike M.', 'Kansas City, MO'], ['Lori D.', 'Sacramento, CA'], ['Tina G.', 'Atlanta, GA'],
    ['Chris A.', 'Pittsburgh, PA'], ['Barbara E.', 'Boise, ID'], ['Kim R.', 'Richmond, VA'],
    ['Karen W.', 'San Antonio, TX'], ['Dave J.', 'Milwaukee, WI'], ['Susan F.', 'Albany, NY']
  ];
  var ACTIONS = [
    'secured their order',
    'just placed an order',
    'checked stock',
    'claimed their bonus'
  ];

  (function toasts() {
    var el = $('#toast');
    if (!el) return;
    var line = $('#toastLine'), sub = $('#toastSub');
    var hideTimer;
    var stopped = false;

    $('#toastClose').addEventListener('click', function () {
      el.classList.remove('show');
      clearTimeout(hideTimer);
      stopped = true;
    });

    function show() {
      if (stopped) return;
      var p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      var a = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      var mins = 1 + Math.floor(Math.random() * 14);
      line.innerHTML = '<b>' + p[0] + '</b> from ' + p[1] + ' ' + a;
      sub.textContent = mins + ' minute' + (mins === 1 ? '' : 's') + ' ago';
      el.classList.add('show');
      hideTimer = setTimeout(function () {
        el.classList.remove('show');
        setTimeout(show, 9000 + Math.random() * 12000);
      }, 6000);
    }

    setTimeout(show, 9000);
  })();

  /* ───────────────────────────────── CTA integrity ─────────────────── */
  // Ensures every link marked as a CTA points to the right place.
  $$('a[rel~="sponsored"]').forEach(function (a) {
    if (a.getAttribute('href') !== CTA) a.setAttribute('href', CTA);
    a.setAttribute('target', '_blank');
  });

})();
