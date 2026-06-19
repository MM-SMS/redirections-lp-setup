// ─────────────────────────────────────────────
// Default redirect page
// Used when a campaign resolves with an affiliate_url but no prelander_id
// (nothing to render from public/lp/). Mimics a native browser confirm dialog.
// Adjust DEFAULT_REDIRECT_SETTINGS to change the delay.
// ─────────────────────────────────────────────

const DEFAULT_REDIRECT_SETTINGS = {
  delaySeconds: 5,
}

export function renderDefaultRedirectPage(affiliateUrl: string): string {
  const seconds = DEFAULT_REDIRECT_SETTINGS.delaySeconds

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting…</title>
<style>
  html, body {
    margin: 0; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: #202124;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  }
  .dialog {
    background: #fff; border-radius: 8px;
    box-shadow: 0 4px 23px 0 rgba(0,0,0,.2);
    padding: 24px 28px; max-width: 360px; width: 90%;
    text-align: center;
  }
  .dialog p { margin: 0 0 20px; font-size: 15px; color: #202124; line-height: 1.4; }
  .timer { font-weight: 600; }
  .actions { display: flex; gap: 10px; justify-content: center; }
  button {
    font-size: 14px; padding: 8px 18px; border-radius: 4px;
    border: 1px solid #dadce0; background: #f8f9fa; cursor: pointer;
  }
  button.primary { background: #1a73e8; color: #fff; border-color: #1a73e8; }
  button:hover { opacity: .9; }
</style>
</head>
<body>
  <div class="dialog">
    <p>You will be redirected to another page in <span class="timer" id="timer">${seconds}</span>s</p>
    <div class="actions">
      <button id="cancelBtn">Cancel</button>
      <button id="redirectBtn" class="primary">Redirect</button>
    </div>
  </div>
  <script>
  (function() {
    var url = ${JSON.stringify(affiliateUrl)};
    var seconds = ${seconds};
    var timerEl = document.getElementById('timer');
    var interval = setInterval(function() {
      seconds -= 1;
      timerEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(interval);
        window.location.href = url;
      }
    }, 1000);
    document.getElementById('redirectBtn').addEventListener('click', function() {
      clearInterval(interval);
      window.location.href = url;
    });
    document.getElementById('cancelBtn').addEventListener('click', function() {
      clearInterval(interval);
    });
  })();
  <\/script>
</body>
</html>`
}
