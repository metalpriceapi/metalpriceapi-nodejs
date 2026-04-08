export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: (HTMLElement | string)[] = [],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }
  return el;
}

export function createSelect(
  id: string,
  options: { value: string; label: string }[],
  defaultValue?: string,
): HTMLSelectElement {
  const select = createElement('select', { id, class: 'control-select' });
  for (const opt of options) {
    const option = createElement('option', { value: opt.value }, [opt.label]);
    if (opt.value === defaultValue) option.selected = true;
    select.appendChild(option);
  }
  return select;
}

export function createDateInput(id: string, defaultValue?: string): HTMLInputElement {
  const input = createElement('input', {
    type: 'date',
    id,
    class: 'control-date',
  }) as HTMLInputElement;
  if (defaultValue) input.value = defaultValue;
  return input;
}

export function createButton(text: string, className = 'btn-primary'): HTMLButtonElement {
  return createElement('button', { class: `btn ${className}` }, [text]) as HTMLButtonElement;
}

export function createControlGroup(label: string, control: HTMLElement): HTMLDivElement {
  const group = createElement('div', { class: 'control-group' });
  const labelEl = createElement('label', { class: 'control-label' }, [label]);
  group.appendChild(labelEl);
  group.appendChild(control);
  return group;
}

export function showSpinner(container: HTMLElement): HTMLDivElement {
  const spinner = createElement('div', { class: 'spinner' });
  spinner.innerHTML = '<div class="spinner-ring"></div>';
  container.appendChild(spinner);
  return spinner;
}

export function removeSpinner(spinner: HTMLDivElement): void {
  spinner.remove();
}

export function showError(container: HTMLElement, message: string): HTMLDivElement {
  const existing = container.querySelector('.error-message');
  if (existing) existing.remove();
  const errorDiv = createElement('div', { class: 'error-message' }, [message]);
  container.prepend(errorDiv);
  return errorDiv;
}

export function clearError(container: HTMLElement): void {
  const existing = container.querySelector('.error-message');
  if (existing) existing.remove();
}

export function formatPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (value >= 1) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  return value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysAgoStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}
