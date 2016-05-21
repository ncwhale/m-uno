'use strict';

let page_not_found_handler = async function pageNotFound(ctx, next) {
    await next();

    if (404 != ctx.ststus) return;

    switch (ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            ctx.type = 'json';
            ctx.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
    }
}

module.exports = page_not_found_handler;
