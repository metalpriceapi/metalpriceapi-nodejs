(function() {
  const axios = require('axios');

  var apiKey;

  function removeEmpty(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] == '') {
        delete obj[propName];
      }
    }
    return obj;
  }

  exports.setAPIKey = function(apiKey) {
    this.apiKey = apiKey;
  };

  exports.fetchSymbols = function() {
    return axios({
      url: 'https://api.metalpriceapi.com/v1/symbols',
      params: {
        api_key: this.apiKey,
      },
    });
  };

  exports.fetchLive = function(base, currencies) {
    return axios({
      url: 'https://api.metalpriceapi.com/v1/latest',
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currencies: (currencies || []).join(','),
      }),
    });
  };

  exports.fetchHistorical = function(date, base, currencies) {
    return axios({
      url: `https://api.metalpriceapi.com/v1/${date}`,
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currencies: (currencies || []).join(','),
      }),
    });
  };

  exports.convert = function(from, to, amount, date) {
    return axios({
      url: 'https://api.metalpriceapi.com/v1/convert',
      params: removeEmpty({
        api_key: this.apiKey,
        from: from,
        to: to,
        amount: amount,
        date: date,
      }),
    });
  };

  exports.timeframe = function(startDate, endDate, base, currencies) {
    return axios({
      url: 'https://api.metalpriceapi.com/v1/timeframe',
      params: removeEmpty({
        api_key: this.apiKey,
        start_date: startDate,
        end_date: endDate,
        base: base,
        currencies: (currencies || []).join(','),
      }),
    });
  };

  exports.change = function(startDate, endDate, base, currencies) {
    return axios({
      url: 'https://api.metalpriceapi.com/v1/change',
      params: removeEmpty({
        api_key: this.apiKey,
        start_date: startDate,
        end_date: endDate,
        base: base,
        currencies: (currencies || []).join(','),
      }),
    });
  }
})();
