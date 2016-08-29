var mysql = require('mysql')
  , async = require('async');

var pool = {};

exports.connect = function(callback) {
  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aaa',
    database: 'chat_room'
  });
  if(callback)
  	callback();
}

exports.get = function() {
  return pool;
}

exports.fixtures = function(data, callback) {
  if (!pool) return callback(new Error('Missing database connection.'));

  var names = Object.keys(data.tables);
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" });
			var str = 'INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')';
			console.log(str);
      pool.query(str, cb);
    }, cb)
  }, callback);
}

exports.drop = function(tables, callback) {
  if (!pool) return callback(new Error('Missing database connection.'));

  async.each(tables, function(name, cb) {
    pool.query('DELETE * FROM ' + name, cb);
  }, callback);
}