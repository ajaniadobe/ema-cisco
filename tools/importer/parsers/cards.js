/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Source: https://www.cisco.com/ - Portfolio tiles + Case study cards
 * Selectors from captured DOM:
 *   - .portfolio-tiles (4 icon+label linked cards)
 *   - .customer-story-carousel-items (3 case study cards with image + h3 + description + CTA)
 * Structure: One row per card. Col 1 = image, Col 2 = heading + description + CTA link
 */
export default function parse(element, { document }) {
  const cells = [];

  const isPortfolio = element.classList.contains('portfolio-tiles') || element.querySelector('.portfolio-tile');
  const isCaseStudy = element.classList.contains('customer-story-carousel-items') || element.querySelector('.customer-story-card');

  if (isPortfolio) {
    const tiles = element.querySelectorAll('.portfolio-tile, a[class*="portfolio"]');
    tiles.forEach((tile) => {
      const img = tile.querySelector('img');
      const label = tile.querySelector('.portfolio-tile-title, span');
      const href = tile.getAttribute('href');

      const contentFrag = document.createDocumentFragment();
      if (label && href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(link);
        contentFrag.appendChild(p);
      } else if (label) {
        contentFrag.appendChild(label);
      }

      cells.push([img || '', contentFrag]);
    });
  } else if (isCaseStudy) {
    const cards = element.querySelectorAll('.customer-story-card');
    cards.forEach((card) => {
      const img = card.querySelector('.customer-story-media img, .customer-story-image');
      const heading = card.querySelector('h3, .customer-story-title');
      const desc = card.querySelector('p, .customer-story-description');
      const cta = card.querySelector('a.customer-story-cta-button, a[class*="muse-button"]');

      const contentFrag = document.createDocumentFragment();
      if (heading) contentFrag.appendChild(heading);
      if (desc) contentFrag.appendChild(desc);
      if (cta) contentFrag.appendChild(cta);

      cells.push([img || '', contentFrag]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
