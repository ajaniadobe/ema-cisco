/* eslint-disable */
/* global WebImporter */

/**
 * Parser for stats block.
 * Source: https://www.cisco.com/ - Portfolio stats counters
 * Selectors from captured DOM: .portfolio-stats
 * Structure: One row per stat. Col 1 = value, Col 2 = label
 */
export default function parse(element, { document }) {
  const cells = [];

  const statItems = element.querySelectorAll('.portfolio-stat');
  statItems.forEach((item) => {
    const value = item.querySelector('.portfolio-stat-value');
    const label = item.querySelector('.portfolio-stat-label');

    const valEl = document.createElement('p');
    valEl.textContent = value ? value.textContent.trim() : '';

    const labelEl = document.createElement('p');
    labelEl.textContent = label ? label.textContent.trim() : '';

    cells.push([valEl, labelEl]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'stats', cells });
  element.replaceWith(block);
}
