const {redis} = require('../server.js');
const cheerio = require('cheerio');
const Profile = require('../classes/profile.js');
const {writeProfileToDb} = require('../services/fbService.js');
//主頁個人照 tag
const profileTag = 'div[class="l9j0dhe7 dp1hu0rb cbu4d94t j83agx80"] > div:nth-child(1)';
//簡介 tag
const aboutTag = 'div[class="j83agx80 l9j0dhe7 k4urcfbm"]';
//朋友數 tag
const friendValueTag = 'span[class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql b0tq1wua e9vueds3 j5wam9gi knj5qynh m9osqain"]';

module.exports = async (page) =>{
  for await(url of await redis.keys('*')){
    let profile = new Profile;
    profile.realUrl = url;
    profile.uuid = await redis.get(url);
    await page.goto(url)
    await page.waitForTimeout(5000);
    //await page.mouse.click(100, 100);
    const html = await page.content();
    const $ = cheerio.load(html);

    let $3 = cheerio.load($(profileTag).html());
    //背景圖
    $3('img').each((i, elem) => {
      if (i == 1) profile.backgroundImageUrl = $3(elem).attr('src');
    });
    //大頭照
    $3('image').each((i, elem) => {
      if ($3(elem).attr('href')) profile.profileImageUrl = $3(elem).attr('href');
    });
    //粉絲頁名稱
    $3('h1').each((i, elem) => {
      profile.name = $3(elem).text();
    });
    $3('h2').each((i, elem) => {
      profile.name = $3(elem).text();
    });
    //朋友數
    profile.friendValue = $(friendValueTag).text();

    $(aboutTag).each((i, elem) =>{
      if($(elem).text().includes('簡介')){
        //爬取個資
        const $2 = cheerio.load($(elem).html());
        $2('ul > div').each((i, elem2) =>{
          if($2(elem2).text().includes('現居')){
            profile.residence = $2(elem2).text().replace('現居', '')
          }
          if($2(elem2).text().includes('來自')){
            profile.from = $2(elem2).text().replace('來自', '')
          }
        })
      }
    })
    await writeProfileToDb(profile);
    
  }
}
