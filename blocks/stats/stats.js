export default function decorate(block) {
  const items = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  items.forEach((row) => {
    const stat = document.createElement('div');
    stat.className = 'stats-item';

    const value = row.children[0];
    const label = row.children[1];

    if (value) {
      value.className = 'stats-value';
      stat.append(value);
    }
    if (label) {
      label.className = 'stats-label';
      stat.append(label);
    }

    grid.append(stat);
    row.remove();
  });

  block.append(grid);
}
