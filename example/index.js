const api = require('../index');
// const api = require('metalpriceapi');

const apiKey = 'REPLACE_ME';

(async function() {
  api.setAPIKey(apiKey);

  var result;

  result = await api.fetchSymbols();
  console.log(result.data);

  result = await api.fetchLive('USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);

  result = await api.fetchHistorical('2024-02-05', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);

  result = await api.convert('USD', 'EUR', 100, '2024-02-05');
  console.log(result.data);

  result = await api.timeframe('2024-02-05', '2024-02-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);

  result = await api.change('2024-02-05', '2024-02-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);
})();
