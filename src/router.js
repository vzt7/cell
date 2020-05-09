const router = require('koa-router')();
const controllers = require('./controllers');


router.get('/', async (ctx, next) => {
  ctx.body = Object.keys(controllers).join(' processor\n');
  next();
});

router.get('/entry', async (ctx, next) => {
  // 简易的 pipeline
  const { getUserScriptEntries } = controllers.entry;
  const entryList = await getUserScriptEntries();
  ctx.body = entryList;
  next();
});

router.get('/detail', async (ctx, next) => {
  // 简易的 pipeline
  const { showDetails } = controllers.detail;
  const detailList = await showDetails();
  ctx.body = detailList;
  next();
});

router.get('/detail/blacklist', async (ctx, next) => {
  // 简易的 pipeline
  const { getKeyWordsBlackList } = controllers.detail;
  const blackList = await getKeyWordsBlackList();
  ctx.body = blackList;
  next();
});

router.get('/ban/list', async (ctx, next) => {
  const banList = await controllers.ban();
  ctx.body = banList;
  next();
});

module.exports = router;
