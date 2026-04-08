import '../styles/carat.css';
import { fetchCarat } from '../api';
import {
  createElement,
  createSelect,
  createDateInput,
  createButton,
  createControlGroup,
  showSpinner,
  removeSpinner,
  showError,
  clearError,
  formatPrice,
} from './common';

export function renderCarat(container: HTMLElement): void {
  // Controls
  const controls = createElement('div', { class: 'controls' });

  const baseSelect = createSelect('carat-base', [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
  ], 'USD');

  const dateInput = createDateInput('carat-date', '');
  const fetchBtn = createButton('Fetch Carat Prices');

  controls.appendChild(createControlGroup('Base Currency', baseSelect));
  controls.appendChild(createControlGroup('Date (optional)', dateInput));
  controls.appendChild(createControlGroup('', fetchBtn));
  container.appendChild(controls);

  // Table container
  const tableSection = createElement('div', { id: 'carat-display' });
  container.appendChild(tableSection);

  async function loadData() {
    const base = baseSelect.value;
    const date = dateInput.value || undefined;

    clearError(container);
    tableSection.innerHTML = '';
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Loading...';

    const spinner = showSpinner(tableSection);

    try {
      const data = await fetchCarat(base, 'XAU', date);
      removeSpinner(spinner);

      const title = createElement('h3', { class: 'section-title' }, [
        `Gold Carat Prices${data.date ? ` - ${data.date}` : ''}`,
      ]);
      tableSection.appendChild(title);

      // Find the max price for bar scaling
      const carats = Object.entries(data.data).sort((a, b) => {
        const numA = parseInt(a[0].replace('K', ''));
        const numB = parseInt(b[0].replace('K', ''));
        return numA - numB;
      });

      const maxPrice = Math.max(...carats.map(([, v]) => v.price));

      // Build table
      const tableWrap = createElement('div', { class: 'table-container' });
      const table = createElement('table', { class: 'data-table carat-table' });
      table.innerHTML = `
        <thead>
          <tr>
            <th>Carat</th>
            <th>Purity</th>
            <th>Price (${base}/gram)</th>
            <th>Relative</th>
          </tr>
        </thead>
      `;

      const tbody = createElement('tbody');

      for (const [carat, info] of carats) {
        const barWidth = maxPrice > 0 ? (info.price / maxPrice) * 100 : 0;
        const row = createElement('tr');
        row.innerHTML = `
          <td><strong>${carat}</strong></td>
          <td>${(info.purity * 100).toFixed(1)}%</td>
          <td>${base} ${formatPrice(info.price)}</td>
          <td>
            <div class="carat-bar-container">
              <div class="carat-bar" style="width: ${barWidth}%; opacity: ${0.4 + info.purity * 0.6}"></div>
            </div>
          </td>
        `;
        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      tableWrap.appendChild(table);
      tableSection.appendChild(tableWrap);
    } catch (err) {
      removeSpinner(spinner);
      showError(container, `Failed to load carat data: ${(err as Error).message}`);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = 'Fetch Carat Prices';
    }
  }

  fetchBtn.addEventListener('click', loadData);
}
