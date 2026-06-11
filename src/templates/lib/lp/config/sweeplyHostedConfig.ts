// ─────────────────────────────────────────────
// Sweeply Hosted config
// Инжектирует affiliate URL в кнопку с id="checkout_cta"
// ─────────────────────────────────────────────

export function injectSweeplyHostedScript(html: string, affiliateUrl: string): string {
  const script = `<script>
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    // Update checkout_cta button with affiliate URL
    var ctaButton = document.getElementById('checkout_cta');
    if (ctaButton) {
      ctaButton.setAttribute('href', ${JSON.stringify(affiliateUrl)});
      console.log('[sweeplyHosted] CTA updated with affiliate URL');
    } else {
      console.warn('[sweeplyHosted] checkout_cta button not found');
    }
    
    // Also update any other .button-main links if needed
    var allButtons = document.querySelectorAll('a.button-main');
    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].setAttribute('href', ${JSON.stringify(affiliateUrl)});
    }
  });
})();
<\/script>`
  return html.replace("</body>", script + "\n</body>")
}

