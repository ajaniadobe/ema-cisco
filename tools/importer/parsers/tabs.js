/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block.
 * Source: https://www.cisco.com/ - Tabbed product showcase section
 * Selectors from captured DOM: section.innovations-c-wrapper .innovations-c-main
 * Structure: One row per tab. Col 1 = tab label, Col 2 = image + heading + description + CTA
 */
export default function parse(element, { document }) {
  const cells = [];

  const tabButtons = element.querySelectorAll('.innovations-c-tab, [role="tab"]');
  const contentPanels = element.querySelectorAll('.innovations-c-content, [role="tabpanel"]');
  const mediaPanels = element.querySelectorAll('.innovations-c-media-item');

  tabButtons.forEach((tab, i) => {
    const label = tab.textContent.trim();
    const panel = contentPanels[i];
    const media = mediaPanels[i];

    // Col 1: Tab label
    const labelEl = document.createElement('p');
    labelEl.textContent = label;

    // Col 2: Tab content (image + heading + description + CTA)
    const contentFrag = document.createDocumentFragment();

    if (media) {
      const img = media.querySelector('img');
      if (img) contentFrag.appendChild(img);
    }

    if (panel) {
      const heading = panel.querySelector('h3, .innovations-c-title, [class*="title"]');
      if (heading) contentFrag.appendChild(heading);
      const desc = panel.querySelector('p, .innovations-c-description');
      if (desc) contentFrag.appendChild(desc);
      const cta = panel.querySelector('a, .innovations-c-cta a');
      if (cta) contentFrag.appendChild(cta);
    }

    cells.push([labelEl, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
