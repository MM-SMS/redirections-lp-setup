/**
 * The Wellbeing Post — advertorial behavior layer.
 *
 * Everything on the page that moves lives here: the persistent countdown, the
 * pop-up queue, the qualification quiz, the discussion thread, the social-proof
 * toasts and the sticky furniture.
 */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function store(kind) {
    var s = kind === 'session' ? window.sessionStorage : window.localStorage;
    return {
      get: function (k) { try { return s.getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { s.setItem(k, String(v)); } catch (e) { /* private mode */ } }
    };
  }

  var local = store('local');
  var session = store('session');

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* =====================================================================
     1. Persistent countdown
     ---------------------------------------------------------------------
     The deadline is written to localStorage the first time the page is
     opened. Every later render reads that same stored timestamp, so
     refreshing, re-opening the tab or coming back tomorrow never gives the
     visitor a fresh window. When it reaches zero it stays at zero.
     ===================================================================== */
  var Countdown = (function () {
    var KEY = 'wellaray_adv_offer_deadline';
    var WINDOW_MS = 45 * 60 * 1000;

    var deadline = parseInt(local.get(KEY), 10);
    if (!deadline || isNaN(deadline)) {
      deadline = Date.now() + WINDOW_MS;
      local.set(KEY, deadline);
    }

    var listeners = [];
    var expired = false;

    function remaining() { return Math.max(0, deadline - Date.now()); }

    function parts() {
      var total = Math.floor(remaining() / 1000);
      return {
        h: Math.floor(total / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
        total: total
      };
    }

    function tick() {
      var p = parts();
      var hms = pad(p.h) + ':' + pad(p.m) + ':' + pad(p.s);
      var ms = pad(p.h * 60 + p.m) + ':' + pad(p.s);

      $$('[data-clock="h"]').forEach(function (el) { el.textContent = pad(p.h); });
      $$('[data-clock="m"]').forEach(function (el) { el.textContent = pad(p.m); });
      $$('[data-clock="s"]').forEach(function (el) { el.textContent = pad(p.s); });
      $$('[data-clock="hms"]').forEach(function (el) { el.textContent = hms; });
      $$('[data-clock="ms"]').forEach(function (el) { el.textContent = ms; });

      if (p.total === 0 && !expired) {
        expired = true;
        document.body.classList.add('offer-expired');
        $$('[data-clock-note]').forEach(function (el) {
          el.textContent = 'Your held allocation has been released back into general U.S. stock. ' +
            'Remaining boxes from this batch are now first come, first served.';
        });
        listeners.forEach(function (fn) { fn(); });
      }
    }

    tick();
    window.setInterval(tick, 1000);

    return {
      remaining: remaining,
      parts: parts,
      isExpired: function () { return remaining() === 0; },
      /* A visitor returning after the window closed is already expired by the
         time this is called, so fire immediately rather than never. */
      onExpire: function (fn) {
        if (expired) { fn(); } else { listeners.push(fn); }
      }
    };
  })();

  /* =====================================================================
     2. Pop-up queue — one modal on screen at a time
     ===================================================================== */
  var Pop = (function () {
    var current = null;
    var queue = [];

    function open(id) {
      var box = document.getElementById(id);
      if (!box) { return; }
      if (current) { queue.push(id); return; }
      current = box;
      box.classList.add('is-on');
      document.body.classList.add('is-locked');
      var focusable = box.querySelector('.btn, button');
      if (focusable) { focusable.focus(); }
    }

    function close() {
      if (!current) { return; }
      current.classList.remove('is-on');
      current = null;
      document.body.classList.remove('is-locked');
      if (queue.length) {
        window.setTimeout(function () { open(queue.shift()); }, 450);
      }
    }

    document.addEventListener('click', function (e) {
      if (e.target.matches('.pop__x, [data-pop-close]')) { close(); return; }
      if (e.target.classList.contains('pop')) { close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); }
    });

    return { open: open, close: close, isOpen: function () { return !!current; } };
  })();

  /* Anything with data-pop="id" opens that pop-up. */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-pop]');
    if (trigger) {
      e.preventDefault();
      Pop.open(trigger.getAttribute('data-pop'));
    }
  });

  /* Every call to action is a plain <a href="offer">, so the browser handles
     the navigation. Nothing here may intercept those clicks. */
  function offerHref() {
    var cta = document.getElementById('checkout_cta');
    if (cta && cta.getAttribute('href')) return cta.getAttribute('href');
    return 'https://scalingurl7.com/click?o=15169&a=1712';
  }

  /* =====================================================================
     3. Pop-up triggers
     ===================================================================== */

  /* 3a. Cookie / consent bar — first thing the visitor sees. */
  (function cookieBar() {
    var bar = $('#cookiebar');
    if (!bar) { return; }
    if (local.get('wellaray_adv_cookies')) { return; }

    window.setTimeout(function () { bar.classList.add('is-on'); }, 1200);

    bar.addEventListener('click', function (e) {
      if (!e.target.closest('[data-cookie]')) { return; }
      local.set('wellaray_adv_cookies', e.target.getAttribute('data-cookie'));
      bar.classList.remove('is-on');
    });
  })();

  /* 3b. Welcome offer — after a short dwell, once per session. */
  (function welcome() {
    if (session.get('pop_welcome')) { return; }
    window.setTimeout(function () {
      if (session.get('pop_welcome')) { return; }
      session.set('pop_welcome', 1);
      Pop.open('pop-welcome');
    }, 9000);
  })();

  /* 3c. Halfway nudge — fires once, at the 45% scroll mark. */
  (function halfway() {
    if (session.get('pop_half')) { return; }
    function onScroll() {
      var depth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (depth < 0.45) { return; }
      window.removeEventListener('scroll', onScroll);
      session.set('pop_half', 1);
      Pop.open('pop-halfway');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* 3d. Exit intent — pointer leaving the viewport on desktop, a hard
         upward flick on touch devices. */
  (function exitIntent() {
    if (session.get('pop_exit')) { return; }

    function fire() {
      if (session.get('pop_exit')) { return; }
      session.set('pop_exit', 1);
      Pop.open('pop-exit');
    }

    document.addEventListener('mouseout', function (e) {
      if (e.relatedTarget || e.clientY > 12) { return; }
      if (Pop.isOpen()) { return; }
      fire();
    });

    var lastY = window.scrollY;
    var armed = false;
    window.setTimeout(function () { armed = true; }, 20000);
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var jumpedUp = lastY - y > 260;
      lastY = y;
      if (armed && jumpedUp && y > 600 && !Pop.isOpen()) { fire(); }
    }, { passive: true });
  })();

  /* 3e. Pick-a-card bonus — three cards, one reveal. */
  (function picker() {
    var wrap = $('#picker');
    if (!wrap) { return; }
    var prizes = [
      'Free tracked U.S. shipping',
      'Bonus 7-day starter packets',
      'Priority processing — ships today'
    ];
    var done = false;

    wrap.addEventListener('click', function (e) {
      var card = e.target.closest('.pick');
      if (!card || done) { return; }
      done = true;
      var idx = $$('.pick', wrap).indexOf(card);
      card.classList.add('is-flipped');
      $('.pick__txt', card).textContent = prizes[idx];
      $$('.pick', wrap).forEach(function (c) { if (c !== card) { c.classList.add('is-dim'); } });
      var out = $('#picker-result');
      if (out) {
        out.hidden = false;
        $('#picker-prize').textContent = prizes[idx];
      }
    });
  })();

  /* 3f. Last-call pop-up when the countdown runs out. */
  Countdown.onExpire(function () {
    if (session.get('pop_expired')) { return; }
    session.set('pop_expired', 1);
    /* Delayed so a returning visitor whose window already closed is not met
       with a modal before the page has finished painting. */
    window.setTimeout(function () { Pop.open('pop-expired'); }, 4000);
  });

  /* 3g. Tab title nudge while the visitor is reading something else. */
  (function titleNudge() {
    var original = document.title;
    var swap = null;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        var flip = false;
        swap = window.setInterval(function () {
          document.title = flip ? original : '👀 Your reader offer is still held…';
          flip = !flip;
        }, 1400);
      } else {
        window.clearInterval(swap);
        document.title = original;
      }
    });
  })();

  /* =====================================================================
     4. Sticky furniture — progress rail, top ribbon, bottom dock
     ===================================================================== */
  (function sticky() {
    var bar = $('.progress-rail__bar');
    var ribbon = $('#ribbon');
    var dock = $('#dock');
    var ribbonClosed = false;

    var closeBtn = $('.ribbon__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        ribbonClosed = true;
        ribbon.classList.remove('is-on');
      });
    }

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY;
      if (bar) { bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%'; }
      if (ribbon && !ribbonClosed) { ribbon.classList.toggle('is-on', y > 700); }
      if (dock) { dock.classList.toggle('is-on', y > 400); }
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* =====================================================================
     5. Social-proof toasts + live order feed
     ===================================================================== */
  (function proof() {
    var host = $('#toasts');
    if (!host) { return; }

    var orders = [
      { name: 'Fiona R.', town: 'Boise, ID', img: '/lp/wellaray_v3/assets/avatar-1.jpg' },
      { name: 'Helen T.', town: 'Kansas City, MO', img: '/lp/wellaray_v3/assets/avatar-2.jpg' },
      { name: 'Janet A.', town: 'Albuquerque, NM', img: '/lp/wellaray_v3/assets/avatar-3.jpg' },
      { name: 'Dawn P.', town: 'Louisville, KY', img: '/lp/wellaray_v3/assets/avatar-4.jpg' },
      { name: 'Marie L.', town: 'Tucson, AZ', img: '/lp/wellaray_v3/assets/avatar-5.jpg' },
      { name: 'Yvonne B.', town: 'Madison, WI', img: '/lp/wellaray_v3/assets/avatar-6.jpg' },
      { name: 'Claire D.', town: 'Richmond, VA', img: '/lp/wellaray_v3/assets/w22.jpg' },
      { name: 'Bev N.', town: 'Tulsa, OK', img: '/lp/wellaray_v3/assets/w24.jpg' }
    ];

    var alerts = [
      'Batch 52 stock just dropped below 300 boxes',
      '41 readers of this article ordered in the last hour',
      'Your reader allocation is still being held'
    ];

    var i = 0;

    function show(node) {
      host.appendChild(node);
      window.setTimeout(function () {
        node.classList.add('is-out');
        window.setTimeout(function () { node.remove(); }, 320);
      }, 6500);
    }

    function orderToast() {
      var o = orders[i % orders.length];
      var mins = 2 + Math.floor(Math.random() * 17);
      var node = document.createElement('a');
      node.className = 'toast';
      node.href = offerHref();
      node.innerHTML =
        '<img src="' + o.img + '" alt="" loading="lazy">' +
        '<span><b>' + o.name + ' — ' + o.town + '</b>' +
        '<span>Ordered a 3-box bundle · ' + mins + ' minutes ago</span></span>';
      show(node);
    }

    function alertToast() {
      var node = document.createElement('a');
      node.className = 'toast toast--alert';
      node.href = offerHref();
      node.innerHTML =
        '<span class="toast__ico">⚡</span>' +
        '<span><b>' + alerts[i % alerts.length] + '</b>' +
        '<span>Tap to see the reader offer</span></span>';
      show(node);
    }

    function cycle() {
      if (!document.hidden && !Pop.isOpen()) {
        if (i % 4 === 3) { alertToast(); } else { orderToast(); }
        i++;
      }
      window.setTimeout(cycle, 12000 + Math.random() * 8000);
    }

    window.setTimeout(cycle, 16000);
  })();

  /* Live order feed inside the urgency band gets a fresh row now and then. */
  (function liveFeed() {
    var list = $('#feed-list');
    if (!list) { return; }
    var pool = [
      ['Rosemary K.', 'Spokane', '3× box'],
      ['Gail M.', 'Lubbock', '2× box'],
      ['Tracey W.', 'Chattanooga', '3× box'],
      ['Pauline S.', 'Des Moines', '1× box'],
      ['Anita F.', 'Fort Wayne', '3× box']
    ];
    var n = 0;

    window.setInterval(function () {
      if (document.hidden) { return; }
      var row = pool[n % pool.length];
      n++;
      var li = document.createElement('li');
      li.className = 'flash';
      li.innerHTML = '<span><b>' + row[0] + '</b> — ' + row[1] + ' · ' + row[2] + '</span><span>just now</span>';
      list.insertBefore(li, list.firstChild);
      while (list.children.length > 5) { list.removeChild(list.lastChild); }
    }, 21000);
  })();

  /* Stock counters creep down while the page is open. */
  (function stock() {
    var nodes = $$('[data-stock]');
    if (!nodes.length) { return; }
    var left = 318;
    window.setInterval(function () {
      if (document.hidden || left <= 96) { return; }
      if (Math.random() > 0.55) { return; }
      left -= 1 + Math.floor(Math.random() * 2);
      nodes.forEach(function (el) { el.textContent = left; });
    }, 9000);
  })();

  /* =====================================================================
     6. Qualification quiz
     ===================================================================== */
  (function quiz() {
    var root = $('#quiz');
    if (!root) { return; }

    var steps = $$('.quiz__step', root);
    var dots = $$('.quiz__dots span', root);
    var head = $('.quiz__head', root);
    var dotRow = $('.quiz__dots', root);
    var step = 1;

    function goTo(n) {
      steps.forEach(function (s) { s.classList.toggle('is-on', Number(s.dataset.step) === n); });
      dots.forEach(function (d, idx) {
        d.classList.toggle('is-done', idx + 1 < n);
        d.classList.toggle('is-on', idx + 1 === n);
      });
      step = n;

      if (n === 4) { runLoader(); }
      if (n === 5) {
        if (head) { head.hidden = true; }
        if (dotRow) { dotRow.hidden = true; }
      }
    }

    function runLoader() {
      if (dotRow) { dotRow.hidden = true; }
      var fill = $('#quiz-loadfill');
      var pct = 0;
      var iv = window.setInterval(function () {
        pct = Math.min(100, pct + 7 + Math.random() * 11);
        if (fill) { fill.style.width = pct + '%'; }
        if (pct >= 100) {
          window.clearInterval(iv);
          window.setTimeout(function () { goTo(5); }, 380);
        }
      }, 170);
    }

    root.addEventListener('change', function (e) {
      if (!e.target.matches('.quiz__opt input')) { return; }
      window.setTimeout(function () { goTo(step + 1); }, 260);
    });

    goTo(1);
  })();

  /* =====================================================================
     7. FAQ accordion
     ===================================================================== */
  $$('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = item.classList.contains('is-open');
      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* =====================================================================
     8. Discussion thread
     ===================================================================== */
  (function comments() {
    var list = $('#comments-list');
    if (!list) { return; }

    /* Likes */
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.cmt__act[data-like]');
      if (!btn) { return; }
      var liked = btn.classList.toggle('is-liked');
      var counter = btn.closest('.cmt__meta').querySelector('[data-likecount]');
      if (counter) {
        var n = parseInt(counter.textContent, 10) || 0;
        counter.textContent = liked ? n + 1 : n - 1;
      }
      btn.textContent = liked ? 'Liked' : 'Like';
    });

    /* Reveal the rest of the thread */
    var more = $('#comments-more');
    if (more) {
      more.addEventListener('click', function () {
        $$('.cmt[hidden]', list).forEach(function (c) { c.hidden = false; });
        more.remove();
      });
    }

    /* Posting a comment */
    var form = $('#cmtform');
    if (!form) { return; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#cmt-name').value.trim();
      var text = $('#cmt-text').value.trim();
      if (name.length < 2 || text.length < 2) { return; }

      var node = document.createElement('article');
      node.className = 'cmt';
      node.innerHTML =
        '<div class="cmt__av">' + name.charAt(0).toUpperCase() + '</div>' +
        '<div class="cmt__body"><div class="cmt__bubble">' +
        '<span class="cmt__name"></span>' +
        '<p></p></div>' +
        '<div class="cmt__meta"><span>Just now</span>' +
        '<button class="cmt__act" data-like type="button">Like</button>' +
        '<span><span data-likecount>0</span> reactions</span></div></div>';
      node.querySelector('.cmt__name').textContent = name;
      node.querySelector('.cmt__bubble p').textContent = text;
      list.insertBefore(node, list.firstChild);

      var count = $('#comments-count');
      if (count) {
        var n = parseInt(count.textContent, 10) || 0;
        count.textContent = (n + 1) + ' comments';
      }

      form.reset();
      Pop.close();
    });
  })();

  /* =====================================================================
     9. Image lightbox
     ===================================================================== */
  (function lightbox() {
    var box = $('#lightbox');
    if (!box) { return; }
    var img = $('#lightbox-img');

    document.addEventListener('click', function (e) {
      var target = e.target.closest('.zoomable, .cmt__photo');
      if (target) {
        img.src = target.currentSrc || target.src;
        img.alt = target.alt || '';
        box.classList.add('is-on');
        document.body.classList.add('is-locked');
        return;
      }
      if (e.target.closest('.lightbox__x') || e.target === box) {
        box.classList.remove('is-on');
        document.body.classList.remove('is-locked');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-on')) {
        box.classList.remove('is-on');
        document.body.classList.remove('is-locked');
      }
    });
  })();

  /* =====================================================================
     10. Small page furniture
     ===================================================================== */
  (function dates() {
    var now = new Date();
    var published = new Date(now.getTime() - 3 * 86400000);

    $$('[data-date="today"]').forEach(function (el) {
      el.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    });

    $$('[data-date="published"]').forEach(function (el) {
      el.textContent = published.toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      el.setAttribute('datetime', published.toISOString().slice(0, 10));
    });

    $$('[data-date="year"]').forEach(function (el) { el.textContent = now.getFullYear(); });
    $$('[data-date="lastyear"]').forEach(function (el) { el.textContent = now.getFullYear() - 1; });
  })();

  /* A gently drifting "readers on this page" figure in the utility strip. */
  (function readers() {
    var el = $('#live-readers');
    if (!el) { return; }
    var n = 1180 + Math.floor(Math.random() * 420);
    el.textContent = n.toLocaleString('en-US');
    window.setInterval(function () {
      n += Math.floor(Math.random() * 17) - 7;
      if (n < 900) { n = 900 + Math.floor(Math.random() * 60); }
      el.textContent = n.toLocaleString('en-US');
    }, 5000);
  })();

  /* Search box is decorative on an advertorial — send it to the offer. */
  var searchForm = $('#search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = offerHref();
    });
  }
})();
