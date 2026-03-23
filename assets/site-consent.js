(function () {
  const script = document.currentScript;
  const gaId = script ? script.getAttribute('data-ga-id') : '';
  const privacyUrl = script ? script.getAttribute('data-privacy-url') : 'privacy-policy.html';
  const cookiesUrl = script ? script.getAttribute('data-cookies-url') : 'cookie-policy.html';
  const legalUrl = script ? script.getAttribute('data-legal-url') : 'legal-notice.html';
  const storageKey = 'sierramar_cookie_choice';
  let analyticsLoaded = false;
  let banner;

  function loadAnalytics() {
    if (!gaId || analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', gaId);

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(tag);
  }

  function getChoice() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function setChoice(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      return;
    }
  }

  function openBanner() {
    if (banner) banner.hidden = false;
  }

  function closeBanner() {
    if (banner) banner.hidden = true;
  }

  function acceptAnalytics() {
    setChoice('accepted');
    loadAnalytics();
    closeBanner();
  }

  function rejectAnalytics() {
    setChoice('rejected');
    closeBanner();
  }

  function createBanner() {
    banner = document.createElement('div');
    banner.className = 'site-consent-banner';
    banner.hidden = true;
    banner.innerHTML =
      '<div class="site-consent-title">Privacy and cookies</div>' +
      '<p class="site-consent-text">' +
        'This site uses analytics only if you accept them. Rejecting keeps only the storage needed to remember your cookie choice. ' +
        '<a href="' + privacyUrl + '">Privacy Policy</a> &middot; ' +
        '<a href="' + cookiesUrl + '">Cookie Policy</a> &middot; ' +
        '<a href="' + legalUrl + '">Legal Notice</a>' +
      '</p>' +
      '<div class="site-consent-actions">' +
        '<button type="button" class="site-consent-btn accept" data-consent-action="accept">Accept analytics</button>' +
        '<button type="button" class="site-consent-btn reject" data-consent-action="reject">Reject analytics</button>' +
        '<button type="button" class="site-consent-btn link" data-consent-action="close">Close</button>' +
      '</div>';

    banner.addEventListener('click', function (event) {
      const action = event.target && event.target.getAttribute('data-consent-action');
      if (!action) return;
      if (action === 'accept') acceptAnalytics();
      if (action === 'reject') rejectAnalytics();
      if (action === 'close') closeBanner();
    });

    document.body.appendChild(banner);
  }

  function initMapEmbeds() {
    const cards = document.querySelectorAll('[data-map-src]');
    cards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        const trigger = event.target && event.target.closest('[data-load-map]');
        if (!trigger) return;

        const src = card.getAttribute('data-map-src');
        if (!src || card.getAttribute('data-map-loaded') === 'true') return;

        const iframe = document.createElement('iframe');
        iframe.className = 'map-frame';
        iframe.loading = 'lazy';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.src = src;

        card.setAttribute('data-map-loaded', 'true');
        card.classList.add('map-loaded');
        card.innerHTML = '';
        card.appendChild(iframe);
      });
    });
  }

  function init() {
    createBanner();
    initMapEmbeds();

    const choice = getChoice();
    if (choice === 'accepted') {
      loadAnalytics();
      return;
    }

    if (choice === 'rejected') {
      return;
    }

    openBanner();
  }

  window.SierraMarConsent = {
    open: openBanner,
    accept: acceptAnalytics,
    reject: rejectAnalytics
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
