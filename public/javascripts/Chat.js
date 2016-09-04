// The manager of the chat room
var Chat = function(socket){
	this.socket = socket;
}

// set the functions to call when receiving messages
Chat.prototype.setOnReceive = function(onReceiveUsrMessage, onReceiveSystemMessage){
    this.socket.on('message', function (data) {
        switch(data.type){
            case 'message_user':
                onReceiveUsrMessage(data.content);
                break;
            case 'message_system':
                onReceiveSystemMessage(data.content);//.text
                break;
            case 'message_user_multi':
                $.each(data.content, function(index,message){
                   onReceiveUsrMessage(message);
                });
                break;
        }
    });
}

// login into the room with a username
Chat.prototype.login = function(username){
	this.socket.emit('login', { username: username });
}

// send a message
Chat.prototype.sendMessage = function(message){
	this.socket.emit('message', {text: message});
}

// leave the room
Chat.prototype.leave = function(){
    this.socket.emit('leave');
}