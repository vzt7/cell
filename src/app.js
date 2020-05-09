// init
const Koa = require('koa');
const router = require('./router');

const app = new Koa();

// fetch script
const controllers = require('./controllers');
(async () => {
  const entryList = await controllers.entry.getUserScriptEntries();
  await controllers.detail.fetchDetails(
    entryList
  );
})();

// router
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('listening: http://localhost:3000');
});
