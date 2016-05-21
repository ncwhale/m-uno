const Models = require('../../models');

let topic_operations = Models.Topic;

topic_operations['find_random_topic_id'] = function () {
  return Models.Topic.findOne({
    attributes: ['id']
  });
}

module.exports = topic_operations;