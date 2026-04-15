/* eslint-disable */
/* global WebImporter */

/**
 * Parser for logo-bar block.
 * Source: https://www.cisco.com/ - Customer logo bar section
 * Selectors from captured DOM: section.clients-logo-section .logo-grid-section
 * Structure: Row 1 = trust statement, then one row per logo (image + link)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Trust statement text
  const statement = element.querySelector('.muse-heading-4, .muse-text-center span, [class*="heading"]');
  if (statement) {
    cells.push([statement]);
  }

  // Subsequent rows: Each logo as image + link
  const logoItems = element.querySelectorAll('.logo-grid-item, .logo-grid-container > div');
  logoItems.forEach((item) => {
    const link = item.querySelector('a');
    const img = item.querySelector('img');
    if (img) {
      if (link) {
        const a = link.cloneNode(false);
        a.textContent = '';
        a.appendChild(img);
        cells.push([a]);
      } else {
        cells.push([img]);
      }
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'logo-bar', cells });
  element.replaceWith(block);
}
