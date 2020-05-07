const path = require('path');
const fs = require('fs');
const superagent = require('superagent');
require('superagent-proxy')(superagent); // proxy
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const sleep = require('../utils/sleep');
const preset = require('../preset');
const saveFile = require('../utils/save');
const getProxy = require('../utils/proxy');
const scriptPath = path.resolve('scripts');

const MAX_FIAL_RETRY_TIMES = 20; // 最大重试次数


const parseHtml = (html) => {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);
    // pre tag data of code area
    const res = $('.prettyprint').text();

    resolve(res);
  });
}

const fetchDetail = (url) => {
  // use cache
  const fileNames = fs.readdirSync(scriptPath);
  const decodeUrl = decodeURIComponent(url);
  const scriptFile = fileNames.find(name => decodeUrl.includes(name.split('-')[2])); // script-code-[id]-[name].
  const matchRes = scriptFile && scriptFile.match(/^script-code-(\d+)-.+/);
  if (matchRes) {
    console.log(`[cache] use cache file : ${scriptFile}`);
    // 缓存时间内直接使用现有数据
    return new Promise((resolve, reject) => {
      fs.readFile(`${scriptPath}/${scriptFile}`, (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    });
  }

  return new Promise((resolve, reject) => {
    // fetch detail page html
    doRequest(url, resolve);
  }).catch(err => {
    throw err;
  });
}

const doRequest = (url, resolve, failCount = 0) => {
  const nextProxyIp = failCount > 0;
  return superagent
    .get(url)
    .set('User-Agent', randomUseragent.getRandom())
    .proxy(getProxy(nextProxyIp))
    .timeout({ response: 30 * 1000, deadline: 120 * 1000 })
    // .retry(3)
    .end((err, res) => {
      if (!err) {
        // parse detail page html
        const scriptName = url.match(/\/(\d+-.+)\/code/)[1];
        parseHtml(res.text).then((data) => {
          saveFile(`script-code-${scriptName}.js`, data);
          // 随机间隔几秒后下一个
          const randomSleepSeconds = ~~(Math.random() * 10) * 1000;
          console.log(`[ing] ok, fetch next after ${randomSleepSeconds / 1000} seconds... `);
          sleep(randomSleepSeconds).then(() => {
            resolve(data);
          });
        });
        // saveFile(`/script-${scriptName}.html`, res.text);
      } else {
        if (failCount >= MAX_FIAL_RETRY_TIMES) throw err;
        console.log(`[fail] net error, retry with next ip ... [${failCount}]`);
        doRequest(url, resolve, failCount + 1);
      }
    })
}

const fetchDetails = async (entryList) => {
  console.log('[ok] fetch details : ');
  for (let i = 0; i < entryList.length; i++) {
    const link = entryList[i];
    const detailUrl = `${preset.prefix}${link}/code`;

    console.log(`[ing] fetch: ${decodeURIComponent(detailUrl)} ... `);
    await fetchDetail(detailUrl);
  }

}


module.exports = fetchDetails;
