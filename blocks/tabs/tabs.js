function toClassName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function decorate(block) {
  const rows = [...block.children];

  // Check if first row is a background/title row (image with empty alt + heading)
  const firstRow = rows[0];
  const firstImg = firstRow?.querySelector('img[alt=""]');
  const firstHeading = firstRow?.querySelector('h2');

  if (firstImg && firstHeading) {
    // Extract background image and title from first row
    const bgWrapper = document.createElement('div');
    bgWrapper.className = 'tabs-background';
    bgWrapper.append(firstImg);
    block.prepend(bgWrapper);

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'tabs-title';
    titleWrapper.append(firstHeading);
    bgWrapper.after(titleWrapper);

    firstRow.remove();
  }

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].filter(
    (c) => !c.classList.contains('tabs-background') && !c.classList.contains('tabs-title'),
  );

  tabs.forEach((child, i) => {
    const tab = child.firstElementChild;
    if (!tab) return;
    const id = toClassName(tab.textContent);
    const tabpanel = child;
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  // Insert tablist after title (or at top if no title)
  const titleEl = block.querySelector('.tabs-title');
  if (titleEl) {
    titleEl.after(tablist);
  } else {
    block.prepend(tablist);
  }
}
