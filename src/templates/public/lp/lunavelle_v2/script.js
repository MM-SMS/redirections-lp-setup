/* =========================================================
   Meridian Health Review — article behaviour
   Three small things: reading progress, mobile sections menu,
   and a footer CTA that only appears once the reader has
   reached the product half of the piece.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- mobile sections menu ---------- */
  var burger   = document.getElementById('hamburger');
  var sections = document.getElementById('sections');

  if (burger && sections) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      sections.setAttribute('data-open', String(!open));
    });

    // close after tapping a section link
    sections.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        sections.setAttribute('data-open', 'false');
      }
    });
  }

  /* ---------- reading progress + sticky CTA ---------- */
  var bar     = document.querySelector('#progress span');
  var sticky  = document.getElementById('sticky');
  var article = document.getElementById('article');
  var offer   = document.getElementById('offer');
  // The CTA is allowed to appear only after this point in the page.
  var gate    = document.getElementById('wellbeing');

  var ticking = false;

  function update() {
    ticking = false;

    if (bar && article) {
      var start = article.offsetTop;
      var span  = article.offsetHeight - window.innerHeight;
      var pct   = span > 0 ? (window.scrollY - start) / span : 0;
      pct = Math.max(0, Math.min(1, pct));
      bar.style.width = (pct * 100).toFixed(2) + '%';
    }

    if (sticky && gate) {
      var passedGate = gate.getBoundingClientRect().top < window.innerHeight * 0.4;
      // hide again once the real offer block is on screen — no point doubling up
      var offerVisible = offer
        ? offer.getBoundingClientRect().top < window.innerHeight * 0.9
        : false;
      sticky.setAttribute('data-show', String(passedGate && !offerVisible));
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* ---------- share row: copy link / native share ---------- */
  document.querySelectorAll('.share a').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var label = el.getAttribute('aria-label') || '';
      var url   = window.location.href;
      var title = document.title;

      if (label.indexOf('Copy') === 0 && navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var old = el.textContent;
          el.textContent = '✓';
          setTimeout(function () { el.textContent = old; }, 1400);
        });
        return;
      }

      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
      }
    });
  });
})();
