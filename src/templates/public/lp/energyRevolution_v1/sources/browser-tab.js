  const originalTitle = document.title || "(1) Energy Revolution System";
  const messages = ["⚠️ Urgent Message! Watch Now...", "⚡ Discover Tesla's Forbidden Blueprint While You Still Can!"];
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
