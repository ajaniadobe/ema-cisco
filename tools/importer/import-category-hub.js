/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import accordionParser from './parsers/accordion.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';

import ciscoCleanupTransformer from './transformers/cisco-cleanup.js';
import ciscoSectionsTransformer from './transformers/cisco-sections.js';

const parsers = {
  'hero': heroParser,
  'accordion': accordionParser,
  'columns': columnsParser,
  'cards': cardsParser,
};

const PAGE_TEMPLATE = {
  name: 'category-hub',
  description: 'Top-level category hub page with promotional banner, hero, accordion category browser, trials promo, 3-up link cards, resources section, and CTA',
  urls: [
    'https://www.cisco.com/site/us/en/products/index.html',
    'https://www.cisco.com/site/us/en/solutions/index.html'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['#section-hero .cds-c-text-overlay', '#section-hero .cmp-teaser']
    },
    {
      name: 'accordion',
      instances: ['.cds-c-verticaltabs__container']
    },
    {
      name: 'columns',
      instances: ['.cds-c-media-split']
    },
    {
      name: 'cards',
      instances: ['.cds-c-container-divider .cds-l-grid']
    }
  ],
  sections: [
    { id: 'section-promo', name: 'Promo Banner', selector: ['#container-alert', '.cds-c-alerts'], style: null, blocks: [], defaultContent: [] },
    { id: 'section-hero', name: 'Hero', selector: '#section-hero', style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'section-browser', name: 'Category Browser', selector: '.cds-c-verticaltabs', style: null, blocks: ['accordion'], defaultContent: [] },
    { id: 'section-trials', name: 'Trials and Demos', selector: ['.cds-c-media-split__theme--gray', "[id*='media-split-286']"], style: 'grey', blocks: ['columns'], defaultContent: [] },
    { id: 'section-explore', name: 'Explore More', selector: "[id*='containerdivider-318']", style: null, blocks: ['cards'], defaultContent: [] },
    { id: 'section-cta', name: 'CTA Section', selector: "[id*='containerdivider-ecf']", style: 'dark', blocks: ['cards'], defaultContent: [] }
  ]
};

const transformers = [
  ciscoCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [ciscoSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try { transformerFn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      } catch (e) { console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`); }
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name}:`, e); }
      }
    });
    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
