/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news block.
 * Source: https://www.cisco.com/ - Latest news/events cards
 * Selectors from captured DOM: .news-cards-grid .news-card
 * Structure: One row per card. Col 1 = image, Col 2 = badge + heading + CTA
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.news-card');
  cards.forEach((card) => {
    const img = card.querySelector('.ne-card-image img, img');
    const badge = card.querySelector('.card-tag');
    const heading = card.querySelector('h3, .ne-card-title');
    const cta = card.querySelector('a[class*="button"], a[class*="cta"], a');

    const contentFrag = document.createDocumentFragment();
    if (badge) {
      const badgeEl = document.createElement('p');
      badgeEl.textContent = badge.textContent.trim();
      contentFrag.appendChild(badgeEl);
    }
    if (heading) contentFrag.appendChild(heading);
    if (cta) contentFrag.appendChild(cta);

    cells.push([img || '', contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
