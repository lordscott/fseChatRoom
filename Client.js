var Client = function(socket){
	this.socket = socket;
	this.id = socket.id;
}

Client.prototype.join = function(room){
	if(this.socket){
        this.socket.join(room);
    }
}

Client.prototype.leave = function(room){
    if(this.socket){
        this.socket.leave(room);
        this.socket.removeAllListeners();
    }
}



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

Client.prototype.send = function(eventName, message){
    if(this.socket){
	   this.socket.emit(eventName,message);        
    }
}

Client.prototype.broadcast = function(room, eventName, message){
    if(this.socket){
	   this.socket.broadcast.to(room).emit(eventName,message);
    }
}

module.exports = Client;