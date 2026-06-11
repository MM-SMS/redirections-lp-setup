// ─────────────────────────────────────────────
// Hosted config
// Редактируй HOSTED_SETTINGS для изменения поведения
// ─────────────────────────────────────────────

const HOSTED_SETTINGS = {
  iframeDelay: 2000, // мс после load события до инжекта iframe
}

export function injectClickBankHostedScript(html: string, preloadUrl: string): string {
  const script = `<script>
(function() {
  window.addEventListener('load', function() {
    setTimeout(function() {
      var iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
      iframe.src = ${JSON.stringify(preloadUrl)};
      document.body.appendChild(iframe);
    }, ${HOSTED_SETTINGS.iframeDelay});
  });
})();
<\/script>`
  return html.replace("</body>", script + "\n</body>")
}