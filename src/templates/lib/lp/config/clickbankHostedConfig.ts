// ─────────────────────────────────────────────
// Hosted config
// Редактируй HOSTED_SETTINGS для изменения поведения
// ─────────────────────────────────────────────

const HOSTED_SETTINGS = {
  iframeDelay: 2000, // мс после load события до инжекта iframe
}

function isCrmCheckoutHop(url: string): boolean {
  return url.includes("/api/public/ck/")
}

export function injectClickBankHostedScript(html: string, ctaUrl: string): string {
  const skipIframe = isCrmCheckoutHop(ctaUrl)
  const script = `<script>
(function() {
  var url = ${JSON.stringify(ctaUrl)};
  window.addEventListener('DOMContentLoaded', function() {
    var ctaButton = document.getElementById('checkout_cta');
    if (ctaButton) ctaButton.setAttribute('href', url);
    var allButtons = document.querySelectorAll('a.button-main');
    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].setAttribute('href', url);
    }
  });
  ${skipIframe ? "" : `window.addEventListener('load', function() {
    setTimeout(function() {
      var iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
      iframe.src = url;
      document.body.appendChild(iframe);
    }, ${HOSTED_SETTINGS.iframeDelay});
  });`}
})();
<\/script>`
  return html.replace("</body>", script + "\n</body>")
}
