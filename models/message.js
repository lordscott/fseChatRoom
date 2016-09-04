// the model for a message
var db = require('../DbHelper.js');

// insert a message into a table of the database
exports.insert = function(user_name, message_text, message_time, callback) {
  var values = [user_name, message_text, message_time];
  
  db.get().query('INSERT INTO message_record (user_name, message_text, message_time) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return callback(err);
    callback(null, result.insertId);
  })
}

// get all the messages from the table
exports.getAll = function(callback) {
  db.get().query('SELECT * FROM message_record', function (err, rows) {
    if (err) return callback(err);
    callback(null, rows);
  })
}