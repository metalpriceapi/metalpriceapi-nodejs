const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const api = require('../../index');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const apiKey = process.env.METALPRICEAPI_KEY;
if (!apiKey || apiKey === 'your_api_key_here') {
  console.warn('WARNING: No valid METALPRICEAPI_KEY found in frontend/.env');
  console.warn('Copy frontend/.env.example to frontend/.env and add your API key');
}
api.setAPIKey(apiKey || '');

routes(app, api);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Metal Price API proxy server running on http://localhost:${PORT}`);
});
