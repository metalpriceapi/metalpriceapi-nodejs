import '../styles/ohlc.css';
import { fetchOHLC, fetchHourly } from '../api';
import { METALS, UNITS, type UnitType } from '../types';
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
  daysAgoStr,
} from './common';

export function renderOHLC(container: HTMLElement): void {
  // Controls
  const controls = createElement('div', { class: 'controls' });

  const metalSelect = createSelect('ohlc-metal',
    METALS.map(m => ({ value: m.code, label: `${m.name} (${m.code})` })),
    'XAU',
  );

  const baseSelect = createSelect('ohlc-base', [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
  ], 'USD');

  const unitSelect = createSelect('ohlc-unit',
    UNITS.map(u => ({ value: u.value, label: u.label })),
    'troy_oz',
  );

  const dateInput = createDateInput('ohlc-date', daysAgoStr(1));
  const fetchBtn = createButton('Fetch Data');

  controls.appendChild(createControlGroup('Metal', metalSelect));
  controls.appendChild(createControlGroup('Date', dateInput));
  controls.appendChild(createControlGroup('Base', baseSelect));
  controls.appendChild(createControlGroup('Unit', unitSelect));
  controls.appendChild(createControlGroup('', fetchBtn));
  container.appendChild(controls);

  // OHLC display
  const ohlcSection = createElement('div', { id: 'ohlc-display' });
  container.appendChild(ohlcSection);

  // Hourly table
  const hourlySection = createElement('div', { id: 'hourly-display' });
  container.appendChild(hourlySection);

  async function loadData() {
    const metal = metalSelect.value;
    const base = baseSelect.value;
    const unit = unitSelect.value as UnitType;
    const date = dateInput.value;

    if (!date) {
      showError(container, 'Please select a date.');
      return;
    }

    clearError(container);
    ohlcSection.innerHTML = '';
    hourlySection.innerHTML = '';
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Loading...';

    const spinner = showSpinner(ohlcSection);

    try {
      const [ohlcData, hourlyData] = await Promise.allSettled([
        fetchOHLC(base, metal, date, unit),
        fetchHourly(base, metal, unit, date, date),
      ]);

      removeSpinner(spinner);

      // Render OHLC
      if (ohlcData.status === 'fulfilled') {
        const rates = ohlcData.value.rates;
        const metalInfo = METALS.find(m => m.code === metal)!;

        const title = createElement('h3', { class: 'section-title' }, [
          `${metalInfo.name} OHLC - ${date}`,
        ]);
        ohlcSection.appendChild(title);

        const grid = createElement('div', { class: 'ohlc-grid' });
        const items = [
          { label: 'Open', value: rates.open },
          { label: 'High', value: rates.high },
          { label: 'Low', value: rates.low },
          { label: 'Close', value: rates.close },
        ];

        for (const item of items) {
          const price = item.value < 1 ? 1 / item.value : item.value;
          const el = createElement('div', { class: 'ohlc-item' });
          el.innerHTML = `
            <div class="ohlc-label">${item.label}</div>
            <div class="ohlc-value" style="color: ${metalInfo.color}">${base} ${formatPrice(price)}</div>
          `;
          grid.appendChild(el);
        }
        ohlcSection.appendChild(grid);
      } else {
        showError(ohlcSection, `OHLC error: ${ohlcData.reason?.message || 'Unknown error'}`);
      }

      // Render Hourly
      if (hourlyData.status === 'fulfilled' && hourlyData.value.rates) {
        const title = createElement('h3', { class: 'section-title' }, ['Hourly Data']);
        hourlySection.appendChild(title);

        const tableWrap = createElement('div', { class: 'table-container' });
        const table = createElement('table', { class: 'data-table' });
        table.innerHTML = `
          <thead>
            <tr>
              <th>Time</th>
              <th>Price (${base})</th>
            </tr>
          </thead>
        `;
        const tbody = createElement('tbody');

        const timestamps = Object.keys(hourlyData.value.rates).sort();
        for (const ts of timestamps) {
          const rateObj = hourlyData.value.rates[ts];
          const rate = rateObj[metal] ?? rateObj[Object.keys(rateObj)[0]];
          if (rate === undefined) continue;

          const price = rate < 1 ? 1 / rate : rate;
          const row = createElement('tr');
          row.innerHTML = `
            <td>${ts}</td>
            <td>${formatPrice(price)}</td>
          `;
          tbody.appendChild(row);
        }

        table.appendChild(tbody);
        tableWrap.appendChild(table);
        hourlySection.appendChild(tableWrap);
      } else if (hourlyData.status === 'rejected') {
        showError(hourlySection, `Hourly error: ${hourlyData.reason?.message || 'Unknown error'}`);
      }
    } catch (err) {
      removeSpinner(spinner);
      showError(container, `Failed to load data: ${(err as Error).message}`);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = 'Fetch Data';
    }
  }

  fetchBtn.addEventListener('click', loadData);
}
