const { timeout } = require('./helpers/timeout.js');
const fbCrawlerMain = require('./controller/fbCrawlerMain.js');
const schedule = require('node-schedule');

//先跑第一次fbCrawler
(async () => {
  console.log('run fbCrawler first time!!');
  await fbCrawlerMain();
})();
//跑排程
schedule.scheduleJob('0 */6 * * *', async () => {
  console.log('RUN schedule!!!!!!!!!');
  await fbCrawlerMain();
});
