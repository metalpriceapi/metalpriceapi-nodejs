let symbolsCache = null;
let symbolsCacheTime = 0;
const SYMBOLS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function handler(fn) {
  return async (req, res) => {
    try {
      const result = await fn(req);
      res.json(result.data);
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
      const result = await api.fetchSymbols();
      symbolsCache = result.data;
      symbolsCacheTime = now;
      res.json(result.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error || err.message || 'Internal server error';
      res.status(status).json({ success: false, error: message });
    }
  });

  app.get('/api/live', handler((req) => {
    const { base, currencies, unit, purity, math } = req.query;
    const currArr = currencies ? currencies.split(',') : undefined;
    return api.fetchLive(base, currArr, unit, purity, math);
  }));

  app.get('/api/historical', handler((req) => {
    const { date, base, currencies, unit } = req.query;
    const currArr = currencies ? currencies.split(',') : undefined;
    return api.fetchHistorical(date, base, currArr, unit);
  }));

  app.get('/api/hourly', handler((req) => {
    const { base, currency, unit, start_date, end_date, math, date_type } = req.query;
    return api.hourly(base, currency, unit, start_date, end_date, math, date_type);
  }));

  app.get('/api/ohlc', handler((req) => {
    const { base, currency, date, unit, date_type } = req.query;
    return api.ohlc(base, currency, date, unit, date_type);
  }));

  app.get('/api/timeframe', handler((req) => {
    const { start_date, end_date, base, currencies, unit } = req.query;
    const currArr = currencies ? currencies.split(',') : undefined;
    return api.timeframe(start_date, end_date, base, currArr, unit);
  }));

  app.get('/api/change', handler((req) => {
    const { start_date, end_date, base, currencies, date_type } = req.query;
    const currArr = currencies ? currencies.split(',') : undefined;
    return api.change(start_date, end_date, base, currArr, date_type);
  }));

  app.get('/api/carat', handler((req) => {
    const { base, currency, date } = req.query;
    return api.carat(base, currency, date);
  }));

  app.get('/api/usage', handler(() => {
    return api.usage();
  }));
};
