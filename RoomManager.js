var RoomManager = function() {
	this.clients = {};
	this.accountManager = require('./AccountManager');
	this.dateFormat = require('./utils/DateFormat');
}
RoomManager.prototype.DEFAULT_ROOM_NAME = 'default_room';	
RoomManager.prototype.EVENT_LOGIN = 'login';
RoomManager.prototype.EVENT_MESSAGE= 'message';
RoomManager.prototype.EVENT_JOIN_ROOM = 'join_room';
RoomManager.prototype.EVENT_LEAVE_ROOM = 'leave_room';


RoomManager.prototype.init = function(app) {
	var Connector = require('./Connector');
	this.clients = {};
	this.app = app;
	this.connector = new Connector(app,this);
	this.connector.init();
	console.log('RoomManager inits successfully.');
}

RoomManager.prototype.clientInit = function(client){
	client.setOnReceive(this, this.EVENT_LOGIN, this.onClientLogin);
}

RoomManager.prototype.clientJoinRoom = function(client){
	client.join(RoomManager.prototype.DEFAULT_ROOM_NAME);
	client.send(this.EVENT_JOIN_ROOM,{
		text: client.name + ' has entered.'
	});
	client.broadcast(this.DEFAULT_ROOM_NAME, this.EVENT_JOIN_ROOM, {
		text: client.name + ' has entered.'
	});
}

RoomManager.prototype.onClientLogin = function(client, data) {
	console.log(client.id + ' onClientLogin');
	(function(that, name, password){
		that.accountManager.check(name, password, function(err, valid){
			if(!err){
				if(valid) {
					that.clients[client.id] = client;
					client.name = name;
					that.clientJoinRoom(client);
					client.setOnDisconnect(that, that.onClientDisconnect);
					client.setOnReceive(that, that.EVENT_MESSAGE, that.onClientMessage);
					client.send(that.EVENT_LOGIN, {result: 0});
				} else {
					client.send(that.EVENT_LOGIN, {result: 1});
				}
			}
		});
	})(this, data.name, data.password);	
}

RoomManager.prototype.onClientDisconnect = function(client){
	delete this.clients[client.id];
	client.broadcast(this.DEFAULT_ROOM_NAME, this.EVENT_LEAVE_ROOM, {text:'someone leaved.'});
}

RoomManager.prototype.onClientMessage = function(client, data){
	console.log('onmessage ' + client.name + ' ' + data.text);
	var messageToSend = {name: client.name, text:data.text, time: this.dateFormat.currentTime()};
	client.broadcast(this.DEFAULT_ROOM_NAME, this.EVENT_MESSAGE, messageToSend);
	client.send(this.EVENT_MESSAGE, messageToSend);
}

RoomManager.prototype.leaveRoom = function(client){
}

RoomManager.prototype.othersLeaveRoom = function(client){
}

module.exports = RoomManager;