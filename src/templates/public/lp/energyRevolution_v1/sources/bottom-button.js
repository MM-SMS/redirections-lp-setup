(function ($) {

    // =========================
    // CONFIG (optional consistency)
    // =========================
    const VIDEO_PLAYER_SELECTOR = 'vturb-smartplayer';
    const ACTION_DIV_SELECTOR = '#action_div';

    // =========================
    // CTA TOGGLE LOGIC
    // =========================

    // Show/hide CTA buttons depending on #action_div visibility
    function toggleCTAs() {
        var $actionDiv = $(ACTION_DIV_SELECTOR);

        // MUST: guard in case #action_div does not exist
        if (!$actionDiv.length) {
            $('#videoCTAWrapper').show();
            $('#productCTAWrapper').hide();
            return;
        }

        if ($actionDiv.is(':visible')) {
            // Action div visible → hide original CTA, show product CTA
            $('#videoCTAWrapper').hide();
            $('#productCTAWrapper').show();
        } else {
            // Action div hidden → show original CTA, hide product CTA
            $('#videoCTAWrapper').show();
            $('#productCTAWrapper').hide();
        }
    }

    // Initial toggle on page load
    toggleCTAs();

    // =========================
    // MUTATION OBSERVER
    // =========================

    var actionDivEl = document.querySelector(ACTION_DIV_SELECTOR);

    // MUST: guard against missing element
    if (actionDivEl && window.MutationObserver) {
        var observer = new MutationObserver(toggleCTAs);

        observer.observe(actionDivEl, {
            attributes: true,
            // Advice: include class (many visibility changes happen via class)
            attributeFilter: ['style', 'class']
        });
    }

    // =========================
    // VIDEO CTA - SCROLL TO TOP
    // =========================

    $('#videoCTAWrapper .gotovideo').on('click', function (e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: 0
        }, 300);

        const videoPlayer = document.querySelector(VIDEO_PLAYER_SELECTOR);

        if (videoPlayer && videoPlayer.alreadyPlayed && !videoPlayer.ended) {
            videoPlayer.play();
        }
    });

    // =========================
    // PRODUCT CTA - SCROLL TO ACTION DIV
    // =========================

    $('#productCTAWrapper .gotovideo').on('click', function (e) {
        e.preventDefault();

        var $actionDiv = $(ACTION_DIV_SELECTOR);

        // MUST: guard offset() if element missing
        if (!$actionDiv.length) return;

        $('html, body').animate({
            scrollTop: $actionDiv.offset().top
        }, 600);
    });

})(jQuery);