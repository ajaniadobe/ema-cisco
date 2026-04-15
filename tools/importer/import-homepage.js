/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import logoBarParser from './parsers/logo-bar.js';
import tabsParser from './parsers/tabs.js';
import accordionParser from './parsers/accordion.js';
import cardsParser from './parsers/cards.js';
import cardsNewsParser from './parsers/cards-news.js';
import statsParser from './parsers/stats.js';

// TRANSFORMER IMPORTS
import ciscoCleanupTransformer from './transformers/cisco-cleanup.js';
import ciscoSectionsTransformer from './transformers/cisco-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'logo-bar': logoBarParser,
  'tabs': tabsParser,
  'accordion': accordionParser,
  'cards': cardsParser,
  'cards-news': cardsNewsParser,
  'stats': statsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Cisco homepage with hero banner, customer logo bar, tabbed product showcase, accordion outcomes, icon category cards with stats, case study cards, news/event cards, and CTA strip',
  urls: [
    'https://www.cisco.com/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['#cdc-homepage-hero-TBD', "[id*='text-overlay'] .cds-c-text-overlay"]
    },
    {
      name: 'logo-bar',
      instances: ['section.clients-logo-section .logo-grid-section']
    },
    {
      name: 'tabs',
      instances: ['section.innovations-c-wrapper .innovations-c-main']
    },
    {
      name: 'accordion',
      instances: ['section[data-config-metrics-group="outcomes"] .outcomes-container']
    },
    {
      name: 'cards',
      instances: [
        'section.portfolio-wrapper .portfolio-tiles',
        'section.customer-story-carousel-section .customer-story-carousel-items'
      ]
    },
    {
      name: 'cards-news',
      instances: ['section[data-config-metrics-group="the latest"] .news-cards-grid']
    },
    {
      name: 'stats',
      instances: ['section.portfolio-wrapper .portfolio-stats']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Banner',
      selector: ['#cdc-homepage-hero-TBD', "div.cmp-container:has(img[alt*='Cisco Live'])"],
      style: 'dark',
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-logo-bar',
      name: 'Customer Logo Bar',
      selector: 'section.clients-logo-section',
      style: 'dark',
      blocks: ['logo-bar'],
      defaultContent: []
    },
    {
      id: 'section-tabbed-showcase',
      name: 'Tabbed Product Showcase',
      selector: 'section.innovations-c-wrapper',
      style: 'dark',
      blocks: ['tabs'],
      defaultContent: ['section.innovations-c-wrapper .innovations-c-heading']
    },
    {
      id: 'section-outcomes',
      name: 'Outcomes Accordion',
      selector: 'section[data-config-metrics-group="outcomes"]',
      style: 'dark',
      blocks: ['accordion'],
      defaultContent: [
        'section[data-config-metrics-group="outcomes"] .outcomes-heading',
        'section[data-config-metrics-group="outcomes"] .outcomes-left > a.muse-button'
      ]
    },
    {
      id: 'section-portfolio',
      name: 'Portfolio Cards with Stats',
      selector: 'section.portfolio-wrapper',
      style: 'dark',
      blocks: ['cards', 'stats'],
      defaultContent: ['section.portfolio-wrapper .portfolio-heading']
    },
    {
      id: 'section-case-studies',
      name: 'Case Study Cards',
      selector: 'section.customer-story-carousel-section',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: ['section.customer-story-carousel-section .customer-story-header h2']
    },
    {
      id: 'section-latest-news',
      name: 'Latest News Cards',
      selector: 'section[data-config-metrics-group="the latest"]',
      style: 'dark',
      blocks: ['cards-news'],
      defaultContent: ['section[data-config-metrics-group="the latest"] .section-heading']
    },
    {
      id: 'section-cta',
      name: 'CTA Strip',
      selector: 'section.endcap-section',
      style: 'dark',
      blocks: [],
      defaultContent: [
        'section.endcap-section .endcap h2',
        'section.endcap-section .endcap-cta a'
      ]
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  ciscoCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [ciscoSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
