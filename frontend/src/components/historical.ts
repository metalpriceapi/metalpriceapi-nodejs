import '../styles/historical.css';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
import { fetchTimeframe } from '../api';
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
  daysAgoStr,
  todayStr,
} from './common';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export function renderHistorical(container: HTMLElement): void {
  // Controls
  const controls = createElement('div', { class: 'controls' });

  const metalSelect = createSelect('hist-metals',
    METALS.map(m => ({ value: m.code, label: `${m.name} (${m.code})` })),
    'XAU',
  );
  metalSelect.multiple = true;
  metalSelect.size = 4;
  // Select all by default
  Array.from(metalSelect.options).forEach(opt => opt.selected = true);

  const baseSelect = createSelect('hist-base', [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
  ], 'USD');

  const unitSelect = createSelect('hist-unit',
    UNITS.map(u => ({ value: u.value, label: u.label })),
    'troy_oz',
  );

  const startDate = createDateInput('hist-start', daysAgoStr(7));
  const endDate = createDateInput('hist-end', todayStr());

  const fetchBtn = createButton('Fetch Data');

  controls.appendChild(createControlGroup('Metals', metalSelect));
  controls.appendChild(createControlGroup('Start Date', startDate));
  controls.appendChild(createControlGroup('End Date', endDate));
  controls.appendChild(createControlGroup('Base', baseSelect));
  controls.appendChild(createControlGroup('Unit', unitSelect));
  controls.appendChild(createControlGroup('', fetchBtn));
  container.appendChild(controls);

  // Chart container
  const chartContainer = createElement('div', { class: 'chart-container' });
  const canvas = createElement('canvas', { id: 'hist-chart' });
  chartContainer.appendChild(canvas);
  container.appendChild(chartContainer);

  let chart: Chart | null = null;

  async function loadData() {
    const selectedMetals = Array.from(metalSelect.selectedOptions).map(o => o.value);
    if (selectedMetals.length === 0) {
      showError(container, 'Please select at least one metal.');
      return;
    }

    const base = baseSelect.value;
    const unit = unitSelect.value as UnitType;

    clearError(container);
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Loading...';

    try {
      const data = await fetchTimeframe(
        startDate.value,
        endDate.value,
        base,
        selectedMetals,
        unit,
      );

      const dates = Object.keys(data.rates).sort();

      const datasets = selectedMetals.map(code => {
        const metal = METALS.find(m => m.code === code)!;
        const values = dates.map(d => {
          const rate = data.rates[d]?.[code];
          if (rate === undefined) return null;
          return rate < 1 ? 1 / rate : rate;
        });

        return {
          label: `${metal.name} (${code})`,
          data: values,
          borderColor: metal.color,
          backgroundColor: metal.color + '20',
          borderWidth: 2,
          pointRadius: dates.length > 30 ? 0 : 3,
          tension: 0.3,
          fill: false,
        };
      });

      if (chart) chart.destroy();

      chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: dates,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              labels: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue('--text-primary').trim(),
              },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed.y;
                  return `${ctx.dataset.label}: ${base} ${val?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue('--text-muted').trim(),
                maxTicksLimit: 12,
              },
              grid: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue('--border-color').trim(),
              },
            },
            y: {
              ticks: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue('--text-muted').trim(),
              },
              grid: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue('--border-color').trim(),
              },
            },
          },
        },
      });
    } catch (err) {
      showError(container, `Failed to load timeframe data: ${(err as Error).message}`);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = 'Fetch Data';
    }
  }

  fetchBtn.addEventListener('click', loadData);
}
