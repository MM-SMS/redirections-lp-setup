(function ($) {
  if (!$) {
    console.warn("jQuery not available for CTA toggle script.");
    return;
  }

  function scrollToTop(duration = 300) {
    // jQuery scroll
    $("html, body").animate({ scrollTop: 0 }, duration);
  }

  function scrollToSelector(sel, duration = 600) {
    const $el = $(sel);
    if (!$el.length) return;
    const off = $el.offset();
    if (!off) return;
    $("html, body").animate({ scrollTop: off.top }, duration);
  }

  // Show/hide CTA buttons depending on .scroll-cta-class visibility
  function toggleCTAs() {
    const $trigger = $(".scroll-cta-class");

    // If trigger element missing, keep original CTA visible (safe default)
    if (!$trigger.length) {
      $("#videoCTAWrapper").show();
      $("#productCTAWrapper").hide();
      return;
    }

    if ($trigger.is(":visible")) {
      // Trigger visible → hide original CTA, show product CTA
      $("#videoCTAWrapper").hide();
      $("#productCTAWrapper").show();
    } else {
      $("#videoCTAWrapper").show();
      $("#productCTAWrapper").hide();
    }
  }

  // Initial toggle on page load
  $(toggleCTAs);

  // Observe visibility-related changes (style/class) if element exists
  function attachObserver() {
    const el = document.querySelector(".scroll-cta-class");
    if (!el) return false;

    const observer = new MutationObserver(() => toggleCTAs());
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return true;
  }

  // Try to attach observer immediately; if not present yet, retry a bit
  (function retryObserver(timeoutMs = 8000, intervalMs = 200) {
    const start = Date.now();

    const tick = () => {
      if (attachObserver()) {
        toggleCTAs();
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        // Not fatal — toggleCTAs() already safe.
        console.warn("CTA observer: .scroll-cta-class not found (timeout).");
        return;
      }
      setTimeout(tick, intervalMs);
    };

    tick();
  })();

  // Video CTA - Scroll to top and resume video if resumable
  $("#videoCTAWrapper .gotovideo").on("click", function (e) {
    e.preventDefault();

    scrollToTop(300);

    const videoPlayer = document.querySelector("vturb-smartplayer");
    if (!videoPlayer) return;

    // Consistent ended check: if duration exists and currentTime < duration
    if (videoPlayer.alreadyPlayed && (videoPlayer.currentTime < videoPlayer.duration)) {
      videoPlayer.play();
    }
  });

  // Product CTA - Scroll to specific div
  $("#productCTAWrapper .gotovideo").on("click", function (e) {
    e.preventDefault();
    scrollToSelector("#scroll-cta", 600);
  });
})(window.jQuery);