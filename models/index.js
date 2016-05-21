'use strict';
const loader = require('folder-loader'),
  debug = require('debug')('model'),
  Sequelize = require('sequelize'),
  config = require('../config').db;

let db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  config.logging = debug; // Let the SQL out from debug.
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

for (let model_func of loader.iterator(__dirname, __filename)) {
  try {
    let model = model_func(sequelize, Sequelize);
    db[model.name] = model;
    debug("Import model " + model.name + " success.");
  }
  catch (error) {
    debug("Import model error: " + error);
  }
}

for (let modelName in db) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
