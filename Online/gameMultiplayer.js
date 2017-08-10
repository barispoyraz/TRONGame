'use strict';
var express = require('express');
var gameApp = express();
var server = require('http').Server(gameApp);
var io = require('socket.io')(server,{});
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var playerBody = new PlayerBody(100, 100)

var Player = function(id){
	var self = {
		player_no:id,
		direction:"RIGHT",
		changeTo:"RIGHT",
		startingPosition: [100, 100],
		bodyArray: [playerBody],
		color: "rgb(255,0,0)",
	}
	
	self.move = function(){
		if (self.direction == 'RIGHT')
			self.startingPosition[0] += 5;
		if (self.direction == 'LEFT')
			self.startingPosition[0] -= 5;
		if (self.direction == 'UP')
			self.startingPosition[1] -= 5;
		if (self.direction == 'DOWN')
			self.startingPosition[1] += 5;
		
		var playerAddBody = new PlayerBody(self.startingPosition[0], self.startingPosition[1]);
		self.bodyArray.unshift(playerAddBody);
	}
	return self;
}

gameApp.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/trongame.html');
});
gameApp.use('/client', express.static(__dirname + '/client'));

server.listen(2000);
console.log("Server started.");

io.sockets.on('connection', function(socket){
	if (PLAYER_LIST.length == 0)
		socket.id = Math.floor(Math.random() * 2);
	else{
		var uniquePlayerId = false;
		while (!uniquePlayerId){
			socket.id = Math.floor(Math.random() * 2);
			uniquePlayerId = true;
			for (var i = 0; i < PLAYER_LIST.length; i++){
				if (PLAYER_LIST[i].player_no == socket.id){
					uniquePlayerId = false;
				}
			}
		}
		console.log("Socket id is: " + socket.id)
	}
	
	SOCKET_LIST[socket.id] = socket;
	var player = initPlayerStatus(socket.id)
	PLAYER_LIST[socket.id] = player;
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});
	
	socket.on('keyPress',function(data){
		if(data.changeTo == 'RIGHT' && player.direction != 'LEFT')
			player.direction = 'RIGHT';
		else if(data.changeTo == 'LEFT' && player.direction != 'RIGHT')
			player.direction = 'LEFT';
		else if(data.changeTo == 'UP' && player.direction != 'DOWN')
			player.direction = 'UP';
		else if(data.changeTo == 'DOWN' && player.direction != 'UP')
			player.direction = 'DOWN';
	});	
});

setInterval(function(){
	var updateCanvas = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.move();
		updateCanvas.push({
			body:player.bodyArray,
			playerColor: player.color,
		});		
		
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('updateGameCanvas', updateCanvas);
	}
},1000/12);

function PlayerBody(x, y) {
    this.x = x;
    this.y = y;
}

function initPlayerStatus(id){
	var player = Player(id)
	if (player.player_no == 0 ){
		player.direction = "RIGHT"
		player.changeTo = "RIGHT"
		player.startingPosition = [100, 100]
		player.bodyArray[0] = new PlayerBody(100, 100)
		player.color = "rgb(255, 0, 0)"
	}
	else if(player.player_no == 1){
		player.direction = "LEFT"
		player.changeTo = "LEFT"
		player.startingPosition = [700, 500]
		player.bodyArray[0] = new PlayerBody(700, 500)
		player.color = "rgb(0, 255, 0)"
	}
	return player;
}
