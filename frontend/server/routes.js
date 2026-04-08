const { execSync } = require('child_process');

const BASE_URL = 'https://api.metalpriceapi.com/v1';
let symbolsCache = null;
let symbolsCacheTime = 0;
const SYMBOLS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Make API request. Tries the metalpriceapi library first, then falls back to
 * curl for environments where Node.js DNS resolution is restricted.
 */
function apiRequest(api, endpoint, params) {
  const cleanParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') cleanParams[k] = v;
  }
  const apiKey = api.apiKey || api;

  // Try library (axios), fall back to curl on any network/Cloudflare error
  const axios = require('axios');
  const url = `${BASE_URL}${endpoint}`;
  return axios({ url, params: { api_key: apiKey, ...cleanParams } })
    .then(r => r.data)
    .catch(() => {
      const qs = new URLSearchParams({ api_key: apiKey, ...cleanParams }).toString();
      const fullUrl = `${BASE_URL}${endpoint}?${qs}`;
      const result = execSync(`curl -s --max-time 15 '${fullUrl}'`, { encoding: 'utf-8' });
      const data = JSON.parse(result);
      if (data.success === false) throw new Error(data.error || 'API error');
      return data;
    });
}

function handler(fn) {
  return async (req, res) => {
    try {
      const data = await fn(req);
      res.json(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error || err.message || 'Internal server error';
      res.status(status).json({ success: false, error: message });
    }
  };
}

module.exports = function (app, api) {
  app.get('/api/symbols', async (_req, res) => {
    try {
      const now = Date.now();
      if (symbolsCache && now - symbolsCacheTime < SYMBOLS_CACHE_TTL) {
        return res.json(symbolsCache);
      }
      const data = await apiRequest(api, '/symbols', {});
      symbolsCache = data;
      symbolsCacheTime = now;
      res.json(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error || err.message || 'Internal server error';
      res.status(status).json({ success: false, error: message });
    }
  });

  app.get('/api/live', handler((req) => {
    const { base, currencies, unit, purity, math } = req.query;
    return apiRequest(api, '/latest', { base, currencies, unit, purity, math });
  }));

  app.get('/api/historical', handler((req) => {
    const { date, base, currencies, unit } = req.query;
    return apiRequest(api, `/${date}`, { base, currencies, unit });
  }));

  app.get('/api/hourly', handler((req) => {
    const { base, currency, unit, start_date, end_date, math, date_type } = req.query;
    return apiRequest(api, '/hourly', { base, currency, unit, start_date, end_date, math, date_type });
  }));

  app.get('/api/ohlc', handler((req) => {
    const { base, currency, date, unit, date_type } = req.query;
    return apiRequest(api, '/ohlc', { base, currency, date, unit, date_type });
  }));

  app.get('/api/timeframe', handler((req) => {
    const { start_date, end_date, base, currencies, unit } = req.query;
    return apiRequest(api, '/timeframe', { start_date, end_date, base, currencies, unit });
  }));

  app.get('/api/change', handler((req) => {
    const { start_date, end_date, base, currencies, date_type } = req.query;
    return apiRequest(api, '/change', { start_date, end_date, base, currencies, date_type });
  }));

  app.get('/api/carat', handler((req) => {
    const { base, currency, date } = req.query;
    return apiRequest(api, '/carat', { base, currency, date });
  }));

  app.get('/api/usage', handler(() => {
    return apiRequest(api, '/usage', {});
  }));
};
