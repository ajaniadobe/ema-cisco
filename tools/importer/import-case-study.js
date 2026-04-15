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
  name: 'case-study',
  description: 'Customer case study page with breadcrumb, hero with industry tag and video CTA, challenge/solution columns, long-form narrative with embedded Brightcove videos, testimonial carousel, recommendation cards, and next-steps CTA',
  urls: [
    'https://www.cisco.com/site/us/en/about/case-studies-customer-stories/nestle.html',
    'https://www.cisco.com/site/us/en/about/why-cisco/mclaren-racing.html'
  ],
  blocks: [
    { name: 'hero', instances: ['.cds-c-hero .cmp-teaser'] },
    { name: 'columns', instances: ['.cds-c-detailblock'] },
    { name: 'cards', instances: ['.cds-c-multi-card', '.cds-c-additional-offering'] }
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
      } catch (e) { /* skip */ }
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
