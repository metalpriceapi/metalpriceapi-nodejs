const api = require('../index');
// const api = require('metalpriceapi');

const apiKey = 'REPLACE_ME';

(async function() {
  api.setAPIKey(apiKey);

  var result;

  result = await api.fetchSymbols();
  console.log(result.data);

  result = await api.fetchLive('USD', ['XAU', 'XAG', 'XPD', 'XPT'], 'troy_oz', null, null);
  console.log(result.data);

  result = await api.fetchHistorical('2024-02-05', 'USD', ['XAU', 'XAG', 'XPD', 'XPT'], 'troy_oz');
  console.log(result.data);

  result = await api.hourly('USD', 'XAU', 'troy_oz', '2025-11-03', '2025-11-03', null, null);
  console.log(result.data);

  result = await api.ohlc('USD', 'XAU', '2024-02-06', 'troy_oz', null);
  console.log(result.data);

  result = await api.convert('USD', 'EUR', 100, '2024-02-05', null);
  console.log(result.data);

  result = await api.timeframe('2024-02-05', '2024-02-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT'], 'troy_oz');
  console.log(result.data);

  result = await api.change('2024-02-05', '2024-02-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT'], null);
  console.log(result.data);

  result = await api.carat('USD', 'XAU', '2024-02-06');
  console.log(result.data);

  result = await api.usage();
  console.log(result.data);
})();
