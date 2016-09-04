
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , RoomManager = require('./RoomManager')
	, morgan = require('morgan');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// logs
app.use(morgan('combined'));

// Routes
app.get('/', routes.index);

//init database;
var dbHelper = require('./DbHelper');
dbHelper.connect();

//int the RoomManager
var roomManager = new RoomManager();
roomManager.init(app);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
