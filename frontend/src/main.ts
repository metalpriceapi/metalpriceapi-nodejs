import './styles/main.css';
import { renderHeader, type TabId } from './components/header';
import { renderDashboard } from './components/dashboard';
import { renderHistorical } from './components/historical';
import { renderOHLC } from './components/ohlc';
import { renderCarat } from './components/carat';
import { createElement } from './components/common';

// Apply saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

const app = document.getElementById('app')!;

// Create view containers
const views = new Map<TabId, HTMLDivElement>();
const viewRenderers: Record<TabId, (container: HTMLElement) => void> = {
  dashboard: renderDashboard,
  historical: renderHistorical,
  ohlc: renderOHLC,
  carat: renderCarat,
};

let currentTab: TabId = 'dashboard';
const initialized = new Set<TabId>();

function switchTab(tabId: TabId) {
  currentTab = tabId;
  header.setActiveTab(tabId);

  views.forEach((view, id) => {
    view.classList.toggle('active', id === tabId);
  });

  // Lazy-init view on first visit
  if (!initialized.has(tabId)) {
    initialized.add(tabId);
    const container = views.get(tabId)!;
    viewRenderers[tabId](container);
  }
}

// Render header
const header = renderHeader(app, switchTab);

// Create view containers
for (const tabId of ['dashboard', 'historical', 'ohlc', 'carat'] as TabId[]) {
  const view = createElement('div', {
    class: `view${tabId === 'dashboard' ? ' active' : ''}`,
    id: `view-${tabId}`,
  });
  views.set(tabId, view);
  app.appendChild(view);
}

// Initialize default view
initialized.add('dashboard');
renderDashboard(views.get('dashboard')!);
