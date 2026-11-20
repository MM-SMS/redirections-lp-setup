/* =========================================================
   The Health Ledger — advertorial behaviour
   ========================================================= */
(function () {
  'use strict';

  var OFFER_URL = 'https://fewtopclicks5.com/click?o=15113&a=1712';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function store(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function clock(sec) { return pad(Math.floor(sec / 60)) + ':' + pad(sec % 60); }

  /* ------------------------------------------------------- dateline */
  (function dateline() {
    var el = $('#mastDate');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  })();

  /* ------------------------------------------------------- top countdown */
  (function topCountdown() {
    var el = $('#topTimer');
    if (!el) return;
    var LEN = 15 * 60;
    var end = parseInt(store('hl_top_end') || '0', 10);
    if (!end || end < Date.now()) {
      end = Date.now() + LEN * 1000;
      store('hl_top_end', String(end));
    }
    function tick() {
      var left = Math.round((end - Date.now()) / 1000);
      if (left <= 0) {                       // roll over to the next batch
        end = Date.now() + LEN * 1000;
        store('hl_top_end', String(end));
        left = LEN;
      }
      el.textContent = clock(left);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ------------------------------------------------------- wheel */
  var SEGMENTS = [
    { t: '10%<br>OFF' },
    { t: 'TRY<br>AGAIN' },
    { t: '5%<br>OFF' },
    { t: '50%<br>OFF', win: true },
    { t: '15%<br>OFF' },
    { t: 'FREE<br>SHIP' },
    { t: '20%<br>OFF' },
    { t: 'NO<br>PRIZE' }
  ];
  var WIN_INDEX = 3;
  var SEG = 360 / SEGMENTS.length;

  (function buildWheel() {
    var host = $('#wheelLabels');
    if (!host) return;
    SEGMENTS.forEach(function (seg, i) {
      var a = (i * SEG + SEG / 2) * Math.PI / 180;   // clockwise from 12 o'clock
      var r = 33;                                    // % of wheel radius box
      var span = document.createElement('span');
      span.innerHTML = seg.t;
      if (seg.win) span.className = 'win';
      span.style.left = (50 + r * Math.sin(a)) + '%';
      span.style.top  = (50 - r * Math.cos(a)) + '%';
      host.appendChild(span);
    });
  })();

  var offerRevealed = false;

  function revealOffer(scroll) {
    var offer = $('#offer');
    if (!offer) return;
    if (!offerRevealed) {
      offer.hidden = false;
      offerRevealed = true;
      startOfferTimer();
      startStock();
      store('hl_won', '1');
    }
    if (scroll) {
      setTimeout(function () {
        offer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }

  (function spin() {
    var wheel   = $('#wheel');
    var btn     = $('#spinBtn');
    var status  = $('#gameStatus');
    if (!wheel || !btn) return;

    if (store('hl_won') === '1') {            // already played this session
      var settle = 360 * 2 - (WIN_INDEX * SEG + SEG / 2);
      wheel.style.transition = 'none';
      wheel.style.transform = 'rotate(' + settle + 'deg)';
      btn.disabled = true;
      btn.textContent = 'DONE';
      status.textContent = 'You unlocked 50% OFF. Your discount is held for this session.';
      status.classList.add('won');
      revealOffer(false);
      return;
    }

    var spun = false;
    btn.addEventListener('click', function () {
      if (spun) return;
      spun = true;
      btn.disabled = true;
      status.textContent = 'Spinning…';

      var jitter = (Math.random() * 12) - 6;                       // stays inside the slice
      var target = 360 * 6 - (WIN_INDEX * SEG + SEG / 2) + jitter;
      wheel.style.transform = 'rotate(' + target + 'deg)';

      setTimeout(function () {
        btn.textContent = 'DONE';
        status.textContent = 'You unlocked the maximum 50% reader discount!';
        status.classList.add('won');
        revealOffer(false);
        openModal('#winModal');
      }, 5600);
    });
  })();

  /* ------------------------------------------------------- offer timer */
  function startOfferTimer() {
    var el = $('#offerTimer');
    if (!el) return;
    var LEN = 10 * 60;
    var end = parseInt(store('hl_offer_end') || '0', 10);
    if (!end || end < Date.now() - LEN * 1000) {
      end = Date.now() + LEN * 1000;
      store('hl_offer_end', String(end));
    }
    function tick() {
      var left = Math.round((end - Date.now()) / 1000);
      if (left <= 0) {
        el.textContent = '00:00';
        el.style.color = '#a8231c';
        var lbl = $('.offer-timer-label');
        if (lbl) lbl.textContent = 'Expiring — claim now';
        clearInterval(iv);
        return;
      }
      el.textContent = clock(left);
    }
    tick();
    var iv = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------- stock counter */
  function startStock() {
    var num  = $('#stockNum');
    var fill = $('#stockFill');
    if (!num) return;
    var left = parseInt(store('hl_stock') || '0', 10) || 47;
    function paint() {
      num.textContent = left;
      if (fill) fill.style.width = Math.max(4, (left / 300) * 100) + '%';
      store('hl_stock', String(left));
    }
    paint();
    (function drip() {
      setTimeout(function () {
        if (left > 11) { left -= 1; paint(); }
        drip();
      }, 18000 + Math.random() * 22000);
    })();
  }

  /* ------------------------------------------------------- modals */
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
  $$('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.hasAttribute('data-close-modal')) {
        closeModal(overlay);
        if (overlay.id === 'winModal') revealOffer(true);
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.modal-overlay.visible').forEach(closeModal);
  });

  /* ------------------------------------------------------- exit intent */
  (function exitIntent() {
    if (store('hl_exit') === '1') return;
    var armed = false;
    setTimeout(function () { armed = true; }, 18000);

    function fire() {
      if (!armed || store('hl_exit') === '1') return;
      if ($$('.modal-overlay.visible').length) return;
      store('hl_exit', '1');
      openModal('#exitModal');
    }
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 4) fire();
    });
    // touch fallback: a fast flick upward near the top of a long session
    var lastY = 0, idle = null;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < lastY - 260 && y < 400) fire();
      lastY = y;
      clearTimeout(idle);
      idle = setTimeout(function () {}, 1);
    }, { passive: true });
  })();

  /* ------------------------------------------------------- sticky buy bar */
  (function buyBar() {
    var bar = $('#buybar');
    var close = $('#buybarClose');
    if (!bar) return;
    var dismissed = store('hl_bar') === '1';
    var footer = $('.site-footer');

    close.addEventListener('click', function () {
      dismissed = true;
      store('hl_bar', '1');
      bar.classList.remove('show');
    });

    function update() {
      if (dismissed) return;
      var past = window.scrollY > 700;
      var atFooter = footer && footer.getBoundingClientRect().top < window.innerHeight - 60;
      bar.classList.toggle('show', past && !atFooter);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ------------------------------------------------------- social proof toasts */
  (function toasts() {
    var el   = $('#toast');
    var line = $('#toastLine');
    var sub  = $('#toastSub');
    if (!el) return;

    var people = [
      ['Deborah K.', 'Akron, OH', '4-bottle box'],
      ['Marcy T.', 'Fort Worth, TX', '4-bottle box'],
      ['Yolanda P.', 'Savannah, GA', '2-bottle box'],
      ['Steven R.', 'Boise, ID', '4-bottle box'],
      ['Angela M.', 'Erie, PA', '4-bottle box'],
      ['Traci L.', 'Modesto, CA', '2-bottle box'],
      ['Hank D.', 'Springfield, MO', '4-bottle box'],
      ['Rosa V.', 'Albuquerque, NM', '4-bottle box'],
      ['Kimberley S.', 'Rochester, NY', '2-bottle box'],
      ['Phil A.', 'Chattanooga, TN', '4-bottle box'],
      ['Nadia B.', 'Des Moines, IA', '4-bottle box'],
      ['Gwen H.', 'Lubbock, TX', '4-bottle box']
    ];
    var mins = ['2 minutes ago', '4 minutes ago', '7 minutes ago', '11 minutes ago',
                'just now', '14 minutes ago', '3 minutes ago', '9 minutes ago'];

    var i = Math.floor(Math.random() * people.length);
    var shown = 0;
    var stopped = false;

    $('#toastClose').addEventListener('click', function () {
      stopped = true;
      el.classList.remove('show');
    });

    function show() {
      if (stopped || shown >= 9) return;
      if ($$('.modal-overlay.visible').length) { setTimeout(show, 9000); return; }
      var p = people[i % people.length];
      i++; shown++;
      line.innerHTML = p[0] + ' in ' + p[1] + ' ordered the <b>' + p[2] + '</b>';
      sub.textContent = mins[Math.floor(Math.random() * mins.length)] + ' · verified order';
      el.classList.add('show');
      setTimeout(function () { el.classList.remove('show'); }, 6200);
      setTimeout(show, 15000 + Math.random() * 9000);
    }
    setTimeout(show, 11000);
  })();

  /* =========================================================
     Facebook-style comment behaviour
     ========================================================= */

  /* reaction fly-out: CSS :hover for mouse, plus an explicit class so the
     panel also survives touch and pointer-capture quirks */
  $$('.like-btn-wrapper, .like-action-wrapper').forEach(function (w) {
    var t = null;
    w.addEventListener('mouseenter', function () {
      clearTimeout(t);
      t = setTimeout(function () { w.classList.add('pop-open'); }, 260);
    });
    w.addEventListener('mouseleave', function () {
      clearTimeout(t);
      w.classList.remove('pop-open');
    });
  });

  var REACTION_LABEL = {
    like: 'Like', love: 'Love', care: 'Care', haha: 'Haha',
    wow: 'Wow', sad: 'Sad', angry: 'Angry'
  };
  var REACTION_CLASSES = 'reacted like love care haha wow sad angry';

  function bumpCount(wrapper, delta) {
    var pill = wrapper.querySelector('.reaction-num');
    if (!pill) return;
    var n = parseInt(pill.textContent.replace(/\D/g, ''), 10) || 0;
    pill.textContent = Math.max(0, n + delta);
  }

  /* --- article like button --- */
  (function articleLike() {
    var btn = $('#likeBtn');
    if (!btn) return;
    var label = btn.querySelector('span');
    var icon  = btn.querySelector('svg');

    function setReaction(kind) {
      btn.className = 'action-btn';
      var img = btn.querySelector('.like-btn-reaction-img');
      if (img) img.remove();
      if (icon) icon.style.display = '';
      if (!kind) { label.textContent = 'Like'; return; }
      btn.classList.add('reacted', kind);
      label.textContent = REACTION_LABEL[kind];
      if (kind !== 'like') {
        if (icon) icon.style.display = 'none';
        var m = document.createElement('img');
        m.className = 'like-btn-reaction-img';
        m.src = 'images/' + kind.charAt(0).toUpperCase() + kind.slice(1) + '.svg';
        m.alt = '';
        btn.insertBefore(m, label);
      }
    }

    var current = null;
    btn.addEventListener('click', function () {
      current = current ? null : 'like';
      setReaction(current);
    });
    $$('.article-reaction-btn').forEach(function (r) {
      r.addEventListener('click', function (e) {
        e.stopPropagation();
        current = r.dataset.reaction;
        setReaction(current);
      });
    });
  })();

  /* --- per-comment likes --- */
  $$('.comment').forEach(function (comment) {
    var actions = comment.querySelector(':scope > .comment-body > .comment-actions');
    if (!actions) return;
    var likeBtn = actions.querySelector('.like-action');
    if (!likeBtn) return;
    var state = null;

    function apply(kind) {
      if (state) bumpCount(actions, -1);
      state = kind;
      likeBtn.className = 'comment-action like-action';
      if (kind) {
        likeBtn.classList.add('reacted', kind);
        likeBtn.textContent = REACTION_LABEL[kind];
        bumpCount(actions, 1);
      } else {
        likeBtn.textContent = 'Like';
      }
    }

    likeBtn.addEventListener('click', function () { apply(state ? null : 'like'); });
    $$('.like-reaction-btn', actions).forEach(function (r) {
      r.addEventListener('click', function (e) {
        e.stopPropagation();
        apply(r.dataset.reaction);
      });
    });
  });

  /* --- reply / comment / share all funnel to the offer --- */
  function nudgeLogin() {
    var prompt = $('.comment-login-prompt');
    if (!prompt) return;
    prompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    prompt.animate(
      [{ background: '#f1f3f4' }, { background: '#ffe9d4' }, { background: '#f1f3f4' }],
      { duration: 1100, iterations: 2 }
    );
  }
  $$('.reply-action').forEach(function (b) { b.addEventListener('click', nudgeLogin); });
  ['#commentBtn', '#shareBtn'].forEach(function (sel) {
    var b = $(sel);
    if (b) b.addEventListener('click', nudgeLogin);
  });

  /* --- sort dropdown --- */
  (function sorter() {
    var sort = $('#commentsSort');
    var drop = $('#sortDropdown');
    var label = $('#sortLabel');
    var list = $('#commentsList');
    if (!sort) return;

    sort.addEventListener('click', function (e) {
      if (e.target.closest('.sort-dropdown')) return;
      drop.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!sort.contains(e.target)) drop.classList.remove('open');
    });
    $$('button', drop).forEach(function (b) {
      b.addEventListener('click', function () {
        label.textContent = b.textContent.trim();
        drop.classList.remove('open');
        if (b.dataset.sort === 'oldest') {
          $$(':scope > .comment', list).reverse().forEach(function (c) { list.appendChild(c); });
        } else if (b.dataset.sort === 'newest') {
          $$(':scope > .comment', list).sort(function (a, z) {
            return parseFloat(a.dataset.commentId) - parseFloat(z.dataset.commentId);
          }).forEach(function (c) { list.appendChild(c); });
        }
      });
    });
  })();

  /* --- view more comments --- */
  (function viewMore() {
    var btn = $('#viewMore');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var hidden = $$('.hidden-comment');
      if (hidden.length) {
        hidden.forEach(function (c) { c.classList.remove('hidden-comment'); });
        btn.textContent = 'View 301 more comments';
      } else {
        nudgeLogin();
      }
    });
  })();

  /* --- comment photos open the offer --- */
  $$('.comment-photo').forEach(function (img) {
    img.addEventListener('click', function () {
      var cta=document.getElementById('checkout_cta');window.open((cta&&cta.getAttribute('href'))||OFFER_URL,'_blank','noopener');
    });
  });

  /* ------------------------------------------------------- restore won state */
  if (store('hl_won') === '1') revealOffer(false);

})();
