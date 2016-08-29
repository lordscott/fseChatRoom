var db = require('../DbHelper.js');

exports.create = function(uuid, user_name, user_password, callback) {
  var values = [uuid, user_name, user_password];
  
  db.get().query('INSERT INTO user_info (uuid, user_name, user_password) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return callback(err);
    callback(null, result.insertId);
  })
}

exports.getAll = function(callback) {
  db.get().query('SELECT * FROM user_info', function (err, rows) {
    if (err) return callback(err);
    callback(null, rows);
  })
}

exports.getAllByUserName = function(user_name, callback) {
  db.get().query('SELECT * FROM user_info WHERE user_name = ?', user_name, function (err, rows) {
    if (err) return callback(err);
    callback(null, rows);
  });
}