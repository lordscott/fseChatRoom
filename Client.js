// the wrapper of the socket
var Client = function(socket){
	this.socket = socket;
	this.id = socket.id;
}

// join a room
Client.prototype.join = function(room){
	if(this.socket){
        this.socket.join(room);
    }
}

// leave a room
Client.prototype.leave = function(room){
    if(this.socket){
        this.socket.leave(room);
        this.socket.removeAllListeners();
    }
}

// set the callback of a disconnection
Client.prototype.setOnDisconnect = function(obj, callback){
    if(this.socket){
        (function(that){
            that.socket.on('disconnect',function(){
                console.log('io disconnected');
                callback.call(obj,that);
            });
        })(this);
    }
}

// set the callback when receiving a message
Client.prototype.setOnReceive = function(obj, eventName, callback){
    if(this.socket){
        (function(that){
            that.socket.on(eventName,function(data){
                console.log('io ' + eventName);
                callback.call(obj, that, data);
            });
        })(this);
    }
}

// send a message
Client.prototype.send = function(eventName, message){
    if(this.socket){
	   this.socket.emit(eventName,message);        
    }
}

// broadcast a message
Client.prototype.broadcast = function(room, eventName, message){
    if(this.socket){
	   this.socket.broadcast.to(room).emit(eventName,message);
    }
}

module.exports = Client;