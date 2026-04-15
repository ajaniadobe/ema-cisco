/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Source: https://www.cisco.com/ - Hero banner section
 * Selectors from captured DOM: .cds-c-text-overlay (text-overlay teaser component)
 * Structure: Row 1 = background image, Row 2 = heading + subheading + description + CTA
 */
export default function parse(element, { document }) {
  // Extract background image from teaser image
  const bgImage = element.querySelector('.cmp-teaser__image img, .cmp-image__image, picture img');

  // Extract text content from teaser content area
  const heading = element.querySelector('h1, .cmp-teaser__title, [class*="title"]');
  const subheading = element.querySelector('h2, .cmp-teaser__pretitle');
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p');
  const ctaLink = element.querySelector('.cmp-teaser__action-container a, a[class*="cta"], a[class*="button"]');

  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + subheading + description + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
