// the wrapper of the socketio
var Connector = function(app,logicManager){
	if(app && logicManager){
		this.app = app;
		this.io = require('socket.io')(app);
		this.ClientClass = require('./Client');
		this.logicManager = logicManager;
	}
}

// link the connector to the roommanager
Connector.prototype.init = function(){
	if(this.io && this.logicManager){
		(function(io,ClientClass,logicManager){
			io.on('connection',function(socket){
				console.log('io connected');
				var client = new ClientClass(socket);
				logicManager.clientInit(client);
			});
		})(this.io,this.ClientClass,this.logicManager);
	} else {
		return 1;
	}
}

module.exports = Connector;