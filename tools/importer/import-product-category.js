/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';

import ciscoCleanupTransformer from './transformers/cisco-cleanup.js';

const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'cards': cardsParser,
};

const PAGE_TEMPLATE = {
  name: 'product-category',
  description: 'Product category page with hero, feature cards and columns, sub-category navigation, related content cards, and CTA section',
  urls: [
    'https://www.cisco.com/site/us/en/products/networking/index.html',
    'https://www.cisco.com/site/us/en/products/security/index.html'
  ],
  blocks: [
    { name: 'hero', instances: ['#section-hero .cds-c-text-overlay', '#section-hero .cmp-teaser'] },
    { name: 'columns', instances: ['.cds-c-media-split'] },
    { name: 'cards', instances: ['.cds-c-container-divider .cds-l-grid', '.cds-c-container-content .cds-l-grid'] }
  ]
};

const transformers = [ciscoCleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => { try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed:`, e); } });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      } catch (e) { /* skip invalid selector */ }
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
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name}:`, e); } }
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
