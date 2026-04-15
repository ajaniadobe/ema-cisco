/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block.
 * Source: https://www.cisco.com/ - Outcomes section
 * Selectors from captured DOM: .outcomes-container
 * Structure: One row per panel. Col 1 = title, Col 2 = image + description
 */
export default function parse(element, { document }) {
  const cells = [];

  const desktopItems = element.querySelectorAll('.outcomes-list .outcomes-item');
  const items = desktopItems.length > 0 ? desktopItems : element.querySelectorAll('.outcomes-item, .outcomes-mobile-item');
  const images = element.querySelectorAll('.outcomes-image img, .outcomes-right img');

  items.forEach((item, i) => {
    const title = item.querySelector('h3, .outcomes-item-title, .outcomes-mobile-title');
    const img = images[i];
    const desc = item.querySelector('p, .outcomes-item-description p, .outcomes-mobile-description');

    const contentFrag = document.createDocumentFragment();
    if (img) contentFrag.appendChild(img);
    if (desc) contentFrag.appendChild(desc);

    cells.push([title || '', contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
