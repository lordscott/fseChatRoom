var db = require('./DbHelper.js');
exports.check = function(user_name, user_password, callback){
	var values = [user_name, user_password];
	db.get().query('SELECT * FROM user_info WHERE user_name = ? and user_password = ?', values, function (err, rows) {
    if (err) return callback(err, false);
    if (rows.length > 0) {
    	callback(null, true, rows[0].uuid);
    } else {
    	callback(null, false);
  	}
  });
}