(function () {
  'use strict';

  var doc = document.documentElement;
  var bar = document.querySelector('#progress span');
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll() {
    blocks.forEach(function (el) { el.classList.add('in'); });
    blocks.length = 0;
  }

  if (reduce) { showAll(); }

  function update() {
    /* reading progress */
    if (bar) {
      var h = doc.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 100;
      bar.style.width = Math.min(100, Math.max(0, p)) + '%';
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

  /* update() runs straight off the scroll event rather than through
     requestAnimationFrame: rAF is throttled in background tabs, and copy must
     never be left sitting at opacity 0. It only measures the blocks it has
     not revealed yet, so the work shrinks to nothing as you read down. */
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('pageshow', update);
  document.addEventListener('visibilitychange', update);
  update();

  /* failsafe: never leave copy invisible if something goes wrong above */
  window.setTimeout(function () {
    if (blocks.length && !document.querySelector('.reveal.in')) showAll();
  }, 2500);
})();
