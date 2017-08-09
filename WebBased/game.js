/* Global Scope */
var canvasGame;
var gameSituationInterval;
var frameId;

//Color Constants
var whiteColor = 'rgb(255, 255, 255)';
var blackColor = 'rgb(0, 0, 0)';
var blueColor = 'rgb(66, 134, 244)';
var redColor = 'rgb(255, 0, 0)';
var lightBlueColor = 'rgb(66, 215, 244)';
var pinkColor = 'rgb(237, 21, 172)';

var game = {
    ctx: null,
    pauseKey: 80,

    //States
    paused: false,
    started: false,
    started: false,
    //Player1 & Player2 Start Positions
    startPosition: {
        player1: [100, 100],
        player2: [700, 500]
    },
    //Player1 & Player2 Body
    body: {
        player1: [],
        player2: []
    },
    //Player1 & Player2 Directions
    originalDirection: {
        player1: 'RIGHT',
        player2: 'LEFT'
    },
    //Player1 & Player2 Direction Changes        
    directionChanges: {
        player1: "",
        player2: ""
    },
    color: {
        player1: "",
        player2: ""
    }
};

//Picked colors
var color1;
var color2;

if (game.started == true) {
    requestAnimationFrame(function() {
        mainLoop(canvasGame, game.ctx);
    });
}

function PlayerBody(x, y) {
    this.x = x;
    this.y = y;
}

function colorAssignment(p1Color, p2Color) {
    color1 = p1Color;
    color2 = p2Color;
}

function onKeyDown(event) {
    var player1ChangeTo = game.directionChanges.player1;
    var player2ChangeTo = game.directionChanges.player2;

    //Player 1
    if (event.which == 68) //D
        player1ChangeTo = 'RIGHT';
    if (event.which == 65) //A
        player1ChangeTo = 'LEFT';
    if (event.which == 87) //W
        player1ChangeTo = 'UP';
    if (event.which == 83) //S
        player1ChangeTo = 'DOWN';

    //Player 2
    if (event.which == 39) //Right arrow
        player2ChangeTo = 'RIGHT';
    if (event.which == 37) //Left arrow
        player2ChangeTo = 'LEFT';
    if (event.which == 38) //Up arrow
        player2ChangeTo = 'UP';
    if (event.which == 40) //Down arrow
        player2ChangeTo = 'DOWN';

    //Pause
    if (event.which == game.pauseKey) { //P
        if (game.paused == false) {
            game.paused = true;
            cancelAnimationFrame(frameId);
        } else {
            game.paused = false;
            draw();
        }
    }
}

function gameOver(winner) {
    game.started = false;
    cancelAnimationFrame(frameId);
    window.alert("Player " + winner + " wins!");
}

function draw() {
    frameId = requestAnimationFrame(function() {
        var delayMillis = 50; // 0.05 second
        setTimeout(function() {
            mainLoop(canvasGame, game.ctx);
        }, delayMillis);
    });
}

function mainLoop(canvas, ctx) {
    var position = game.startPosition;
    var body = game.body;
    var originalDirection = game.originalDirection;
    var directionChanges = game.directionChanges;

    validation(originalDirection, directionChanges);
    movement(position, body, originalDirection);
    updateInformation(body, originalDirection);
    paintRect(body, ctx);
    boundaryChecking(position);
    collision(position, body);

    if (game.paused == false)
        draw(game);

    if (game.finished == true)
        location.reload();
}

function collision(position, body) {
    var player1BodyArray = body.player1;
    var player2BodyArray = body.player2;
    var player1StartPos = position.player1;
    var player2StartPos = position.player2;
    var finished = game.finished;

    //Collision to yourself
    for (var i = 1; i < player1BodyArray.length; i++)
        if (player1StartPos[0] == player1BodyArray[i].x && player1StartPos[1] == player1BodyArray[i].y) {
            finished = true;
            gameOver(2);
        }

    for (var i = 1; i < player2BodyArray.length; i++)
        if (player2StartPos[0] == player2BodyArray[i].x && player2StartPos[1] == player2BodyArray[i].y) {
            finished = true;
            gameOver(1);
        }

        //Collision to other player
        //Player 1 colliding to Player 2
    for (var i = 1; i < player2BodyArray.length; i++)
        if (player1StartPos[0] == player2BodyArray[i].x && player1StartPos[1] == player2BodyArray[i].y) {
            finished = true;
            gameOver(2);
        }

        //Player 2 colliding to Player 1
    for (var i = 1; i < player1BodyArray.length; i++)
        if (player2StartPos[0] == player1BodyArray[i].x && player2StartPos[1] == player1BodyArray[i].y) {
            finished = true;
            gameOver(1);
        }
}

function boundaryChecking(position) {
    var player1StartPos = position.player1;
    var player2StartPos = position.player2;
    var finished = game.finished;

    //Canvas Boundaries
    if (player1StartPos[0] > canvas.width - 10 || player1StartPos[0] < 0) {
        finished = true;
        gameOver(2);
    }
    if (player1StartPos[1] > canvas.height - 10 || player1StartPos[1] < 0) {
        finished = true;
        gameOver(2);
    }

    if (player2StartPos[0] > canvas.width - 10 || player2StartPos[0] < 0) {
        finished = true;
        gameOver(1);
    }
    if (player2StartPos[1] > canvas.height - 10 || player2StartPos[1] < 0) {
        finished = true;
        gameOver(1);
    }
}

function validation(originalDirection, directionChanges) {
    var player1Direction = originalDirection.player1;
    var player2Direction = originalDirection.player2;
    var player1ChangeTo = directionChanges.player1;
    var player2ChangeTo = directionChanges.player2;

    //Validation of the Direction: Player 1
    if (player1ChangeTo == 'RIGHT' && player1Direction != 'LEFT')
        player1Direction = 'RIGHT'
    if (player1ChangeTo == 'LEFT' && player1Direction != 'RIGHT')
        player1Direction = 'LEFT'
    if (player1ChangeTo == 'UP' && player1Direction != 'DOWN')
        player1Direction = 'UP'
    if (player1ChangeTo == 'DOWN' && player1Direction != 'UP')
        player1Direction = 'DOWN'

    //Validation of the Driection: Player 2
    if (player2ChangeTo == 'RIGHT' && player2Direction != 'LEFT')
        player2Direction = 'RIGHT'
    if (player2ChangeTo == 'LEFT' && player2Direction != 'RIGHT')
        player2Direction = 'LEFT'
    if (player2ChangeTo == 'UP' && player2Direction != 'DOWN')
        player2Direction = 'UP'
    if (player2ChangeTo == 'DOWN' && player2Direction != 'UP')
        player2Direction = 'DOWN'
}

function updateInformation(body, originalDirection) {
    var player1BodyArray = body.player1;
    var player2BodyArray = body.player2;
    var player1Direction = originalDirection.player1;
    var player2Direction = originalDirection.player2;

    document.getElementById("player1-direction").innerHTML = "Direction: " + player1Direction;
    document.getElementById("player2-direction").innerHTML = "Direction: " + player2Direction;

    var distanceX1 = player2BodyArray[0].x - player1BodyArray[0].x;
    var distanceY1 = player2BodyArray[0].y - player1BodyArray[0].y;

    var distanceX2 = player1BodyArray[0].x - player2BodyArray[0].x;
    var distanceY2 = player1BodyArray[0].y - player2BodyArray[0].y;

    document.getElementById("player1-distance").innerHTML = "Distance: " + "X: " + distanceX1 + " Y: " + distanceY1;

    document.getElementById("player2-distance").innerHTML = "Distance: " + "X: " + distanceX2 + " Y: " + distanceY2;
}

function movement(position, body, originalDirection) {
    var player1BodyArray = body.player1;
    var player2BodyArray = body.player2;
    var player1StartPos = position.player1;
    var player2StartPos = position.player2;
    var player1Direction = originalDirection.player1;
    var player2Direction = originalDirection.player2;

    //Movement: Player1
    if (player1Direction == 'RIGHT')
        player1StartPos[0] += 5
    if (player1Direction == 'LEFT')
        player1StartPos[0] -= 5
    if (player1Direction == 'UP')
        player1StartPos[1] -= 5
    if (player1Direction == 'DOWN')
        player1StartPos[1] += 5

    //Movement: Player2
    if (player2Direction == 'RIGHT')
        player2StartPos[0] += 5
    if (player2Direction == 'LEFT')
        player2StartPos[0] -= 5
    if (player2Direction == 'UP')
        player2StartPos[1] -= 5
    if (player2Direction == 'DOWN')
        player2StartPos[1] += 5

    //Increase Body: Player1
    var player1AddBody = new PlayerBody(player1StartPos[0], player1StartPos[1]);
    player1BodyArray.unshift(player1AddBody);

    //Increase Body: Player2
    var player2AddBody = new PlayerBody(player2StartPos[0], player2StartPos[1]);
    player2BodyArray.unshift(player2AddBody);
}

function paintRect() {
    paintRectInner(game.body, game.ctx);
}


function paintRectInner(body, ctx) {
    var player1BodyArray = body.player1;
    var player2BodyArray = body.player2;

    //Draw Player 1 & Player 2
    for (var i = 0; i < player1BodyArray.length; i++) {
        ctx.fillStyle = color1;
        ctx.fillRect(player1BodyArray[i].x, player1BodyArray[i].y, 5, 5);
    }

    for (var i = 0; i < player2BodyArray.length; i++) {
        ctx.fillStyle = color2;
        ctx.fillRect(player2BodyArray[i].x, player2BodyArray[i].y, 5, 5);
    }
}

function start(canvas) {
    var canvasGame = canvas;
    game.ctx = canvasGame.getContext('2d');
    window.addEventListener('keydown', onKeyDown, true);
    game.ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.started = true;
    game.finished = false;

    // direction changes init
    game.directionChanges.player1 = game.originalDirection.player1;
    game.directionChanges.player2 = game.originalDirection.player2;

    // game body init
    game.body.player1.push(new PlayerBody(100, 100));
    game.body.player2.push(new PlayerBody(700, 500));

    mainLoop(canvasGame, game.ctx);
}

function init(initObject) {
    colorAssignment(initObject.player1Color, initObject.player2Color);
}