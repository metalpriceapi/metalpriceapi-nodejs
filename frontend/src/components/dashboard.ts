import '../styles/dashboard.css';
import { fetchLive, fetchChange } from '../api';
import { METALS, UNITS, type MetalCode, type UnitType } from '../types';
import {
  createElement,
  createSelect,
  createControlGroup,
  showSpinner,
  removeSpinner,
  showError,
  clearError,
  formatPrice,
  formatPercent,
  daysAgoStr,
  todayStr,
} from './common';

export function renderDashboard(container: HTMLElement): void {
  // Controls
  const controls = createElement('div', { class: 'controls' });

  const baseSelect = createSelect('dash-base', [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'CHF', label: 'CHF' },
  ], 'USD');

  const unitSelect = createSelect('dash-unit',
    UNITS.map(u => ({ value: u.value, label: u.label })),
    'troy_oz',
  );

  const refreshLabel = createElement('label', { class: 'control-checkbox' });
  const refreshCheck = createElement('input', { type: 'checkbox', id: 'dash-autorefresh' }) as HTMLInputElement;
  refreshLabel.appendChild(refreshCheck);
  refreshLabel.appendChild(document.createTextNode('Auto-refresh (60s)'));

  controls.appendChild(createControlGroup('Base Currency', baseSelect));
  controls.appendChild(createControlGroup('Unit', unitSelect));
  controls.appendChild(createControlGroup('', refreshLabel));
  container.appendChild(controls);

  // Cards container
  const cardsGrid = createElement('div', { class: 'cards-grid', id: 'dash-cards' });
  container.appendChild(cardsGrid);

  // Last updated
  const statusLine = createElement('div', { class: 'dash-status' });
  container.appendChild(statusLine);

  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  async function loadData() {
    const base = baseSelect.value;
    const unit = unitSelect.value as UnitType;
    const metalCodes = METALS.map(m => m.code);

    clearError(container);
    cardsGrid.innerHTML = '';
    const spinner = showSpinner(cardsGrid);

    try {
      const [liveData, changeData] = await Promise.all([
        fetchLive(base, metalCodes, unit),
        fetchChange(daysAgoStr(1), todayStr(), base, metalCodes).catch(() => null),
      ]);

      removeSpinner(spinner);

      for (const metal of METALS) {
        const rate = liveData.rates[metal.code];
        if (rate === undefined) continue;

        // Metal prices from the API are inverted (1/price) when base is a fiat currency
        const price = rate < 1 ? 1 / rate : rate;

        const changeInfo = changeData?.rates?.[metal.code];
        const changePct = changeInfo?.change_pct ?? 0;
        const changeAbs = changeInfo?.change ?? 0;
        const isPositive = changePct >= 0;

        const card = createElement('div', { class: 'card' });
        card.innerHTML = `
          <div class="card-header">
            <span class="card-metal-name">${metal.name}</span>
            <span class="card-metal-code">${metal.code}</span>
          </div>
          <div class="card-price" style="color: ${metal.color}">
            ${base} ${formatPrice(price)}
          </div>
          <div class="card-change ${isPositive ? 'positive' : 'negative'}">
            ${formatPercent(changePct)} (${isPositive ? '+' : ''}${formatPrice(Math.abs(changeAbs))})
          </div>
        `;
        cardsGrid.appendChild(card);
      }

      statusLine.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (err) {
      removeSpinner(spinner);
      showError(container, `Failed to load prices: ${(err as Error).message}`);
    }
  }

  // Event listeners
  baseSelect.addEventListener('change', loadData);
  unitSelect.addEventListener('change', loadData);
  refreshCheck.addEventListener('change', () => {
    if (refreshCheck.checked) {
      refreshInterval = setInterval(loadData, 60000);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  });

  loadData();
}
