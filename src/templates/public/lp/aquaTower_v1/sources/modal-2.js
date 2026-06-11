// =========================
// CONFIGURATION
// =========================

const COOLDOWN = 15000; // 15 seconds
const COUNTDOWN_START = 180; // 3 minutes
const PLAYER_SELECTOR = "vturb-smartplayer";
const EXIT_TRAP_STATE_KEY = "__exit_trap__";

// =========================
// GLOBAL VARIABLES
// =========================

let modalOpen = false;
let videoPlayer = null;
let lastShownAt = 0;

let countdownInterval = null;
let countdownRemaining = COUNTDOWN_START;

let addressBarTimer = null;
let showModalOnReturn = false;

// =========================
// HELPERS
// =========================

function canShowModal() {
  return Date.now() - lastShownAt > COOLDOWN;
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
}

function safeAddClass(el, className) {
  if (el && el.classList) el.classList.add(className);
}

function safeRemoveClass(el, className) {
  if (el && el.classList) el.classList.remove(className);
}

function safeSetDisplay(el, value) {
  if (el && el.style) el.style.display = value;
}

function getEl(id) {
  return document.getElementById(id);
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function scrollToSelector(sel, duration = 600) {
  const el = qs(sel);
  if (!el) return;

  // jQuery path
  if (window.jQuery && typeof window.jQuery === "function") {
    const $ = window.jQuery;
    const $el = $(sel);
    if ($el.length && $el.offset()) {
      $("html, body").animate({ scrollTop: $el.offset().top }, duration);
      return;
    }
  }

  // Native fallback
  try {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (_) {
    window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset);
  }
}

function scrollToTop(duration = 300) {
  if (window.jQuery && typeof window.jQuery === "function") {
    const $ = window.jQuery;
    $("html, body").animate({ scrollTop: 0 }, duration);
    return;
  }

  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (_) {
    window.scrollTo(0, 0);
  }
}

// =========================
// MOBILE UI HELPERS
// =========================

function hideHeadlineAndMoveVideoUp() {
  if (!isMobileDevice()) return;

  const headline = qs(".headlinetsl");
  safeSetDisplay(headline, "none");

  const fsm = getEl("fullscreen");
  safeAddClass(fsm, "fsm");

  if (videoPlayer) {
    safeAddClass(videoPlayer, "wrap");
    safeRemoveClass(videoPlayer, "wrap2");
  }

  const page = getEl("page");
  safeAddClass(page, "page1");

  const bgColor = getEl("bg-color");
  safeAddClass(bgColor, "bg-color-mobile");
}

function showHeadlineAndResetVideo() {
  if (!isMobileDevice()) return;

  const headline = qs(".headlinetsl");
  safeSetDisplay(headline, "block");

  const fsm = getEl("fullscreen");
  safeRemoveClass(fsm, "fsm");

  if (videoPlayer) {
    safeRemoveClass(videoPlayer, "wrap");
    safeAddClass(videoPlayer, "wrap2");
  }

  const page = getEl("page");
  safeRemoveClass(page, "page1");

  const bgColor = getEl("bg-color");
  safeRemoveClass(bgColor, "bg-color-mobile");
}

// =========================
// COUNTDOWN TIMER
// =========================

function updateTimerDisplay(timeRemaining, display) {
  if (!display) return;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  display.textContent =
    (minutes < 10 ? "0" : "") + minutes + ":" +
    (seconds < 10 ? "0" : "") + seconds;
}

function startCountdown() {
  const timerDisplay = getEl("timerDisplay");
  if (!timerDisplay) return;

  updateTimerDisplay(countdownRemaining, timerDisplay);

  if (countdownInterval) return; // already running

  countdownInterval = setInterval(() => {
    countdownRemaining--;

    updateTimerDisplay(countdownRemaining, timerDisplay);

    if (countdownRemaining <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      countdownRemaining = 0;
      timerDisplay.textContent = "00:00";
    }
  }, 1000);
}

function stopAndResetCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdownRemaining = COUNTDOWN_START;

  const timerDisplay = getEl("timerDisplay");
  updateTimerDisplay(countdownRemaining, timerDisplay);
}

// =========================
// MODAL OPEN/CLOSE
// =========================

function showExitModal() {
  if (modalOpen) return;
  if (!canShowModal()) return;

  const modal = getEl("exitModal");
  if (!modal) return;

  modalOpen = true;
  lastShownAt = Date.now();

  safeAddClass(modal, "active");
  safeAddClass(document.body, "modal-open");

  // Pause video when modal appears (vturb properties confirmed)
  if (videoPlayer && !videoPlayer.paused) {
    videoPlayer.pause();
  }

  startCountdown();
}

function closeExitModal() {
  const modal = getEl("exitModal");
  if (!modal) {
    modalOpen = false;
    stopAndResetCountdown();
    return;
  }

  safeRemoveClass(modal, "active");
  safeRemoveClass(document.body, "modal-open");
  modalOpen = false;

  stopAndResetCountdown();

  // Resume / scroll behavior (vturb props confirmed)
  if (videoPlayer && videoPlayer.alreadyPlayed && (videoPlayer.currentTime < videoPlayer.duration)) {
    scrollToTop(300);
    videoPlayer.play();
  } else if (videoPlayer && (videoPlayer.currentTime === videoPlayer.duration)) {
    scrollToSelector("#scroll-cta", 600);
  } else if (videoPlayer && videoPlayer.inResume) {
    scrollToTop(300);
  } else if (videoPlayer && !videoPlayer.alreadyPlayed) {
    scrollToTop(600);
  }
}

function closeModalAndContinue() {
  closeExitModal();
}

// =========================
// VIDEO LISTENERS
// =========================

function attachVideoListeners() {
  if (!videoPlayer) return;

  const container = videoPlayer.parentElement;
  if (!container) return;

  try {
    const pos = getComputedStyle(container).position;
    if (pos === "static") container.style.position = "relative";
  } catch (_) {}

  videoPlayer.addEventListener("video:play", () => {
    hideHeadlineAndMoveVideoUp();
  });

  videoPlayer.addEventListener("video:pause", () => {
    showHeadlineAndResetVideo();
  });

  videoPlayer.addEventListener("video:ended", () => {
    showHeadlineAndResetVideo();

    if (container.querySelector(".vturb-blocker")) return;

    const blocker = document.createElement("div");
    blocker.className = "vturb-blocker";

    blocker.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    blocker.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    container.appendChild(blocker);

    scrollToSelector("#scroll-cta", 600);
  });
}

// =========================
// EXIT TRIGGERS
// =========================

function ensureExitTrapState() {
  try {
    const state = history.state || {};
    if (!state || !state[EXIT_TRAP_STATE_KEY]) {
      history.pushState({ ...(state || {}), [EXIT_TRAP_STATE_KEY]: true }, "", location.href);
    }
  } catch (_) {}
}

function initExitTriggers() {
  // 1) Desktop mouse exit intent
  document.addEventListener("mouseleave", function (e) {
    if (e.clientY <= 0 && !modalOpen) {
      showExitModal();
    }
  });

  // 2) Back button detection
  ensureExitTrapState();

  window.addEventListener("popstate", function () {
    if (modalOpen) return;

    if (!canShowModal()) {
      ensureExitTrapState();
      return;
    }

    showExitModal();
    ensureExitTrapState();
  });

  // Keep ESC close (not focus-related, but handy)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOpen) {
      closeExitModal();
    }
  });
}

// =========================
// WAIT/RETRY FOR PLAYER
// =========================

function waitForVideoPlayer({ timeoutMs = 15000, intervalMs = 200 } = {}) {
  return new Promise((resolve) => {
    const start = Date.now();

    const tick = () => {
      const found = document.querySelector(PLAYER_SELECTOR);
      if (found) return resolve(found);

      if (Date.now() - start >= timeoutMs) return resolve(null);

      setTimeout(tick, intervalMs);
    };

    tick();
  });
}

// =========================
// INITIALIZATION
// =========================

document.addEventListener("DOMContentLoaded", async function () {
  initExitTriggers();

  videoPlayer = await waitForVideoPlayer({ timeoutMs: 15000, intervalMs: 200 });

  if (!videoPlayer) {
    console.warn("vturb player not found after waiting:", PLAYER_SELECTOR);
    return;
  }

  attachVideoListeners();
});