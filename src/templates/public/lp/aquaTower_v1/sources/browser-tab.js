  const originalTitle = document.title || "(1) Aqua Tower";
  const messages = ["⚠️ Urgent Message! Watch Now...", "🛰️ NASA Confirms: US To Face 100 Years Of Mega Drought!"];
  let messageIndex = 0;
  let flickerInterval = null;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Start flickering titles
      flickerInterval = setInterval(() => {
        document.title = messages[messageIndex % messages.length];
        messageIndex++;
      }, 800); // speed of flicker (ms)
    } else {
      // Stop flicker and restore original title
      clearInterval(flickerInterval);
      flickerInterval = null;
      document.title = originalTitle;
    }
  });
