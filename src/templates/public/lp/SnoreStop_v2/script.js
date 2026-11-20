(function () {
  'use strict';

  var doc = document.documentElement;
  var bar = document.querySelector('#progress span');
  var sticky = document.getElementById('sticky');
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* post date: always "a few days ago" */
  var dateEl = document.getElementById('postdate');
  if (dateEl) {
    var d = new Date();
    d.setDate(d.getDate() - 3);
    dateEl.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dateEl.setAttribute('datetime', d.toISOString().slice(0, 10));
  }

  function showAll() {
    blocks.forEach(function (el) { el.classList.add('in'); });
    blocks.length = 0;
  }

  if (reduce) { showAll(); }

  function update() {
    var h = doc.scrollHeight - window.innerHeight;

    /* reading progress */
    if (bar) {
      var p = h > 0 ? (window.scrollY / h) * 100 : 100;
      bar.style.width = Math.min(100, Math.max(0, p)) + '%';
    }

    /* sticky CTA after the hero, hidden again near the footer */
    if (sticky) {
      var on = window.scrollY > 700 && window.scrollY < h - 500;
      sticky.classList.toggle('on', on);
      sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
      sticky.querySelector('a').tabIndex = on ? 0 : -1;
    }

    /* reveal anything that has reached the viewport */
    if (!blocks.length) return;
    var limit = window.innerHeight * 0.92;
    for (var i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i].getBoundingClientRect().top < limit) {
        blocks[i].classList.add('in');
        blocks.splice(i, 1);
      }
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('pageshow', update);
  document.addEventListener('visibilitychange', update);
  update();

  /* failsafe: never leave copy invisible */
  window.setTimeout(function () {
    if (blocks.length && !document.querySelector('.reveal.in')) showAll();
  }, 2500);
})();
