'use strict';

const loader = require('folder-loader'),
    path = require('path'),
    debug = require('debug')('router::index');

let router = new require('koa-router')();

loader(__dirname, __filename, {
    subfolder: true,
    loader: ((file) => {
        try {
            let model = require(path.join(__dirname, file));

            if (model.name) {
                router.use('/' + model.name, model.routes(), model.allowedMethods());
                debug("Loaded route: " + model.name);
            } else {
                router.use(model.routes());
                debug("Loaded route: " + file);
            };
        }
        catch (error) {
            debug("Load " + file + " error: " + error);
        }
    })
});

module.exports = router;
