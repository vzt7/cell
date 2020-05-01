const router = require('koa-router')();
const controllers = require('./controllers');

router.get('/', async (ctx, next) => {
  // 简易的 pipeline
  const calls = Object.values(controllers);
  for (let i = 0, nextArg = undefined; i < calls.length; i++) {
    nextArg = await calls[i](nextArg);
  }
  ctx.body = Object.keys(controllers).join('processor\n');
  next();
});
router.get('/entry', async (ctx, next) => {
  // 简易的 pipeline
  controllers.entry();
  ctx.body = 'entry processor';
  next();
});
router.get('/detail', async (ctx, next) => {
  // 简易的 pipeline
  const entryList = controllers.entry();
  controllers.detail(entryList);
  ctx.body = 'detail processor';
  next();
});

module.exports = router;
