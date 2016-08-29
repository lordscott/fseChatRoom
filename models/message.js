var db = require('../DbHelper.js');

exports.create = function(message_id, user_uuid, user_name, message_time, callback) {
  var values = [message_id, user_uuid, user_name, message_time];
  
  db.get().query('INSERT INTO message_record (message_id, user_uuid, user_name, message_time) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return callback(err);
    callback(null, result.insertId);
  })
}

exports.getAll = function(callback) {
  db.get().query('SELECT * FROM message_record', function (err, rows) {
    if (err) return callback(err);
    callback(null, rows);
  })
}