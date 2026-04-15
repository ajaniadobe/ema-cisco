/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (media-split pattern).
 * Source: Cisco category hub pages - media split teasers (image + text side by side)
 * Selectors from captured DOM: .cds-c-media-split (teaser with image and text)
 * Structure: Single row with 2 columns: Col 1 = image, Col 2 = heading + description + CTA
 */
export default function parse(element, { document }) {
  const cells = [];

  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image, picture img, img');
  const heading = element.querySelector('h2, h3, .cmp-teaser__title, [class*="title"]');
  const desc = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p');
  const cta = element.querySelector('.cmp-teaser__action-container a, a[class*="cta"], a[class*="button"]');

  // Col 1: Image
  const imgCell = img || '';

  // Col 2: Text content
  const contentFrag = document.createDocumentFragment();
  if (heading) contentFrag.appendChild(heading);
  if (desc) contentFrag.appendChild(desc);
  if (cta) contentFrag.appendChild(cta);

  cells.push([imgCell, contentFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
