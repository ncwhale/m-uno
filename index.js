require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3']
});

const koa = require('koa'),
    debug = require('debug'),
    config = require('./config'),
    models = require('./models'),
    page_not_found_handler = require('./actions/404');

let router = require('./routes'),
    app = module.exports = new koa();

if(config.development){
    app.use(require('./actions/debug_catcher'));
}

app
    .use(page_not_found_handler)
    .use(router.routes())
    .use(router.allowedMethods());

if (!module.parent) app.listen(config.http.port);
