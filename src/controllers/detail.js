const path = require('path');
const fs = require('fs');
const superagent = require('superagent');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const sleep = require('../utils/sleep');
const preset = require('../preset');
const saveToDist = require('../utils/save');

const parseHtml = (html) => {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);
    // pre tag data of code area
    const res = $('.prettyprint').text();
  });
}

const fetchDetail = (url) => {
  return new Promise((resolve, reject) => {
    // fetch detail page html
    superagent
      .get(url)
      .set('User-Agent', randomUseragent.getRandom())
      .retry(3)
      .end((err, res) => {
        if (!err) {
          // parse detail page html
          // parseHtml(res.text).then((data) => {
          //   resolve(data);
          // });
          saveToDist(`/detail/${(url.split('/') || [Date.now()]).pop()}`, res.text);
        } else {
          reject(err);
        }
      })
  }).catch(err => {
    throw err;
  });
}

const fetchDetails = async (entryList) => {
  console.log('[ok] fetch details : ');
  for (let i = 0; i < entryList.length; i++) {
    const link = entryList[i];
    const detailUrl = `${preset.prefix}${link}`;

    console.log(`[ing] fetch: ${decodeURIComponent(detailUrl)} ... `);
    await fetchDetail(detailUrl);
    // 随机间隔几秒后下一个
    const randomSleepSeconds = ~~(Math.random() * 10) * 1000;
    console.log(`[ing] ok, fetch next after ${randomSleepSeconds} seconds... `)
    await sleep(randomSleepSeconds);
  }

  return Promise.all(fetchEntryListPromises);
}


module.exports = fetchDetails;
