// ─────────────────────────────────────────────
// Bridge config
// Редактируй BRIDGE_SETTINGS для изменения поведения
// ─────────────────────────────────────────────

const BRIDGE_SETTINGS = {
  redirectDelay: 500,  // мс до window.location.replace
  blockScroll: true,   // заблокировать скролл до редиректа
}

export function injectClickBankBridgeScript(html: string, redirectUrl: string): string {
  const script = `<script>
(function() {
  var url = ${JSON.stringify(redirectUrl)};
  function init() {
    ${BRIDGE_SETTINGS.blockScroll ? "document.body.style.overflow = 'hidden';" : ""}
    setTimeout(function() {
      window.location.replace(url);
    }, ${BRIDGE_SETTINGS.redirectDelay});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
<\/script>`
  return html.replace("</body>", script + "\n</body>")
}