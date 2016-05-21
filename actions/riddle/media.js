const Models = require('../../models');

let media_operations = Models.Media;

media_operations['bind_to_topic'] = function (topic_id, media_ids) {
  return Models.Media.update(
    {
      topic_id: topic_id
    },
    {
      where: {
        id: media_ids,
        topic_id: null
      }
    });
}

module.exports = media_operations;