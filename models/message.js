var db = require('../DbHelper.js');

exports.insert = function(user_name, message_text, message_time, callback) {
  var values = [user_name, message_text, message_time];
  
  db.get().query('INSERT INTO message_record (user_name, message_text, message_time) VALUES(?, ?, ?)', values, function(err, result) {
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