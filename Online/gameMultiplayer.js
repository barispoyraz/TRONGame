'use strict';
var express = require('express');
var gameApp = express();
var server = require('http').Server(gameApp);
var io = require('socket.io')(server,{});
var SOCKET_LIST = {};
var PLAYER_LIST = [];
var canvasWIDTH = 800;
var canvasHEIGHT = 600;
var finished = false;
var known = false;
var count = 0;
var WAITING_LIST = [];
var shallWeStart = false;

var playerBody = new PlayerBody(100, 100)

var Player = function(id){
	var self = {
		player_no:id,
		direction:"RIGHT",
		changeTo:"RIGHT",
		startingPosition: [100, 100],
		bodyArray: [playerBody],
		color: "rgb(255,0,0)",
		opponentNo: -1,
		ready: 0,
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
	
	if (WAITING_LIST.length == 0)
		socket.id = 0;			
	else
		socket.id = 1;
	
	SOCKET_LIST[socket.id] = socket;
	var player = initPlayerStatus(socket.id);
	WAITING_LIST[socket.id] = player;
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		count = 0;
		WAITING_LIST = [];
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
	
	socket.on('readyState', function(data){
		var waiting = "";
		if (WAITING_LIST.length < 2)
			socket.emit("waitingState", waiting)
		else{
			waiting = -1;
			socket.emit("waitingState", waiting)	
		}
		PLAYER_LIST[socket.id] = WAITING_LIST[socket.id];
		PLAYER_LIST[socket.id].ready = 1
		count++;
	});
});

setInterval(function(){
	if(WAITING_LIST.length < 2)
		return;
	else{
		if (PLAYER_LIST.length < 2){
			return ;
		}
		else{
			var updateCanvas = [];
			for(var i in PLAYER_LIST){
				var player = PLAYER_LIST[i];
				player.move();
				updateCanvas.push({
					body:player.bodyArray,
					playerColor: player.color,
					playerStartPos: player.startingPosition,
					playerNo: player.player_no,
					playerDirection: player.direction,
				});			
			}
			for(var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('updateGameCanvas', updateCanvas);
			}
			
			if (count > 1)
				updateInformation(PLAYER_LIST);
	
			boundaryChecking(updateCanvas);
			if(updateCanvas.length == 2)
				collision(updateCanvas);
		}
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
		player.opponentNo = 1
		player.ready = 0
	}
	else if(player.player_no == 1){
		player.direction = "LEFT"
		player.changeTo = "LEFT"
		player.startingPosition = [700, 500]
		player.bodyArray[0] = new PlayerBody(700, 500)
		player.color = "rgb(0, 255, 0)"
		player.opponentNo = 0
		player.ready = 0	
	}
	return player;
}

function updateInformation(information){
	for (var i in SOCKET_LIST){
		if (SOCKET_LIST[i].id == information[i].player_no)
			SOCKET_LIST[i].emit('updateOpponentInformation', { info: information, currentPlayer: SOCKET_LIST[i].id});
	}
}

function boundaryChecking(positions){
	//Canvas Boundaries
	var loserPlayer;
	for (var i = 0; i < positions.length; i++){
		if (positions[i].playerStartPos[0] > canvasWIDTH - 10 || positions[i].playerStartPos[0] < 0){
			finished = true;
			loserPlayer = positions[i].playerNo;
			gameOver(loserPlayer);
		}
		if (positions[i].playerStartPos[1] > canvasHEIGHT- 10 || positions[i].playerStartPos[1] < 0) {
			finished = true;
			loserPlayer = positions[i].playerNo;
			gameOver(loserPlayer);
		}	
	}
}

function collision(positions){
	var loserPlayer;
	
	//Collision to yourself
	for (var i = 1; i < positions[0].body.length; i++){
		if (positions[0].playerStartPos[0] == positions[0].body[i].x && positions[0].playerStartPos[1] ==  positions[0].body[i].y){
			finished = true;
			loserPlayer = positions[0].playerNo;
			gameOver(loserPlayer);
		}
	}
	
	for (var i = 1; i < positions[1].body.length; i++){
		if (positions[1].playerStartPos[0] == positions[1].body[i].x && positions[1].playerStartPos[1] ==  positions[1].body[i].y){
			finished = true;
			loserPlayer = positions[1].playerNo;
			gameOver(loserPlayer);
		}
	}
	
	for (var i = 1; i < positions[1].body.length; i++){
		if (positions[0].playerStartPos[0] == positions[1].body[i].x && positions[0].playerStartPos[1] ==  positions[1].body[i].y){
			finished = true;
			loserPlayer = positions[0].playerNo;
			gameOver(loserPlayer);
		}
	}
	
	for (var i = 1; i < positions[0].body.length; i++){
		if (positions[1].playerStartPos[0] == positions[0].body[i].x && positions[1].playerStartPos[1] ==  positions[0].body[i].y){
			finished = true;
			loserPlayer = positions[1].playerNo;
			gameOver(loserPlayer);
		}
	}
}

function gameOver(loserPlayer){
	var winner;
	if (loserPlayer == 0)
		winner = 2;
	else
		winner = 1;
	
	for (var i in SOCKET_LIST){
		SOCKET_LIST[i].emit('gameOverSituation', winner);
		delete SOCKET_LIST[i];
		delete PLAYER_LIST[i];
		count = 0;
		WAITING_LIST = [];
	}
}
