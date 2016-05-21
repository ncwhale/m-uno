const debug = require('debug')('catcher');

let debug_catcher = async function (ctx, next) {
    try {
        await next();
    } catch (error) {
        debug(error);

        ctx.status = 502;
        ctx.type = 'json';
        ctx.body = error;
    }
}

module.exports = debug_catcher;