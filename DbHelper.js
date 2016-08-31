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