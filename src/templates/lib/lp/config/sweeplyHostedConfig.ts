// ─────────────────────────────────────────────
// Sweeply Hosted config
// Injects CTA url (tracked_url or direct_url+click) into #checkout_cta and a.button-main
// ─────────────────────────────────────────────

export function injectSweeplyHostedScript(html: string, checkoutUrl: string): string {
  const script = `<script>
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    var ctaButton = document.getElementById('checkout_cta');
    if (ctaButton) {
      ctaButton.setAttribute('href', ${JSON.stringify(checkoutUrl)});
    } else {
      console.warn('[sweeplyHosted] checkout_cta button not found');
    }
    var allButtons = document.querySelectorAll('a.button-main');
    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].setAttribute('href', ${JSON.stringify(checkoutUrl)});
    }
  });
})();
<\/script>`
  return html.replace("</body>", script + "\n</body>")
}

