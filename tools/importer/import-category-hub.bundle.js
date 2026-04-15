var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-category-hub.js
  var import_category_hub_exports = {};
  __export(import_category_hub_exports, {
    default: () => import_category_hub_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".cmp-teaser__image img, .cmp-image__image, picture img");
    const heading = element.querySelector('h1, .cmp-teaser__title, [class*="title"]');
    const subheading = element.querySelector("h2, .cmp-teaser__pretitle");
    const description = element.querySelector(".cmp-teaser__description p, .cmp-teaser__description, p");
    const ctaLink = element.querySelector('.cmp-teaser__action-container a, a[class*="cta"], a[class*="button"]');
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse2(element, { document }) {
    const cells = [];
    const desktopItems = element.querySelectorAll(".outcomes-list .outcomes-item");
    const items = desktopItems.length > 0 ? desktopItems : element.querySelectorAll(".outcomes-item, .outcomes-mobile-item");
    const images = element.querySelectorAll(".outcomes-image img, .outcomes-right img");
    items.forEach((item, i) => {
      const title = item.querySelector("h3, .outcomes-item-title, .outcomes-mobile-title");
      const img = images[i];
      const desc = item.querySelector("p, .outcomes-item-description p, .outcomes-mobile-description");
      const contentFrag = document.createDocumentFragment();
      if (img) contentFrag.appendChild(img);
      if (desc) contentFrag.appendChild(desc);
      cells.push([title || "", contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const cells = [];
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image, picture img, img");
    const heading = element.querySelector('h2, h3, .cmp-teaser__title, [class*="title"]');
    const desc = element.querySelector(".cmp-teaser__description p, .cmp-teaser__description, p");
    const cta = element.querySelector('.cmp-teaser__action-container a, a[class*="cta"], a[class*="button"]');
    const imgCell = img || "";
    const contentFrag = document.createDocumentFragment();
    if (heading) contentFrag.appendChild(heading);
    if (desc) contentFrag.appendChild(desc);
    if (cta) contentFrag.appendChild(cta);
    cells.push([imgCell, contentFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse4(element, { document }) {
    const cells = [];
    const isPortfolio = element.classList.contains("portfolio-tiles") || element.querySelector(".portfolio-tile");
    const isCaseStudy = element.classList.contains("customer-story-carousel-items") || element.querySelector(".customer-story-card");
    if (isPortfolio) {
      const tiles = element.querySelectorAll('.portfolio-tile, a[class*="portfolio"]');
      tiles.forEach((tile) => {
        const img = tile.querySelector("img");
        const label = tile.querySelector(".portfolio-tile-title, span");
        const href = tile.getAttribute("href");
        const contentFrag = document.createDocumentFragment();
        if (label && href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = label.textContent.trim();
          const p = document.createElement("p");
          p.appendChild(link);
          contentFrag.appendChild(p);
        } else if (label) {
          contentFrag.appendChild(label);
        }
        cells.push([img || "", contentFrag]);
      });
    } else if (isCaseStudy) {
      const cards = element.querySelectorAll(".customer-story-card");
      cards.forEach((card) => {
        const img = card.querySelector(".customer-story-media img, .customer-story-image");
        const heading = card.querySelector("h3, .customer-story-title");
        const desc = card.querySelector("p, .customer-story-description");
        const cta = card.querySelector('a.customer-story-cta-button, a[class*="muse-button"]');
        const contentFrag = document.createDocumentFragment();
        if (heading) contentFrag.appendChild(heading);
        if (desc) contentFrag.appendChild(desc);
        if (cta) contentFrag.appendChild(cta);
        cells.push([img || "", contentFrag]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cisco-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        '[class*="cookie"]',
        "#onetrust-consent-sdk",
        "#ot-pc-lst",
        "#ot-lst-cnt",
        "#ot-fltr-modal",
        '[id*="onetrust"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="chatbot"]',
        '[class*="chat-widget"]',
        '[class*="let-us-help"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "section.fw-c-search",
        "#fw-c-support-finder",
        "#fw-c-global-search"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        '[role="banner"]',
        "footer",
        '[role="contentinfo"]',
        "#fw-c-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".fw-c-skip-links",
        '[class*="skip-link"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "section.quick-links-section",
        "#container-header-button"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "section.--hidden"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("[data-config-metrics-group]").forEach((el) => {
        el.removeAttribute("data-config-metrics-group");
        el.removeAttribute("data-config-metrics-title");
        el.removeAttribute("data-config-metrics-item");
      });
    }
  }

  // tools/importer/transformers/cisco-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
      });
    }
  }

  // tools/importer/import-category-hub.js
  var parsers = {
    "hero": parse,
    "accordion": parse2,
    "columns": parse3,
    "cards": parse4
  };
  var PAGE_TEMPLATE = {
    name: "category-hub",
    description: "Top-level category hub page with promotional banner, hero, accordion category browser, trials promo, 3-up link cards, resources section, and CTA",
    urls: [
      "https://www.cisco.com/site/us/en/products/index.html",
      "https://www.cisco.com/site/us/en/solutions/index.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["#section-hero .cds-c-text-overlay", "#section-hero .cmp-teaser"]
      },
      {
        name: "accordion",
        instances: [".cds-c-verticaltabs__container"]
      },
      {
        name: "columns",
        instances: [".cds-c-media-split"]
      },
      {
        name: "cards",
        instances: [".cds-c-container-divider .cds-l-grid"]
      }
    ],
    sections: [
      { id: "section-promo", name: "Promo Banner", selector: ["#container-alert", ".cds-c-alerts"], style: null, blocks: [], defaultContent: [] },
      { id: "section-hero", name: "Hero", selector: "#section-hero", style: null, blocks: ["hero"], defaultContent: [] },
      { id: "section-browser", name: "Category Browser", selector: ".cds-c-verticaltabs", style: null, blocks: ["accordion"], defaultContent: [] },
      { id: "section-trials", name: "Trials and Demos", selector: [".cds-c-media-split__theme--gray", "[id*='media-split-286']"], style: "grey", blocks: ["columns"], defaultContent: [] },
      { id: "section-explore", name: "Explore More", selector: "[id*='containerdivider-318']", style: null, blocks: ["cards"], defaultContent: [] },
      { id: "section-cta", name: "CTA Section", selector: "[id*='containerdivider-ecf']", style: "dark", blocks: ["cards"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
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
        } catch (e) {
          console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
        }
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_category_hub_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name}:`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_category_hub_exports);
})();
