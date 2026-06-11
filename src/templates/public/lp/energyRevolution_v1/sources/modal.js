// =========================
// CONFIGURATION
// =========================

// IMPORTANT: select vturb player (this is a CSS selector: tag, #id, .class)
const VIDEO_PLAYER = 'vturb-smartplayer'; // <-- CHANGE THIS TO YOUR VIDEO SELECTOR
const COOLDOWN = 15000; // 15 seconds

// =========================
// GLOBAL VARIABLES
// =========================

let modalOpen = false;
let videoPlayer = null;
let lastShownAt = 0;
let countdownInterval = null;
let countdownRemaining = 180; // 3 minutes

// =========================
// INITIALIZATION
// =========================

document.addEventListener('DOMContentLoaded', function () {

  videoPlayer = document.querySelector(VIDEO_PLAYER);

  if (videoPlayer) {
    attachVideoListeners();
  } else {
    console.warn('[ExitModal] Video player not found for selector:', VIDEO_PLAYER);
  }

  initExitTriggers();

  const exitModalEl = document.getElementById('exitModal');
  if (exitModalEl) {
    exitModalEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      const focusableElements = this.querySelectorAll(
        'button, a, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  }
});

// =========================
// Vturb Functions
// =========================

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
}

function hideHeadlineAndMoveVideoUp() {
  if (!isMobileDevice() || !videoPlayer) return;

  const headline = document.querySelector('.headlinetsl');
  if (headline) headline.style.display = 'none';

  const fsm = document.getElementById('fullscreen');
  if (fsm) fsm.classList.add('fsm');

  videoPlayer.classList.add('wrap');
  videoPlayer.classList.remove('wrap2');

  const page = document.getElementById('page');
  if (page) page.classList.add('page1');
}

function showHeadlineAndResetVideo() {
  if (!isMobileDevice() || !videoPlayer) return;

  const headline = document.querySelector('.headlinetsl');
  if (headline) headline.style.display = 'block';

  const fsm = document.getElementById('fullscreen');
  if (fsm) fsm.classList.remove('fsm');

  videoPlayer.classList.remove('wrap');
  videoPlayer.classList.add('wrap2');

  const page = document.getElementById('page');
  if (page) page.classList.remove('page1');
}

function attachVideoListeners() {
  if (!videoPlayer || !videoPlayer.parentElement) return;

  const container = videoPlayer.parentElement;

  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }

  videoPlayer.addEventListener('video:play', hideHeadlineAndMoveVideoUp);
  videoPlayer.addEventListener('video:pause', showHeadlineAndResetVideo);

  videoPlayer.addEventListener('video:ended', () => {
    showHeadlineAndResetVideo();

    if (container.querySelector('.vturb-blocker')) return;

    const blocker = document.createElement('div');
    blocker.className = 'vturb-blocker';

    blocker.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    blocker.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    container.appendChild(blocker);

    const actionDiv = document.getElementById('action_div');
    if (actionDiv) {
      if (window.jQuery) {
        $('html, body').animate({ scrollTop: $('#action_div').offset().top }, 600);
      } else {
        actionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

// =========================
// COOLDOWN
// =========================

function canShowModal() {
  return Date.now() - lastShownAt > COOLDOWN;
}

// =========================
// EXIT INTENT TRIGGERS
// =========================

function initExitTriggers() {

  // 1. Desktop mouse exit
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 0 && !modalOpen) {
      showExitModal();
    }
  });

  // 2. Back button detection
  history.pushState(null, null, location.href);

  window.addEventListener('popstate', function () {
    if (!modalOpen) {
      showExitModal();
      history.pushState(null, null, location.href);
    } else {
      closeExitModal();
      history.pushState(null, null, location.href);
    }
  });

  // NOTE:
  // beforeunload intentionally removed.
  // It now does absolutely nothing.
}

// =========================
// SHOW MODAL
// =========================

function showExitModal() {
  if (modalOpen) return;
  if (!canShowModal()) return;

  const modal = document.getElementById('exitModal');
  if (!modal) return;

  modalOpen = true;
  lastShownAt = Date.now();

  modal.classList.add('active');
  document.body.classList.add('modal-open');

  if (videoPlayer && !videoPlayer.paused) {
    videoPlayer.pause();
  }

  startCountdown();
}

// =========================
// CLOSE MODAL
// =========================

function closeExitModal() {

  const modal = document.getElementById('exitModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
  modalOpen = false;

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  countdownRemaining = 180;

  const timerEl = document.getElementById('timerDisplay');
  if (timerEl) updateTimerDisplay(countdownRemaining, timerEl);

  if (!videoPlayer) return;

  if (videoPlayer.alreadyPlayed && (videoPlayer.currentTime < videoPlayer.duration)) {

    if (window.jQuery) {
      $('html, body').animate({ scrollTop: 0 }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    videoPlayer.play();

  } else if (videoPlayer.currentTime === videoPlayer.duration) {

    const actionDiv = document.getElementById('action_div');
    if (actionDiv) {
      if (window.jQuery) {
        $('html, body').animate({ scrollTop: $('#action_div').offset().top }, 600);
      } else {
        actionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

  } else {

    if (window.jQuery) {
      $('html, body').animate({ scrollTop: 0 }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

function closeModalAndContinue() {
  closeExitModal();
}

// =========================
// COUNTDOWN
// =========================

function startCountdown() {

  const timerDisplay = document.getElementById('timerDisplay');
  if (!timerDisplay) return;

  updateTimerDisplay(countdownRemaining, timerDisplay);

  if (countdownInterval) return;

  countdownInterval = setInterval(() => {

    countdownRemaining--;

    updateTimerDisplay(countdownRemaining, timerDisplay);

    if (countdownRemaining <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      countdownRemaining = 0;
      timerDisplay.textContent = '00:00';
    }

  }, 1000);
}

function updateTimerDisplay(timeRemaining, display) {

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  display.textContent =
    (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds;
}

// =========================
// ESC CLOSE
// =========================

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeExitModal();
  }
});