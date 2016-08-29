var Client = function(socket){
	this.socket = socket;
	this.id = socket.id;
}

Client.prototype.join = function(room){
	this.socket.join(room);
}

Client.prototype.leave = function(room){
	this.socket.leave(room);
}



Client.prototype.setOnDisconnect = function(obj, callback){
	(function(that){
		that.socket.on('disconnect',function(){
			console.log('io disconnected');
			callback.call(obj,that);
		});
	})(this);
}

Client.prototype.setOnReceive = function(obj, eventName, callback){
	(function(that){
		that.socket.on(eventName,function(data){
			console.log('io ' + eventName);
			callback.call(obj, that, data);
		});
	})(this);	
}

Client.prototype.send = function(eventName, message){
	this.socket.emit(eventName,message);
}

Client.prototype.broadcast = function(room, eventName, message){
	this.socket.broadcast.to(room).emit(eventName,message);
}

module.exports = Client;