/**
 * utm-forward.js  (v3)
 * ---------------------------------------------------------------------
 * Reads tracking parameters from the current page URL and forwards
 * them to the advertiser/tracker on outbound clicks, so they appear
 * in the affiliate network's reports.
 *
 * Drop into <head> as:  <script src="utm-forward.js?v=3"></script>
 *
 * Two layers of coverage (both run automatically on every page):
 *
 *   A. STATIC LINK REWRITING — for pages where the CTA has a real
 *      href like  <a href="https://tracker.com/click?...">.
 *      Walks the DOM and rewrites matching <a href> values.
 *
 *   B. NAVIGATION INTERCEPTION — for pages where the CTA is
 *      <a href="javascript:void(0)" onclick="go_away();"> and the
 *      navigation happens via window.location in a JS handler.
 *      Wraps Location.href / assign / replace and window.open so
 *      UTMs are appended to the URL the page tries to navigate to,
 *      no matter what custom function performs the navigation.
 *
 * Behaviour:
 *   - Forwards UTMs, affiliate sub IDs (sub_id, sub_id2, s1, s2,
 *     aff_sub, c1, ...), and major ad-platform click IDs (gclid,
 *     fbclid, ttclid, msclkid) by default.
 *   - Persists params to sessionStorage so they survive internal
 *     navigation between landing pages within the same session.
 *   - Idempotent: safe to run more than once. Existing params on the
 *     destination URL (e.g. o=13945&a=1712) are preserved.
 * ---------------------------------------------------------------------
 */
(function () {
  'use strict';

  // ---- Config -------------------------------------------------------
  var CONFIG = {
    // Forward any param whose name starts with one of these prefixes.
    // Covers UTMs and affiliate sub-ID families (sub_id, sub_id1,
    // sub_id2... / aff_sub, aff_sub2... / subid, subid1...).
    paramPrefixes: ['utm_', 'sub_id', 'subid', 'aff_sub'],

    // Forward these exact param names too. Covers short-form sub IDs
    // common with affiliate networks (s1, c1, ...) and ad-platform
    // click IDs.
    paramNames: [
      // Short sub IDs
      's1', 's2', 's3', 's4', 's5',
      'c1', 'c2', 'c3', 'c4', 'c5',
      'p1', 'p2', 'p3',
      // Common ad-platform click IDs
      'gclid', 'gbraid', 'wbraid',  // Google
      'fbclid',                     // Meta
      'ttclid',                     // TikTok
      'msclkid',                    // Microsoft
      'twclid',                     // X / Twitter
      'li_fat_id',                  // LinkedIn
      'epik',                       // Pinterest
      'ScCid',                      // Snapchat
      'irclickid'                   // Impact
    ],

    // Nuclear option: forward every query parameter from the landing
    // URL, ignoring the prefix/name lists above. Useful if a network
    // sends a tracking param with an exotic name not covered above.
    forwardAllParams: false,

    // ---- Layer A: static link selectors ----
    // Pattern-based — domain-agnostic so it works across landing pages
    // without listing each tracker host.
    linkSelectors: [
      'a[data-forward-utm]',     // explicit opt-in
      'a[href*="/click?"]',      // whitetracker, redtrack, voluum, etc.
      'a[href*="/click/"]',      // path-style click handlers
      'a.btn',                   // common CTA class
      'a.button',                // common CTA class (singular)
      'a[class*="checkout"]',
      'a[class*="cta"]'
    ],

    // ---- Layer B: navigation interception ----
    // When the page navigates programmatically, we append params if
    // the destination URL looks like an offer/tracker URL. The default
    // catches any URL whose path contains /click — the universal
    // click-redirect pattern used by virtually every affiliate
    // tracker and self-hosted click endpoint.
    navUrlPatterns: [
      /\/click(\?|\/|$)/i
    ],

    // Optional: extra hostnames or URL substrings to match in BOTH
    // layers. Add here whenever you discover a new tracker domain
    // that doesn't match the patterns above.
    //   e.g. ['mytracker.io', 'partner.example.net']
    domains: [],

    // Optional nuclear option: forward params to ANY off-site URL
    // (both static links and programmatic navigations).
    forwardToAllExternal: false,

    // Session-storage key used to persist params across internal nav.
    storageKey: 'fwd_tracking_params'
  };

  // ---- Param collection --------------------------------------------
  function shouldForwardParam(name) {
    if (CONFIG.forwardAllParams) return true;
    for (var i = 0; i < CONFIG.paramPrefixes.length; i++) {
      if (name.indexOf(CONFIG.paramPrefixes[i]) === 0) return true;
    }
    return CONFIG.paramNames.indexOf(name) !== -1;
  }

  function readFromUrl() {
    var out = {};
    try {
      new URLSearchParams(window.location.search).forEach(function (v, k) {
        if (shouldForwardParam(k)) out[k] = v;
      });
    } catch (e) { /* old browser, ignore */ }
    return out;
  }

  function readFromStorage() {
    try {
      var raw = sessionStorage.getItem(CONFIG.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function writeToStorage(params) {
    try {
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(params));
    } catch (e) { /* quota / private mode, ignore */ }
  }

  // URL params win over stored ones; fall back to storage on inner pages.
  function resolveParams() {
    var fromUrl = readFromUrl();
    if (Object.keys(fromUrl).length > 0) {
      writeToStorage(fromUrl);
      return fromUrl;
    }
    return readFromStorage();
  }

  // ---- Shared helpers ----------------------------------------------
  function isExternal(url) {
    return (url.protocol === 'http:' || url.protocol === 'https:') &&
           url.hostname !== window.location.hostname;
  }

  function matchesDomains(href) {
    for (var i = 0; i < CONFIG.domains.length; i++) {
      if (href.indexOf(CONFIG.domains[i]) !== -1) return true;
    }
    return false;
  }

  // Append params to a URL string. Returns { href, changed }.
  function appendToHref(href, params) {
    if (!href) return { href: href, changed: false };
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) {
      return { href: href, changed: false };
    }

    try {
      var url = new URL(href, window.location.href);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return { href: href, changed: false };
      }

      var changed = false;
      Object.keys(params).forEach(function (k) {
        if (url.searchParams.get(k) !== params[k]) {
          url.searchParams.set(k, params[k]);
          changed = true;
        }
      });
      return { href: changed ? url.toString() : href, changed: changed };
    } catch (e) {
      return { href: href, changed: false };
    }
  }

  // ---- Layer A: static link rewriting ------------------------------
  function shouldRewriteLink(a, parsedUrl) {
    try {
      if (a.matches && a.matches(CONFIG.linkSelectors.join(','))) return true;
    } catch (e) { /* invalid selector or detached node */ }

    var href = a.getAttribute('href') || '';
    if (CONFIG.domains.length && matchesDomains(href)) return true;
    if (CONFIG.forwardToAllExternal && parsedUrl && isExternal(parsedUrl)) return true;

    return false;
  }

  function rewriteAllLinks(params) {
    if (Object.keys(params).length === 0) return;

    var nodes;
    if (CONFIG.forwardToAllExternal || CONFIG.domains.length) {
      nodes = document.getElementsByTagName('a');
    } else {
      nodes = document.querySelectorAll(CONFIG.linkSelectors.join(','));
    }

    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      var original = a.getAttribute('href');
      if (!original) continue;

      var parsed;
      try { parsed = new URL(original, window.location.href); } catch (e) { parsed = null; }

      if (!shouldRewriteLink(a, parsed)) continue;

      var result = appendToHref(original, params);
      if (result.changed) a.setAttribute('href', result.href);
    }
  }

  // ---- Layer B: programmatic navigation interception ---------------
  function shouldRewriteNavUrl(rawUrl) {
    if (!rawUrl) return false;
    var s = String(rawUrl);
    if (/^(mailto:|tel:|javascript:|#)/i.test(s)) return false;

    var parsed;
    try { parsed = new URL(s, window.location.href); } catch (e) { return false; }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    var pathAndQuery = parsed.pathname + parsed.search;

    // Default tracker patterns
    for (var i = 0; i < CONFIG.navUrlPatterns.length; i++) {
      if (CONFIG.navUrlPatterns[i].test(pathAndQuery)) return true;
    }

    // Domain config
    if (CONFIG.domains.length && matchesDomains(s)) return true;

    // External opt-in
    if (CONFIG.forwardToAllExternal && isExternal(parsed)) return true;

    return false;
  }

  function maybeRewriteNavUrl(rawUrl, params) {
    if (!shouldRewriteNavUrl(rawUrl)) return rawUrl;
    var result = appendToHref(String(rawUrl), params);
    return result.changed ? result.href : rawUrl;
  }

  function patchNavigation(params) {
    if (Object.keys(params).length === 0) return;
    if (typeof Location === 'undefined') return;

    // 1. Wrap Location.prototype.href setter — catches both
    //    `window.location.href = "..."` and `window.location = "..."`
    //    (the latter delegates to the href setter internally).
    try {
      var hrefDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'href');
      if (hrefDesc && typeof hrefDesc.set === 'function' && hrefDesc.configurable) {
        var origHrefSet = hrefDesc.set;
        Object.defineProperty(Location.prototype, 'href', {
          configurable: true,
          enumerable: hrefDesc.enumerable !== false,
          get: hrefDesc.get,
          set: function (v) { origHrefSet.call(this, maybeRewriteNavUrl(v, params)); }
        });
      }
    } catch (e) { /* some browsers refuse to redefine; fall through */ }

    // 2. Wrap assign() and replace()
    ['assign', 'replace'].forEach(function (method) {
      try {
        var orig = Location.prototype[method];
        if (typeof orig !== 'function') return;
        Location.prototype[method] = function (url) {
          return orig.call(this, maybeRewriteNavUrl(url, params));
        };
      } catch (e) { /* ignore */ }
    });

    // 3. Wrap window.open  (covers target="_blank" and JS popups)
    try {
      var origOpen = window.open;
      if (typeof origOpen === 'function') {
        window.open = function (url) {
          var args = Array.prototype.slice.call(arguments);
          if (args.length > 0) args[0] = maybeRewriteNavUrl(args[0], params);
          return origOpen.apply(window, args);
        };
      }
    } catch (e) { /* ignore */ }
  }

  // ---- Boot ---------------------------------------------------------
  function start() {
    var params = resolveParams();

    // Layer B first: navigation patches need to be in place before any
    // page script tries to navigate.
    patchNavigation(params);

    // Layer A: rewrite static links present in the DOM.
    rewriteAllLinks(params);

    // Re-run static-link rewriting when offer links are added/changed
    // after load (handles uniscript.js / templated {offer_link} swaps).
    if (typeof MutationObserver !== 'undefined' && document.body) {
      var pending = false;
      var observer = new MutationObserver(function () {
        if (pending) return;
        pending = true;
        var schedule = window.requestAnimationFrame || window.setTimeout;
        schedule(function () {
          pending = false;
          rewriteAllLinks(params);
        }, 0);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
