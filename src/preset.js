
const day = 60 * 60 * 24;

module.exports = {
  prefix: 'https://greasyfork.org', // 用于拼接详情页 url
  listPage: 'https://greasyfork.org/zh-CN/scripts/by-site/icourse163.org', // 用户爬取脚本列表，后面跟 ?page=[number] 即翻页
  interval: {
    entry: 4 * day,
    
  }
}
