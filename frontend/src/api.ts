import type {
  LiveResponse,
  TimeframeResponse,
  ChangeResponse,
  OHLCResponse,
  HourlyResponse,
  CaratResponse,
  SymbolsResponse,
  UsageResponse,
} from './types';

async function request<T>(url: string, params: Record<string, string | undefined> = {}): Promise<T> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  }
  const query = searchParams.toString();
  const fullUrl = query ? `${url}?${query}` : url;

  const res = await fetch(fullUrl);
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export function fetchSymbols(): Promise<SymbolsResponse> {
  return request<SymbolsResponse>('/api/symbols');
}

export function fetchLive(base?: string, currencies?: string[], unit?: string): Promise<LiveResponse> {
  return request<LiveResponse>('/api/live', {
    base,
    currencies: currencies?.join(','),
    unit,
  });
}

export function fetchTimeframe(
  startDate: string,
  endDate: string,
  base?: string,
  currencies?: string[],
  unit?: string,
): Promise<TimeframeResponse> {
  return request<TimeframeResponse>('/api/timeframe', {
    start_date: startDate,
    end_date: endDate,
    base,
    currencies: currencies?.join(','),
    unit,
  });
}

export function fetchChange(
  startDate: string,
  endDate: string,
  base?: string,
  currencies?: string[],
): Promise<ChangeResponse> {
  return request<ChangeResponse>('/api/change', {
    start_date: startDate,
    end_date: endDate,
    base,
    currencies: currencies?.join(','),
  });
}

export function fetchOHLC(
  base: string,
  currency: string,
  date: string,
  unit?: string,
): Promise<OHLCResponse> {
  return request<OHLCResponse>('/api/ohlc', {
    base,
    currency,
    date,
    unit,
  });
}

export function fetchHourly(
  base: string,
  currency: string,
  unit: string,
  startDate: string,
  endDate: string,
): Promise<HourlyResponse> {
  return request<HourlyResponse>('/api/hourly', {
    base,
    currency,
    unit,
    start_date: startDate,
    end_date: endDate,
  });
}

export function fetchCarat(base?: string, currency?: string, date?: string): Promise<CaratResponse> {
  return request<CaratResponse>('/api/carat', { base, currency, date });
}

export function fetchUsage(): Promise<UsageResponse> {
  return request<UsageResponse>('/api/usage');
}
