(function ($) {
  if (!$) {
    console.warn("Popup script: jQuery not found.");
    return;
  }

  /* ===== CONFIG ===== */

  var productName = "Water Freedom System";

  // Popup visible time
  var visibleTime = 6000; // 6 seconds

  // Delay between popups (random)
  var minDelay = 40000;   // 40 seconds
  var maxDelay = 80000;   // 80 seconds

  // Start delay after trigger becomes visible
  var startDelay = 195000; // 3 minutes 15 seconds

  /* ===== DATA ===== */

  var customers = [
    ["Deborah", "Houston", "TX"],
    ["Ronald", "Charlotte", "NC"],
    ["Bonnie", "Dallas", "TX"],
    ["Jeffrey", "Chicago", "IL"],
    ["Penelope", "Detroit", "MI"],
    ["Mark", "Atlanta", "GA"],
    ["Michelle", "New York", "NY"],
    ["Terry", "Los Angeles", "CA"],
    ["James", "Orlando", "FL"],
    ["Patricia", "Phoenix", "AZ"],
    ["John", "San Antonio", "TX"],
    ["Linda", "Columbus", "OH"],
    ["Robert", "San Diego", "CA"],
    ["Katherine", "Las Vegas", "NV"],
    ["Michael", "Denver", "CO"],
    ["Elizabeth", "Nashville", "TN"],
    ["William", "Portland", "OR"],
    ["Barbara", "Minneapolis", "MN"],
    ["David", "Tampa", "FL"],
    ["Susan", "Seattle", "WA"],
    ["Richard", "Boston", "MA"],
    ["Janice", "Baltimore", "MD"],
    ["Charles", "Washington", "DC"],
    ["Karen", "Kansas City", "MO"],
    ["Joseph", "Louisville", "KY"],
    ["Nancy", "Birmingham", "AL"],
    ["Sandra", "Indianapolis", "IN"],
    ["Dennis", "Milwaukee", "WI"],
    ["Daniel", "Raleigh", "NC"],
    ["Cynthia", "Miami", "FL"],
    ["Matthew", "Sacramento", "CA"],
    ["Angela", "Austin", "TX"],
    ["Anthony", "Jacksonville", "FL"],
    ["Brenda", "Memphis", "TN"],
    ["Kevin", "Richmond", "VA"],
    ["Pamela", "New Orleans", "LA"],
    ["Jason", "Cleveland", "OH"],
    ["Diane", "Pittsburgh", "PA"],
    ["Raymond", "Cincinnati", "OH"],
    ["Margaret", "St. Louis", "MO"],
    ["Gerald", "San Jose", "CA"],
    ["Shirley", "Fort Worth", "TX"],
    ["Gary", "Madison", "WI"],
    ["Rebecca", "Tucson", "AZ"],
    ["Kenneth", "Hartford", "CT"],
    ["Theresa", "Buffalo", "NY"],
    ["George", "Anchorage", "AK"],
    ["Carol", "Boise", "ID"]
  ];

  var popupStarted = false;
  var currentIndex = -1;

  // Timeout handles so we can prevent duplicates
  var startTimeoutId = null;
  var hideTimeoutId = null;
  var nextTimeoutId = null;

  /* ===== HELPERS ===== */

  function randomMinutesAgo() {
    return Math.floor(Math.random() * 5) + 1;
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
  }

  function showPopup() {
    var $div = $("#nameDiv");
    if (!$div.length) return;

    $div.show();

    if (window.innerWidth <= 768) {
      $div.css({ opacity: "1", transform: "translateY(0)" });
    } else {
      $div.css({ opacity: "1", transform: "translateX(0)" });
    }
  }

  function hidePopup() {
    var $div = $("#nameDiv");
    if (!$div.length) return;

    if (window.innerWidth <= 768) {
      $div.css({ opacity: "0", transform: "translateY(120%)" });
    } else {
      $div.css({ opacity: "0", transform: "translateX(-200%)" });
    }
  }

  function clearTimers() {
    if (startTimeoutId) { clearTimeout(startTimeoutId); startTimeoutId = null; }
    if (hideTimeoutId) { clearTimeout(hideTimeoutId); hideTimeoutId = null; }
    if (nextTimeoutId) { clearTimeout(nextTimeoutId); nextTimeoutId = null; }
  }

  function scheduleNextPopup() {
    var delay = getRandomDelay();
    if (nextTimeoutId) clearTimeout(nextTimeoutId);
    nextTimeoutId = setTimeout(showNextCustomer, delay);
  }

  function showNextCustomer() {
    // Randomize instead of sequential
    currentIndex = Math.floor(Math.random() * customers.length);
    var c = customers[currentIndex];

    $("#nameSpan").text(c[0] || "");
    $("#citySpan").text(c[1] || "");
    $("#stateSpan").text(c[2] || "");
    $("#productSpan").text(productName);
    $("#minSpan").text(randomMinutesAgo());

    showPopup();

    // Ensure we don't stack multiple hide timers
    if (hideTimeoutId) clearTimeout(hideTimeoutId);

    hideTimeoutId = setTimeout(function () {
      hidePopup();
      scheduleNextPopup();
    }, visibleTime);
  }

  /* ===== TRIGGER START LOGIC ===== */

  function isElementVisible($el) {
    if (!$el || $el.length === 0) return false;
    if (!$el.is(":visible")) return false;

    var op = parseFloat($el.css("opacity"));
    if (!isNaN(op) && op <= 0) return false;

    if ($el.css("display") === "none") return false;
    if ($el.css("visibility") === "hidden") return false;

    return true;
  }

  function startOnce() {
    if (popupStarted) return;
    popupStarted = true;

    clearTimers();

    startTimeoutId = setTimeout(function () {
      showNextCustomer();
    }, startDelay);
  }

  function observeVisibilityWhenExists(selector) {
    function attachObserver(el) {
      var $el = $(el);

      var observer = new MutationObserver(function () {
        if (popupStarted) {
          observer.disconnect();
          return;
        }
        if (isElementVisible($el)) {
          observer.disconnect();
          startOnce();
        }
      });

      observer.observe(el, { attributes: true, attributeFilter: ["class", "style"] });

      // Immediate check
      if (isElementVisible($el)) {
        observer.disconnect();
        startOnce();
      }

      // Fallback check (covers parent-driven visibility changes)
      var fallbackId = setInterval(function () {
        if (popupStarted) {
          clearInterval(fallbackId);
          return;
        }
        if (isElementVisible($el)) {
          clearInterval(fallbackId);
          observer.disconnect();
          startOnce();
        }
      }, 500);
    }

    var existing = document.querySelector(selector);
    if (existing) {
      attachObserver(existing);
      return;
    }

    var domObserver = new MutationObserver(function () {
      if (popupStarted) {
        domObserver.disconnect();
        return;
      }
      var el = document.querySelector(selector);
      if (el) {
        domObserver.disconnect();
        attachObserver(el);
      }
    });

    domObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  observeVisibilityWhenExists(".hide-pbs");
  observeVisibilityWhenExists(".hide-digital");

  /* ===== Tap to dismiss (hide now, reappear on normal delay) ===== */
  $(document).on("click", "#nameDiv", function () {
    hidePopup();

    // Stop the current hide timer if it's still pending
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }

    // Restart the cycle with a normal random delay
    scheduleNextPopup();
  });

})(window.jQuery);