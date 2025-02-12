# metalpriceapi

metalpriceapi is the official Node.js wrapper for MetalpriceAPI.com. This allows you to quickly integrate our metal price API and foreign exchange rate API into your application. Check https://metalpriceapi.com documentation for more information.



## Installation

#### NPM

```
$ npm i metalpriceapi
```
---
## Usage

```js
const api = require('metalpriceapi');

api.setAPIKey('SET_YOUR_API_KEY_HERE');
await api.fetchLive('USD', ['XAU', 'XAG', 'XPD', 'XPT']);
```
---
## Documentation

#### setAPIKey(apiKey)

- `apiKey` <[string]> API Key

In order to use this library, you must first call this function with an API key.

```js
api.setAPIKey('SET_YOUR_API_KEY_HERE');
```
---
#### fetchSymbols()
```js
await api.fetchSymbols();
```

[Link](https://metalpriceapi.com/documentation#api_symbol)

---
#### fetchLive(base, currencies)

- `base` <[string]> Optional. Pass in a base currency, defaults to USD.
- `currencies` <[Array]<[string]>> Optional. Pass in an array of currencies to return values for.

```js
await api.fetchLive('USD', ['XAU', 'XAG', 'XPD', 'XPT']);
```

[Link](https://metalpriceapi.com/documentation#api_realtime)

---
#### fetchHistorical(date, base, currencies)

- `date` <[string]> Required. Pass in a string with format `YYYY-MM-DD`
- `base` <[string]> Optional. Pass in a base currency, defaults to USD.
- `currencies` <[Array]<[string]>> Optional. Pass in an array of currencies to return values for.

```js
await api.fetchHistorical('2024-02-05', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
```

[Link](https://metalpriceapi.com/documentation#api_historical)

---
#### ohlc(base, currency, date, unit, dateType)

- `base` <[string]> Optional. Pass in a base currency, defaults to USD.
- `currency` <[string]> Required. Specify currency you would like to get OHLC for.
- `date` <[string]> Required. Specify date to get OHLC for specific date using format `YYYY-MM-DD`.
- `unit` <[string]> Optional. Pass in a unit, defaults to troy_oz.
- `dateType` <[string]> Optional. Pass in a date type, overrides date parameter if passed in.

```js
await api.ohlc('USD', 'XAU', '2024-02-06', 'troy_oz', null);
```

[Link](https://metalpriceapi.com/documentation#api_ohlc)

---
#### convert(from, to, amount, date)

- `from` <[string]> Optional. Pass in a base currency, defaults to USD.
- `to` <[string]> Required. Specify currency you would like to convert to.
- `amount` <[number]> Required. The amount to convert.
- `date` <[string]> Optional. Specify date to use historical midpoint value for conversion with format `YYYY-MM-DD`. Otherwise, it will use live exchange rate date if value not passed in.

```js
await api.convert('USD', 'EUR', 100, '2024-02-05');
```

[Link](https://metalpriceapi.com/documentation#api_convert)

---
#### timeframe(start_date, end_date, base, currencies)

- `start_date` <[string]> Required. Specify the start date of your timeframe using the format `YYYY-MM-DD`.
- `end_date` <[string]> Required. Specify the end date of your timeframe using the format `YYYY-MM-DD`.
- `base` <[string]> Optional. Pass in a base currency, defaults to USD.
- `currencies` <[Array]<[string]>> Optional. Pass in an array of currencies to return values for.

```js
await api.timeframe('2024-02-05', '2024-02-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
```

[Link](https://metalpriceapi.com/documentation#api_timeframe)

---
#### change(start_date, end_date, base, currencies)

- `start_date` <[string]> Required. Specify the start date of your timeframe using the format `YYYY-MM-DD`.
- `end_date` <[string]> Required. Specify the end date of your timeframe using the format `YYYY-MM-DD`.
- `base` <[string]> Optional. Pass in a base currency, defaults to USD.
- `currencies` <[Array]<[string]>> Optional. Pass in an array of currencies to return values for.

```js
await api.change('2024-02-05', '2024-02-06', 'USD', ['XAU', 'XAG', 'XPD', 'XPT']);
```

[Link](https://metalpriceapi.com/documentation#api_change)

---
#### carat(base, date)

- `base` <[string]> Optional. Pass in a base currency, defaults to USD.
- `date` <[string]> Optional. Specify date to get Carat for specific date using format `YYYY-MM-DD`. If not specified, uses live rates.

```js
await api.carat('USD', '2024-02-06');
```

[Link](https://metalpriceapi.com/documentation#api_carat)

---
#### usage()

```js
await api.usage();
```

[Link](https://metalpriceapi.com/documentation#api_usage)

---
**[Official documentation](https://metalpriceapi.com/documentation)**

---
## FAQ

- How do I get an API Key?

    Free API Keys are available [here](https://metalpriceapi.com).

- I want more information

    Checkout our FAQs [here](https://metalpriceapi.com/faq).


## Support

For support, get in touch using [this form](https://metalpriceapi.com/contact).


[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array 'Array'
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type 'Number'
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type 'String'