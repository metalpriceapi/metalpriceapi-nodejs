import { createElement } from './common';
import { fetchUsage } from '../api';

export type TabId = 'dashboard' | 'historical' | 'ohlc' | 'carat';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'historical', label: 'Historical Chart' },
  { id: 'ohlc', label: 'OHLC & Hourly' },
  { id: 'carat', label: 'Carat Prices' },
];

export function renderHeader(
  container: HTMLElement,
  onTabChange: (tabId: TabId) => void,
): { setActiveTab: (tabId: TabId) => void } {
  const header = createElement('header', { class: 'app-header' });

  const title = createElement('div', { class: 'app-title' });
  title.innerHTML = '<span>Au</span> Metal Price API';
  header.appendChild(title);

  const headerRight = createElement('div', { class: 'header-right' });

  const usageBadge = createElement('span', { class: 'usage-badge' }, ['Loading usage...']);
  headerRight.appendChild(usageBadge);

  const themeBtn = createElement('button', { class: 'theme-toggle' }, [
    document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀️',
  ]);
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
  });
  headerRight.appendChild(themeBtn);

  header.appendChild(headerRight);
  container.appendChild(header);

  // Navigation
  const nav = createElement('nav', { class: 'nav-tabs' });
  const tabButtons = new Map<TabId, HTMLButtonElement>();

  for (const tab of TABS) {
    const btn = createElement('button', {
      class: `nav-tab${tab.id === 'dashboard' ? ' active' : ''}`,
    }, [tab.label]);
    btn.addEventListener('click', () => onTabChange(tab.id));
    tabButtons.set(tab.id, btn);
    nav.appendChild(btn);
  }

  container.appendChild(nav);

  // Load usage
  fetchUsage()
    .then((data) => {
      usageBadge.textContent = `API: ${data.usage.current_month}/${data.usage.allowance}`;
    })
    .catch(() => {
      usageBadge.textContent = 'API: --';
    });

  return {
    setActiveTab(tabId: TabId) {
      tabButtons.forEach((btn, id) => {
        btn.classList.toggle('active', id === tabId);
      });
    },
  };
}
