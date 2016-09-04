var _ = require("underscore");
var RoomManager = function() {
    // all the clients in the room
	this.clients = [];
	this.dateFormat = require('./utils/DateFormat');
	this.messageModel = require('./models/message');
}
RoomManager.prototype.DEFAULT_ROOM_NAME = 'default_room';	
RoomManager.prototype.EVENT_LOGIN = 'login';
RoomManager.prototype.EVENT_MESSAGE= 'message';
RoomManager.prototype.EVENT_LEAVE= 'leave';
RoomManager.prototype.MESSAGE_TYPE_USER = 'message_user';
RoomManager.prototype.MESSAGE_TYPE_SYSTEM = 'message_system';
RoomManager.prototype.MESSAGE_TYPE_USER_MULTI = 'message_user_multi';

// start the socketio connector
RoomManager.prototype.init = function(app) {
	var Connector = require('./Connector');
	this.clients = {};
	this.app = app;
	this.connector = new Connector(app,this);
	this.connector.init();
	console.log('RoomManager inits successfully.');
}

// let the client listen to the command of login
RoomManager.prototype.clientInit = function(client){
    console.log('clientInit: %s', client.id);
	client.setOnReceive(this, this.EVENT_LOGIN, this.onClientLogin);
}

// add a client to the client list
RoomManager.prototype.addClient  = function(client){
    this.clients[client.id] = client;
}

// remove a client from the client list
RoomManager.prototype.removeClient = function(client){
    delete this.clients[client.id];
}

// what to do when a client login
RoomManager.prototype.onClientLogin = function(client, data) {
	console.log('onClientLogin: %s %s', client.id, data.username);
    // transmit the context to all the callback functions
	(function(that){
        // set the name of the client
        client.name = data.username;
        // add this client to the online client list
        that.addClient(client);
        // let the client join the default room
        client.join(RoomManager.prototype.DEFAULT_ROOM_NAME);
        // send the client all the chat history messages.
        that.messageModel.getAll(function(err, rows){
            if(!err){
                var messages = {
                    type: RoomManager.prototype.MESSAGE_TYPE_USER_MULTI,
                    content: _.map(rows, function(row){
                        return { 
                            name: row.user_name, 
                            text: row.message_text, 
                            time: that.dateFormat.format(row.message_time)
                        };
                    })
                };
                client.send(RoomManager.prototype.EVENT_MESSAGE,messages);
            } else {
                console.error(err);
            }
            // send the client the welcome string after sending him all the history messages.
            client.send(RoomManager.prototype.EVENT_MESSAGE,{
                type: RoomManager.prototype.MESSAGE_TYPE_SYSTEM,
                content: {
                    text: that.getWelcomeString(client.name)
                }
            });    
        });
        // send other clients that the client is coming in.
        client.broadcast(RoomManager.prototype.DEFAULT_ROOM_NAME, RoomManager.prototype.EVENT_MESSAGE, {
            type: RoomManager.prototype.MESSAGE_TYPE_SYSTEM,
            content: {
                text: client.name + ' has entered.'
            }
        });
        // set up what to do when the client disconnects.
        client.setOnDisconnect(that, that.onClientDisconnect);
        // set up what to do when the client receives a message
        client.setOnReceive(that, that.EVENT_MESSAGE, that.onClientMessage);
        client.setOnReceive(that, that.EVENT_LEAVE, that.onClientLeaveRoom);
	})(this);	
}


// what to do when a client logout
RoomManager.prototype.onClientDisconnect = function(client){
    console.log('onClientDisconnect: %s %s', client.id, client.name);
    // When a user disconnects, we should let him leave the room automatically.
	this.onClientLeaveRoom(client);
}

// what to do when a client send message
RoomManager.prototype.onClientMessage = function(client, data){
    console.log('onClientMessage: %s %s %s', client.id, client.name, JSON.stringify(data));
    // Get current time.
	var currentTime = this.dateFormat.currentTime();
    // Format the message
	var messageToSend = {
        type: this.MESSAGE_TYPE_USER,
        content: {
            name: client.name,
            text: data.text,
            time: currentTime
        }
    };
    // insert the message to the database
	this.messageModel.insert(client.name, data.text, currentTime, function(err){
		if(err){
            console.error(err);
            console.log('message that caused err is ', JSON.stringify(messageToSend));
        }
	});
    // broadcast the message to others in the chat room
	client.broadcast(this.DEFAULT_ROOM_NAME, this.EVENT_MESSAGE, messageToSend);
    // send the message to the user who sent the message, the message will not on the user's screen if the socket broke down.
	client.send(this.EVENT_MESSAGE, messageToSend);	
}

// what to do when a client leave
RoomManager.prototype.onClientLeaveRoom = function(client){
    console.log('onClientLeaveRoom: %s %s', client.id, client.name);
    this.removeClient(client);
	client.broadcast(this.DEFAULT_ROOM_NAME, this.EVENT_MESSAGE, {
        type: this.MESSAGE_TYPE_SYSTEM,
        content: {
            text: client.name + ' has leaved.'
        }
    });
    client.leave();
    this.clientInit(client);
}

// generate the welcome string a new user
RoomManager.prototype.getWelcomeString = function(selfName){
    var length = _.size(this.clients);
    // If the user is the first one of the chat room, then just welcome him.
    if(length == 1){
        return 'Welcome! You are the only one here!';
    }
    // If the user is not the only one in the room, then we will tell him who else is also in the room.
    var str_part1 = _.map(
        _.filter(
            this.clients, 
            function(client){
                return client.name != selfName;
        }), function(client){
            return client.name;
        }).join(',');
    //If there is only one user expect the user who is coming into the room, then we should use 'is'. Otherwise we should use 'are'.
    if(length == 2){
        return 'Welcome! ' + str_part1 + ' is also in the room.';
    } else {
        return 'Welcome! ' + str_part1 + ' are also in the room.';
    }
}


module.exports = RoomManager;