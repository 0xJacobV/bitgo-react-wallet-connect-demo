const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '.env.local')});
const { createProxyMiddleware } = require('http-proxy-middleware');

// This *must* match the environment you are using in the create-wallet script
const bitgoApi = 'https://app.bitgo-test.com';
const secretAccessToken = process.env.SECRET_ACCESS_TOKEN;

app.all('*', function(req, res, next) {
  console.log(`received: ${req.method} ${req.url} ${JSON.stringify(req.body)}\n`);
  console.log(`headers: ${JSON.stringify(req.headers)}\n`);
  req.headers.authorization = `Bearer ${secretAccessToken}`;
  req.headers.origin = bitgoApi;
  console.log(`new headers: ${JSON.stringify(req.headers)}\n\n\n`);
  next();
});

app.use(
  '/',
  createProxyMiddleware({
    target: bitgoApi,
    changeOrigin: true,
  })
);

app.use(cors())

app.get('localhost:3000/api/v2', cors(), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for only example.com.'})
})

const port = 3000;
app.listen(port, function () {
  console.log(`Proxy POC listening at http://localhost:${port}`);
});

