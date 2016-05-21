require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3']
});

const Koa = require('koa'),
  IO = require('koa-socket'),
  debug = require('debug'),
  config = require('./config'),
  models = require('./models'),
  page_not_found_handler = require('./actions/404'),
  router = require('./routes');

const app = module.exports = new Koa(),
  io = new IO();

if (config.development) {
  app.use(require('./actions/debug_catcher'));
}

app
  .use(page_not_found_handler)
  .use(router.routes())
  .use(router.allowedMethods());

io.attach(app);

if (!module.parent) app.listen(config.http.port);
