/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cisco homepage cleanup.
 * Selectors from captured DOM of https://www.cisco.com/
 * Removes non-authorable site chrome and widgets.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (from captured DOM: region "Cookie banner" with dialog "Privacy")
    WebImporter.DOMUtils.remove(element, [
      '[class*="cookie"]',
      '#onetrust-consent-sdk',
      '#ot-pc-lst',
      '#ot-lst-cnt',
      '#ot-fltr-modal',
      '[id*="onetrust"]',
    ]);

    // Chatbot widget (from captured DOM: button "Cisco Chat", "Close Cisco Chat welcome message")
    WebImporter.DOMUtils.remove(element, [
      '[class*="chatbot"]',
      '[class*="chat-widget"]',
      '[class*="let-us-help"]',
    ]);

    // Search overlays (from captured DOM: section.fw-c-search)
    WebImporter.DOMUtils.remove(element, [
      'section.fw-c-search',
      '#fw-c-support-finder',
      '#fw-c-global-search',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header and footer (site chrome - not authorable)
    WebImporter.DOMUtils.remove(element, [
      'header',
      '[role="banner"]',
      'footer',
      '[role="contentinfo"]',
      '#fw-c-footer',
    ]);

    // Skip links (from captured DOM: list with "Skip to main content")
    WebImporter.DOMUtils.remove(element, [
      '.fw-c-skip-links',
      '[class*="skip-link"]',
    ]);

    // Hidden header button container
    WebImporter.DOMUtils.remove(element, [
      '#container-header-button',
    ]);

    // Hidden search section
    WebImporter.DOMUtils.remove(element, [
      'section.--hidden',
    ]);

    // Clean up remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'link',
      'iframe',
    ]);

    // Remove tracking/analytics attributes from all elements
    element.querySelectorAll('[data-config-metrics-group]').forEach((el) => {
      el.removeAttribute('data-config-metrics-group');
      el.removeAttribute('data-config-metrics-title');
      el.removeAttribute('data-config-metrics-item');
    });
  }
}
