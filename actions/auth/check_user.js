'use strict';

const compose = require('koa-compose'),
  debug = require('debug')('action::auth::check'),
  dump_params = require('../dump_params'),
  Model = require('../../models');

let authorization_check = function (ctx, next) {
  if ((ctx.params.jhw_id != null) && (ctx.params.access_token != null)) {
    return Model.Oauth2AccessTokens.findOne({
      where: {
        resource_owner_id: ctx.params.jhw_id,
        token: ctx.params.access_token
      }
    }).then(function (token) {
      if (token != null) {
        token.created_at.setSeconds(token.created_at.getSeconds() + token.expires_in);
        let nowDate = new Date();
        if (token.created_at >= nowDate) {
          return next();
        } else {
          throw (new Error('accessToken was expired'));
        }
      } else {
        throw (new Error('invalid accessToken'));
      }
    })
  } else {
    throw (new Error('invalid accessToken'));
  }
};

// Just try to check, if success, will add ctx.user_verified in ctx, otherwise set null for current_user.
let authorization_check_opti = function (ctx, next) {
  ctx.user_verified = false;
  if ((ctx.params.jhw_id != null) && (ctx.params.access_token != null)) {
    return Model.Oauth2AccessTokens.findOne({
      where: {
        resource_owner_id: ctx.params.jhw_id,
        token: ctx.params.access_token
      }
    }).then(function (token) {
      if (token != null) {
        token.created_at.setSeconds(token.created_at.getSeconds() + token.expires_in);
        let nowDate = new Date();
        if (token.created_at >= nowDate) {
          // Add verify flag here.
          ctx.user_verified = true;
        }
      }
      
      return next();
    })
  } else {
    return next();
  }
}

module.exports = compose([dump_params('jhw_id', 'access_token'), authorization_check]);
module.exports.opti = compose([dump_params('jhw_id', 'access_token'), authorization_check_opti]);