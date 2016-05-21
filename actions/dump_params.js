let dump_params = function (...params) {
  let param_to_dump = params;
  return function (ctx, next) {
    if ('POST' === ctx.method && typeof ctx.request.body === 'object') {
      let dump_body = ctx.request.body
      if (typeof ctx.request.body.fields === 'object' && typeof ctx.request.body.files === 'object') {
        dump_body = ctx.request.body.fields;
      }

      for (let param of param_to_dump) {
        ctx.params[param] = param in dump_body ? dump_body[param] : ctx.params[param];
      }
    }

    return next();
  }
}

module.exports = dump_params;