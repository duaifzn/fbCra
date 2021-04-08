const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const { getDbData , uuidFindProfile} = require('./services/fbService.js');
const config = require('./config/config.js');
const ioRedis = require("ioredis");
const redis = new ioRedis();


app.use(function(req, res, next) {
  const allowedOrigins = config.allowedOrigins;
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.get('/', async (req, res) => {
  res.send(await getDbData());
});
app.get('/profile/:uuid', async (req, res) => {
  res.send(await uuidFindProfile(req.params.uuid));
});

app.listen(port, () => {
  console.log(`fb crawler server running on port ${port}`);
  //跑排程
  require('./schedule.js');
});

module.exports = {redis};