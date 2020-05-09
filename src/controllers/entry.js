const fs = require('fs');
const path = require('path');
// const nocache = require('superagent-no-cache');
const superagent = require('superagent');
require('superagent-proxy')(superagent); // proxy
const cheerio = require('cheerio');

const preset = require('../preset');
const saveFile = require('../utils/save');
const getProxy = require('../utils/proxy');
const scriptPath = path.resolve('scripts');


const fetchScriptLinkList = () => {
  console.log('[ok] fetch html...');
  // use cache
  const fileNames = fs.readdirSync(scriptPath);
  const entryFile = fileNames.find(name => name.startsWith('entry'));
  const matchRes = entryFile && entryFile.match(/^entry-(\d+)/);
  const genDate = entryFile && matchRes ? Number.parseInt(matchRes[1]) : Number.POSITIVE_INFINITY;
  if (genDate < Date.now() + preset.interval.entry) {
    console.log(`[cache] use entry cache file : ${entryFile}`);
    // 缓存时间内直接使用现有数据
    return new Promise((resolve, reject) => {
      fs.readFile(`${scriptPath}/${entryFile}`, (err, data) => {
        if (err) throw err;
        resolve(JSON.parse(data));
      });
    });
  }

  return new Promise((resolve, reject) => {
    superagent
      .get('https://greasyfork.org/zh-CN/scripts/by-site/icourse163.org')
      // .use(nocache)
      // .proxy(getProxy())
      .timeout({ response: 25 * 1000, deadline: 120 * 1000 })
      .end((err, res) => {
        if (!err) {
          console.log('[ok] parse html ...');
          parseHtml(res.text).then((data) => {
            resolve(data);
          });
        } else {
          reject(err);
        }
      });
  }).catch(err => {
    throw err;
  });
}

const parseHtml = (html) => {
  return new Promise(resolve => {
    const $ = cheerio.load(html);
    // 解析 tempermonkey 搜索列表页
    const hrefs = [];
    $('#browse-script-list li h2').each((i, el) => {
      const href = $(el).find('a').attr('href');
      hrefs.push(href);
    });

    saveFile(`entry-${Date.now()}.json`, JSON.stringify(hrefs));
    resolve(hrefs);
  });
}

const getUserScriptEntries = async () => {
  const list = await fetchScriptLinkList();
  return list;
}

module.exports = {
  getUserScriptEntries,
};
