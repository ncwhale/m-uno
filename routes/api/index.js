'use strict';

const loader = require('folder-loader'),
    debug = require('debug')('api::index');

let router = new require('koa-router')();

router.use(async function (ctx, next) {
    // API 里面所有接口都是 RESTful 的，默认返回 JSON.
    // TODO: 根据请求的 Accetpt Header 决定 返回数据类型。
    ctx.type = 'json';
    await next();
});

for (let model of loader.iterator(__dirname, __filename)) {
    if (model.name) {
        router.use('/' + model.name, model.routes(), model.allowedMethods());
        debug("Loaded route: " + model.name);
    } else {
        router.use(model.routes());
        debug("Loaded route: " + api_name);
    };
}

module.exports = router;
module.exports.name = 'api';