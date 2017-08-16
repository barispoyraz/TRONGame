'use strict';
var express = require('express');
var gameApp = express();
var server = require('http').Server(gameApp);
var io = require('socket.io')(server,{});

var roomNumber = 1;
var gameRoom = "room-" + roomNumber;
var currentRoom = gameRoom;
var roomList = [];
var first = true;

var SOCKET_LIST = {};
var PLAYER_LIST = [];
var canvasWIDTH = 800;
var canvasHEIGHT = 600;
var finished = false;
var known = false;
var count = 0;
var WAITING_LIST = [];

var playerListObject = {};
var playerListObjectCount = 0;

// var playerListObject = [
	// socketPlayerPair: "", {};
// ]

var playerBody = new PlayerBody(100, 100)

var Player = function(id, socketID){
	var self = {
		player_no: id,
		direction:"RIGHT",
		changeTo:"RIGHT",
		startingPosition: [100, 100],
		bodyArray: [playerBody],
		color: "rgb(255,0,0)",
		opponentNo: -1,
		ready: 0,
		sID: socketID,
		roomId: "",
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
	
	//Join Room
	socket.on('room', function() {	
		if (first == true){
			socket.join(gameRoom);
			//SOCKET_LIST.push(socket.id);
			
			var player = initPlayerStatus(0, socket.id, gameRoom);	
			playerListObject[socket.id] = player;
			playerListObjectCount++;
			
			first = false;
			roomList.push(gameRoom);
			io.sockets.in(gameRoom).emit('message', 'You are in room: ' + gameRoom );
		}
		else{
			var myRoom = io.sockets.adapter.rooms[gameRoom];
			if(myRoom == undefined){
				socket.join(gameRoom);
				//SOCKET_LIST.push(socket.id);
				
				var player = initPlayerStatus(0, socket.id, gameRoom);
				playerListObject[socket.id] = player;
				playerListObjectCount++;
				
				io.sockets.in(gameRoom).emit('message', 'You are in room: ' + gameRoom );
				return;
			}
			if(myRoom.length < 2){
				socket.join(gameRoom);
				//SOCKET_LIST.push(socket.id);
				
				var player = initPlayerStatus(1, socket.id, gameRoom);
				playerListObject[socket.id] = player;
				playerListObjectCount++;
				
				roomList.push(gameRoom);
				io.sockets.in(gameRoom).emit('waitingState', gameRoom);
				roomNumber++;
				gameRoom = "room-" + roomNumber;	
			}
		}
		
		// socket.on('keyPress',function(data){
			// console.log("KEY PRESSED");
			// if(data.changeto == 'RIGHT' && player.direction != 'LEFT')
				// player.direction = 'RIGHT';
			// else if(data.changeto == 'LEFT' && player.direction != 'RIGHT')
				// player.direction = 'LEFT';
			// else if(data.changeto == 'UP' && player.direction != 'DOWN')
				// player.direction = 'UP';
			// else if(data.changeto == 'DOWN' && player.direction != 'UP')
				// player.direction = 'DOWN';
		// });		
	});
	

	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		count = 0;
		WAITING_LIST = [];
	});		
		
	socket.on('keyPress',function(data){
			var player = playerListObject[socket.id];
			
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
		console.log(data);
		playerListObject[data].ready = 1;
		var start = false;
		
		var p1 = playerListObject[data];
		var p2;
		
		for (var i in playerListObject){
			var playerListTempObject = playerListObject[i];
			if (playerListTempObject.roomId == p1.roomId){
				console.log("111");
				if (playerListTempObject.player_no != p1.player_no){
					console.log("222");
					p2 = playerListTempObject;
				}
			}
		}
		
		if (p1.ready == 1 && p2.ready == 1){
			console.log("333");
			var players = [];
			players.push(p1);
			players.push(p2);
			
			console.log("roomid: " + p1.roomId);
			console.log("roomid: " + p2.roomId);

			start = true;
			
			setInterval(function(){
				if (start == true){
					var updateCanvas = [];
					for (var i in players){
						var currentPlayer = players[i];
						currentPlayer.move();
						updateCanvas.push({
							body: currentPlayer.bodyArray,
							playerColor: currentPlayer.color,
							playerStartPos:  currentPlayer.startingPosition,
							playerNo: currentPlayer.player_no,
							playerDirection: currentPlayer.direction,
						});
						io.sockets.in(p1.roomId).emit('updateGameCanvas', updateCanvas);
					}

					updateInformation(players);
					boundaryChecking(updateCanvas);
					collision(updateCanvas);	
				}
			}, 1000/12);
		}
	});
});
	
function updateInformation(players){
	/*for (var i in players){
		var currentPlayer = players[i];
		var socket = currentPlayer.sID;
		var opponentPlayerSID 	
			
		if (SOCKET_LIST[i].id == information[i].player_no)
			SOCKET_LIST[i].emit('updateOpponentInformation', { info: information, currentPlayer: SOCKET_LIST[i].id});
	}*/
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

function PlayerBody(x, y) {
    this.x = x;
    this.y = y;
}

function initPlayerStatus(id, sIDin, gameRoom){
	var player = Player();
	player.player_no = id;
	if (player.player_no == 0 ){
		player.direction = "RIGHT"
		player.changeTo = "RIGHT"
		player.startingPosition = [100, 100]
		player.bodyArray[0] = new PlayerBody(100, 100)
		player.color = "rgb(255, 0, 0)"
		player.opponentNo = 1
		player.ready = 0
		player.sID = sIDin;
		player.roomId = gameRoom;
	}
	else if(player.player_no == 1){
		player.direction = "LEFT"
		player.changeTo = "LEFT"
		player.startingPosition = [700, 500]
		player.bodyArray[0] = new PlayerBody(700, 500)
		player.color = "rgb(0, 255, 0)"
		player.opponentNo = 0
		player.ready = 0	
		player.sID = sIDin;
		player.roomId = gameRoom;
	}
	return player;
}
