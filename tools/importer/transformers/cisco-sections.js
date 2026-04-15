/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cisco section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 * Selectors from captured DOM of https://www.cisco.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Try to find the section element using the selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) {
          // Invalid selector, skip
        }
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section break (hr) before each section except the first
      if (section.id !== template.sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }
    });
  }
}
