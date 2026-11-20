(function () {
  'use strict';

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  /* ---------- Theme toggle ---------- */
  var html = document.documentElement;
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      store.set('h24-theme', next);
    });
  });

  /* ---------- Dates (relative to today) ---------- */
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var now = new Date();

  function shiftDays(n) { var d = new Date(now); d.setDate(d.getDate() + n); return d; }
  function fmt(d) { return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }

  $$('[data-today]').forEach(function (el) { el.textContent = DAYS[now.getDay()] + ', ' + fmt(now); });
  $$('[data-year]').forEach(function (el) { el.textContent = now.getFullYear(); });
  $$('time[data-days]').forEach(function (el) {
    var d = shiftDays(parseInt(el.getAttribute('data-days'), 10) || 0);
    var t = el.getAttribute('data-time') || '';
    el.setAttribute('datetime', d.toISOString().slice(0, 10));
    el.textContent = el.hasAttribute('data-rel') ? t : fmt(d) + (t ? ', ' + t : '');
  });

  /* ---------- Countdown (shared by every [data-timer]) ---------- */
  var DURATION = 15 * 60;         // first visit
  var EXTENSION = 5 * 60;         // after it runs out
  var KEY = 'h24-offer-end';
  var end = parseInt(store.get(KEY), 10);
  if (!end || isNaN(end) || end < Date.now() - 6 * 3600 * 1000) {
    end = Date.now() + DURATION * 1000;
    store.set(KEY, String(end));
  }
  var timers = $$('[data-timer]');
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var left = Math.round((end - Date.now()) / 1000);
    if (left <= 0) {
      end = Date.now() + EXTENSION * 1000;
      store.set(KEY, String(end));
      left = EXTENSION;
    }
    var txt = pad(Math.floor(left / 60)) + ':' + pad(left % 60);
    timers.forEach(function (el) { el.textContent = txt; });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Stock counter on the result screen ---------- */
  var stockEl = $('[data-stock]');
  var stock = 17;
  setInterval(function () {
    if (stock > 4 && Math.random() < 0.35) {
      stock -= 1;
      if (stockEl) stockEl.textContent = stock;
    }
  }, 9000);

  /* ---------- Quiz ---------- */
  var quiz = $('[data-quiz]');
  if (quiz) {
    var steps = $$('[data-step]', quiz);
    var questions = steps.filter(function (s) { return /^\d+$/.test(s.getAttribute('data-step')); });
    var bar = $('[data-progress]');
    var backBtn = $('[data-quiz-back]');
    var answers = {};
    var current = 0;

    function show(stepEl) {
      steps.forEach(function (s) { s.classList.toggle('is-active', s === stepEl); });
    }
    function setProgress(i) {
      if (bar) bar.style.width = Math.round((i / questions.length) * 100) + '%';
    }
    function goTo(i) {
      current = i;
      show(questions[i]);
      setProgress(i);
      backBtn.hidden = i === 0;
    }

    function resultText() {
      var who = answers[1] === 'man' ? 'men' : 'women';
      var concern = {
        shedding: 'thinning and heavy shedding',
        bald: 'bald spots and a receding hairline',
        brittle: 'dry, brittle and dull hair',
        slow: 'slow hair growth'
      }[answers[3]] || 'hair loss';
      var course = { 1: '1-month', 2: '2-month', 3: '3-month', 4: '3-month' }[answers[4]] || '2-month';
      var tried = answers[5] === 'nothing'
        ? 'Starting early gives the best results.'
        : 'Unlike what you tried before, HaloGrow works directly on the follicle.';
      return 'HaloGrow shows strong results for ' + who + ' aged ' + (answers[2] || '30–44') +
        ' with ' + concern + '. Recommended: a ' + course + ' daily course. ' + tried;
    }

    function finish() {
      setProgress(questions.length);
      backBtn.hidden = true;
      var loading = $('[data-step="loading"]', quiz);
      show(loading);
      var items = $$('li', loading);
      items.forEach(function (li, i) {
        setTimeout(function () { li.classList.add('is-done'); }, 550 * (i + 1));
      });
      setTimeout(function () {
        $('[data-result-text]', quiz).textContent = resultText();
        show($('[data-step="result"]', quiz));
        $('#quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 550 * items.length + 500);
    }

    questions.forEach(function (q, i) {
      $$('.opt', q).forEach(function (opt) {
        opt.addEventListener('click', function () {
          $$('.opt', q).forEach(function (o) { o.classList.remove('is-picked'); });
          opt.classList.add('is-picked');
          answers[i + 1] = opt.getAttribute('data-value');
          setTimeout(function () {
            if (i + 1 < questions.length) goTo(i + 1); else finish();
          }, 260);
        });
      });
    });

    backBtn.addEventListener('click', function () { if (current > 0) goTo(current - 1); });
    goTo(0);
  }

  /* ---------- Sticky offer bar ---------- */
  var sticky = $('[data-stickybar]');
  var quizEl = $('#quiz');
  if (sticky && quizEl) {
    var quizVisible = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        quizVisible = entries[0].isIntersecting;
        update();
      }).observe(quizEl);
    }
    var update = function () {
      var past = window.scrollY > window.innerHeight * 0.9;
      sticky.classList.toggle('is-shown', past && !quizVisible);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Reader poll ---------- */
  var poll = $('[data-poll]');
  if (poll) {
    $$('button', poll).forEach(function (b) {
      b.innerHTML = '<span class="bar"></span><span class="lbl">' + b.textContent + '</span>';
      b.addEventListener('click', function () {
        if (poll.classList.contains('is-voted')) return;
        poll.classList.add('is-voted');
        $$('button', poll).forEach(function (x) {
          var pct = x.getAttribute('data-pct');
          x.insertAdjacentHTML('beforeend', '<span class="pct">' + pct + '%</span>');
          $('.bar', x).style.width = pct + '%';
        });
      });
    });
  }

  /* ---------- Product popup ---------- */
  var modal = $('[data-modal]');
  function openModal(e) {
    if (e) e.preventDefault();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  if (modal) {
    $$('[data-popup]').forEach(function (a) { a.addEventListener('click', openModal); });
    $$('[data-modal-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }
})();
