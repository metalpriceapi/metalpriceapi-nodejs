export interface LiveResponse {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
  unit: string;
}

export interface HistoricalResponse {
  success: boolean;
  historical: boolean;
  date: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
  unit: string;
}

export interface TimeframeResponse {
  success: boolean;
  timeseries: boolean;
  start_date: string;
  end_date: string;
  base: string;
  rates: Record<string, Record<string, number>>;
  unit: string;
}

export interface ChangeResponse {
  success: boolean;
  change: boolean;
  start_date: string;
  end_date: string;
  base: string;
  rates: Record<string, {
    start_rate: number;
    end_rate: number;
    change: number;
    change_pct: number;
  }>;
}

export interface OHLCResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
}

export interface HourlyResponse {
  success: boolean;
  base: string;
  rates: Record<string, Record<string, number>>;
}

export interface CaratResponse {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  data: Record<string, { price: number; purity: number }>;
}

export interface SymbolsResponse {
  success: boolean;
  symbols: Record<string, string>;
}

export interface UsageResponse {
  success: boolean;
  usage: {
    current_month: number;
    allowance: number;
    remaining: number;
  };
}

export type MetalCode = 'XAU' | 'XAG' | 'XPD' | 'XPT';
export type UnitType = 'troy_oz' | 'gram' | 'kilogram';

export const METALS: { code: MetalCode; name: string; color: string }[] = [
  { code: 'XAU', name: 'Gold', color: '#FFD700' },
  { code: 'XAG', name: 'Silver', color: '#C0C0C0' },
  { code: 'XPD', name: 'Palladium', color: '#CED0DD' },
  { code: 'XPT', name: 'Platinum', color: '#E5E4E2' },
];

export const UNITS: { value: UnitType; label: string }[] = [
  { value: 'troy_oz', label: 'Troy Oz' },
  { value: 'gram', label: 'Gram' },
  { value: 'kilogram', label: 'Kilogram' },
];
