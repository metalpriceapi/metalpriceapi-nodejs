(function() {
  const axios = require('axios');

  var apiKey;
  var baseUrl = 'https://api.metalpriceapi.com/v1';

  function removeEmpty(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
    return obj;
  }

  exports.setAPIKey = function(apiKey) {
    this.apiKey = apiKey;
  };

  exports.setServer = function(server) {
    if (server === 'eu') {
      baseUrl = 'https://api-eu.metalpriceapi.com/v1';
    } else {
      baseUrl = 'https://api.metalpriceapi.com/v1';
    }
  };

  exports.fetchSymbols = function() {
    return axios({
      url: `${baseUrl}/symbols`,
      params: {
        api_key: this.apiKey,
      },
    });
  };

  exports.fetchLive = function(base, currencies, unit, purity, math) {
    return axios({
      url: `${baseUrl}/latest`,
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currencies: (currencies || []).join(','),
        unit: unit,
        purity: purity,
        math: math,
      }),
    });
  };

  exports.fetchHistorical = function(date, base, currencies, unit) {
    return axios({
      url: `${baseUrl}/${date}`,
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currencies: (currencies || []).join(','),
        unit: unit,
      }),
    });
  };

  exports.hourly = function(base, currency, unit, startDate, endDate, math, dateType) {
    return axios({
      url: `${baseUrl}/hourly`,
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currency: currency,
        unit: unit,
        start_date: startDate,
        end_date: endDate,
        math: math,
        date_type: dateType,
      }),
    });
  }

  exports.ohlc = function(base, currency, date, unit, dateType) {
    return axios({
      url: `${baseUrl}/ohlc`,
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currency: currency,
        date: date,
        unit: unit,
        date_type: dateType,
      }),
    });
  }

  exports.convert = function(from, to, amount, date, unit) {
    return axios({
      url: `${baseUrl}/convert`,
      params: removeEmpty({
        api_key: this.apiKey,
        from: from,
        to: to,
        amount: amount,
        date: date,
        unit: unit,
      }),
    });
  };

  exports.timeframe = function(startDate, endDate, base, currencies, unit) {
    return axios({
      url: `${baseUrl}/timeframe`,
      params: removeEmpty({
        api_key: this.apiKey,
        start_date: startDate,
        end_date: endDate,
        base: base,
        currencies: (currencies || []).join(','),
        unit: unit,
      }),
    });
  };

  exports.change = function(startDate, endDate, base, currencies, dateType) {
    return axios({
      url: `${baseUrl}/change`,
      params: removeEmpty({
        api_key: this.apiKey,
        start_date: startDate,
        end_date: endDate,
        base: base,
        currencies: (currencies || []).join(','),
        date_type: dateType,
      }),
    });
  }

  exports.carat = function(base, currency, date) {
    return axios({
      url: `${baseUrl}/carat`,
      params: removeEmpty({
        api_key: this.apiKey,
        base: base,
        currency: currency,
        date: date,
      }),
    });
  }

  exports.usage = function() {
    return axios({
      url: `${baseUrl}/usage`,
      params: removeEmpty({
        api_key: this.apiKey,
      }),
    });
  }
})();
