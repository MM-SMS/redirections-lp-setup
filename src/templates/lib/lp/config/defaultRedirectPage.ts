// ─────────────────────────────────────────────
// Default redirect page
// Used when a campaign resolves with an affiliate_url but no prelander_id
// (nothing to render from public/lp/). Tells the visitor the offer they
// followed is gone and counts down to the affiliate URL.
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
<title>Offer expired</title>
<style>
  html, body {
    margin: 0; min-height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: #eef1f8;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    padding: 24px;
  }
  .dialog {
    background: #fff; border-radius: 16px;
    box-shadow: 0 10px 40px 0 rgba(20,30,60,.12);
    padding: 36px 32px; max-width: 380px; width: 100%;
    text-align: center;
  }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #ffe9e0; color: #e8542a;
    font-size: 12px; font-weight: 600;
    padding: 6px 14px; border-radius: 999px;
    margin-bottom: 20px;
  }
  .badge::before {
    content: ""; width: 6px; height: 6px; border-radius: 50%;
    background: #e8542a; display: inline-block;
  }
  h1 { margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #16213e; }
  .subtext { margin: 0 0 28px; font-size: 14px; line-height: 1.5; color: #6b7280; }
  .ring {
    width: 120px; height: 120px; margin: 0 auto 28px;
    border-radius: 50%; border: 2px solid #e3e7f0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .ring .count { font-size: 32px; font-weight: 700; color: #16213e; line-height: 1; }
  .ring .label { font-size: 11px; font-weight: 600; letter-spacing: .06em; color: #9aa3b5; margin-top: 4px; }
  .cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; border: none; border-radius: 10px;
    background: #ee5e3f; color: #fff;
    font-size: 15px; font-weight: 700;
    padding: 15px 20px; cursor: pointer;
    box-shadow: 0 8px 20px rgba(238,94,63,.35);
  }
  .cta:hover { background: #e34d2c; }
  hr { border: none; border-top: 1px solid #edf0f6; margin: 24px 0 16px; }
  .cancel-line { font-size: 13px; color: #9aa3b5; }
  .cancel-line a { color: #16213e; font-weight: 600; text-decoration: underline; cursor: pointer; }
</style>
</head>
<body>
  <div class="dialog">
    <span class="badge">Offer expired</span>
    <h1>This deal just ended</h1>
    <p class="subtext">The promo you came for is no longer live.<br>We're sending you straight to our latest offer.</p>
    <div class="ring">
      <span class="count" id="timer">${seconds}</span>
      <span class="label">SECONDS</span>
    </div>
    <button id="redirectBtn" class="cta">See the new offer &rarr;</button>
    <hr>
    <p class="cancel-line">Don't want to be redirected automatically? <a id="cancelBtn">Cancel redirect</a></p>
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
