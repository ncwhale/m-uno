'use strict';

const compose = require('koa-compose'),
  debug = require('debug')('action::auth::check'),
  dump_params = require('../dump_params'),
  Model = require('../../models');

let client_check = function (req, res, next) {
  if ((req.params.client_id != null) && (req.params.access_token != null)) {
    return Model.Oauth2Clients.findOne({
      where: {
        identifier: req.params.client_id
      },
      include: [
        {
          model: Model.Oauth2AccessTokens,
          as: 'token',
          where: {
            token: req.params.access_token
          }
        }
      ]
    }).then(function (client) {
      if ((client != null) && (client.token[0] != null)) {
        client.token[0].created_at.setSeconds(client.token[0].created_at.getSeconds() + client.token[0].expires_in);
        let nowDate = new Date();
        if (client.token[0].created_at >= nowDate) {
          return next();
        } else {
          throw (new Error('accessToken is expired'));
        }
      } else {
        throw (new Error('invalid accessToken'));
      }
    })
  } else {
    throw (new Error('invalid accessToken'));
  }
};

module.exports = compose([dump_params('client_id', 'access_token'), client_check]);