var db = require('./DbHelper.js');
exports.check = function(user_name, user_password, callback){
	var values = [user_name, user_password];
	db.get().query('SELECT * FROM user_info WHERE user_name = ? and user_password = ?', values, function (err, rows) {
    if (err) return callback(err, false);
    callback(null, rows.length>0);
  });
}