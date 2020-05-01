// init
const Koa = require('koa');
const router = require('./router');

const app = new Koa();

// router
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('listening: http://localhost:3000');
});
