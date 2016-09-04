// the helper for the database connection
var mysql = require('mysql');

// the connection pool
var pool = {};

// establisth the connection pool
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

// get the connection pool
exports.get = function() {
  return pool;
}