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

  // tools/importer/import-product-category.js
  var import_product_category_exports = {};
  __export(import_product_category_exports, {
    default: () => import_product_category_default
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

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
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
  function parse3(element, { document }) {
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

  // tools/importer/import-product-category.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "cards": parse3
  };
  var PAGE_TEMPLATE = {
    name: "product-category",
    description: "Product category page with hero, feature cards and columns, sub-category navigation, related content cards, and CTA section",
    urls: [
      "https://www.cisco.com/site/us/en/products/networking/index.html",
      "https://www.cisco.com/site/us/en/products/security/index.html"
    ],
    blocks: [
      { name: "hero", instances: ["#section-hero .cds-c-text-overlay", "#section-hero .cmp-teaser"] },
      { name: "columns", instances: [".cds-c-media-split"] },
      { name: "cards", instances: [".cds-c-container-divider .cds-l-grid", ".cds-c-container-content .cds-l-grid"] }
    ]
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          document.querySelectorAll(selector).forEach((element) => {
            pageBlocks.push({ name: blockDef.name, selector, element });
          });
        } catch (e) {
        }
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_product_category_default = {
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
  return __toCommonJS(import_product_category_exports);
})();
