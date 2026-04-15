export default function decorate(block) {
  const rows = [...block.children];
  const statement = rows.shift();
  if (statement) {
    statement.className = 'logo-bar-statement';
  }

  const logoGrid = document.createElement('div');
  logoGrid.className = 'logo-bar-grid';

  rows.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'logo-bar-item';
    item.append(...row.childNodes);
    logoGrid.append(item);
    row.remove();
  });

  block.append(logoGrid);
}
