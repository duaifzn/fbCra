const puppeteer = require('puppeteer');
const config = require('../config/config');
const fbCrawler = require('./fbCrawler.js');
const profileCrawler = require('./profileCrawler.js');
//fb登入帳密
const email = config.email;
const password = config.password;
const targetUrls = config.targetUrls;

module.exports = async () => {
  //windows
  const browser = await puppeteer.launch({ headless: false });
  //linux
  //const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  let page = await browser.newPage();

  await page.goto('https://zh-tw.facebook.com/');
  await page.waitForSelector('#email');
  await page.type('#email', email, { delay: 100 });
  await page.waitForSelector('#pass');
  await page.type('#pass', password, { delay: 100 });
  await page.click('button[name="login"]');
  await page.waitForTimeout(10000);
  for (let i = 0; i < targetUrls.length; i++) {
    await fbCrawler(page, targetUrls[i]);
  }
  await profileCrawler(page);
  await browser.close();
};
