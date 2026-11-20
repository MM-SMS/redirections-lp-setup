(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Dates: today in the top bar, article published 2 days ago ---- */
  var now = new Date();
  var fmt = function (d, opts) { return d.toLocaleDateString('en-US', opts); };
  var today = $('[data-today]');
  if (today) today.textContent = fmt(now, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  var pub = $('[data-pubdate]');
  if (pub) pub.textContent = fmt(new Date(now.getTime() - 2 * 864e5), { month: 'long', day: 'numeric', year: 'numeric' });
  var yr = $('[data-year]');
  if (yr) yr.textContent = now.getFullYear();

  /* ---- "Reading now" counter drifts a little ---- */
  var readers = $('[data-readers]');
  if (readers) {
    var n = 3184;
    setInterval(function () {
      n += Math.round(Math.random() * 14 - 5);
      readers.textContent = n.toLocaleString('en-US');
    }, 4000);
  }

  /* ---- Reader poll ---- */
  var poll = $('[data-poll]');
  if (poll) {
    poll.addEventListener('click', function (e) {
      var picked = e.target.closest('button');
      if (!picked || poll.classList.contains('voted')) return;
      poll.classList.add('voted');
      $$('button', poll).forEach(function (b) {
        var p = +b.getAttribute('data-p');
        $('.bar', b).style.width = p + '%';
        $('em', b).textContent = p + '%';
        b.style.fontWeight = b === picked ? '800' : '600';
      });
    });
  }

  /* ---- Mobile sticky bar: show after the hero, hide while the game is on screen ---- */
  var mbar = $('[data-mbar]');
  var game = $('#game');
  var heroSeen = false, gameVisible = false;
  function syncBar() { if (mbar) mbar.classList.toggle('show', heroSeen && !gameVisible); }
  if ('IntersectionObserver' in window && mbar) {
    new IntersectionObserver(function (en) { heroSeen = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; syncBar(); })
      .observe($('.hero'));
    new IntersectionObserver(function (en) { gameVisible = en[0].isIntersecting; syncBar(); }, { threshold: 0.15 })
      .observe(game);
  }

  /* ---- Mini-game: tap the cup 4 times, then the discount and CTA appear ---- */
  if (!game) return;
  var cup = $('.cupbtn', game);
  var liquid = $('.liquid', game);
  var meter = $('[data-meter]', game);
  var stirsEl = $('[data-stirs]', game);
  var benefit = $('[data-benefit]', game);
  var howto = $('[data-howto]', game);
  var tapme = $('[data-tapme]', game);
  var benefits = [
    '<b>Green Coffee Bean Extract</b> added: supports fat metabolism from the first sip*',
    '<b>Green Tea Extract</b> added: steady, jitter-free energy past 3 p.m.*',
    '<b>White Mulberry Leaf</b> added: helps calm the sugar swings behind cravings*',
    '<b>Botanical Blend</b> added: helps you feel full and focused all morning*'
  ];
  var names = ['Green Coffee', 'Green Tea', 'Mulberry Leaf', 'Botanicals'];
  var shades = ['#6b4226', '#7a5230', '#8a6038', '#a0703f', '#b98450'];
  var stirs = 0;

  cup.addEventListener('click', function () {
    if (stirs >= 4) return;
    cup.classList.remove('stir'); void cup.offsetWidth; cup.classList.add('stir');
    var tag = document.createElement('span');
    tag.className = 'drop';
    tag.textContent = '+ ' + names[stirs];
    cup.appendChild(tag);
    setTimeout(function () { tag.remove(); }, 950);

    $('[data-slot="' + stirs + '"]', game).classList.add('on');
    benefit.innerHTML = '✓ ' + benefits[stirs];
    stirs++;
    liquid.setAttribute('fill', shades[stirs]);
    meter.style.width = stirs * 25 + '%';
    stirsEl.textContent = stirs;

    if (stirs < 4) {
      tapme.textContent = '👆 ' + (4 - stirs) + ' more tap' + (stirs === 3 ? '' : 's');
      return;
    }
    tapme.textContent = '✓ Ready!';
    cup.classList.add('done');
    cup.disabled = true;
    howto.innerHTML = '<b>Your cup is ready!</b> Unlocking your discount…';
    setTimeout(showReveal, 900);
  });

  function showReveal() {
    $('[data-stage="brew"]', game).hidden = true;
    $('[data-stage="reveal"]', game).hidden = false;
    var top = game.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: top, behavior: 'smooth' });
    countUp($('[data-count]', game), 70, 1100);
    startTimer($('[data-timer]', game), 9 * 60 + 59);
    unlockLinks();
  }

  function countUp(el, to, ms) {
    var t0 = null;
    function f(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / ms);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }

  function startTimer(el, s) {
    var iv = setInterval(function () {
      s = Math.max(0, s - 1);
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      if (!s) clearInterval(iv);
    }, 1000);
  }

  // After the game, the sidebar card and mobile bar point straight to the offer
  function unlockLinks() {
    var offer = $('[data-final]', game).getAttribute('href');
    var side = $('[data-side-link]');
    if (side) { side.href = offer; side.textContent = 'Claim my 70% discount ›'; side.style.background = 'var(--green)'; }
    var ml = $('[data-mbar-link]');
    if (ml) { ml.href = offer; ml.textContent = 'Claim 70% off ›'; mbar.classList.add('unlocked'); }
  }
})();
