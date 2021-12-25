const api = require('../index');

const apiKey = 'REPLACE_ME';

(async function() {
  api.setAPIKey(apiKey);

  var result;

  result = await api.fetchSymbols();
  console.log(result.data);

  result = await api.fetchLive('USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);

  result = await api.fetchHistorical('2021-04-05', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);

  result = await api.convert('USD', 'EUR', 100, '2021-04-05');
  console.log(result.data);

  result = await api.timeframe('2021-04-05', '2021-04-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);

  result = await api.change('2021-04-05', '2021-04-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
  console.log(result.data);
})();
