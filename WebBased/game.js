/* Global Scope */
var canvasGame;
var ctx;
var paused = false;

var gameSituationInterval;
var frameId;

//Color Variables
var whiteColor = 'rgb(255, 255, 255)';
var blackColor = 'rgb(0, 0, 0)';
var blueColor = 'rgb(66, 134, 244)';
var redColor = 'rgb(255, 0, 0)';
var lightBlueColor = 'rgb(66, 215, 244)';
var pinkColor = 'rgb(237, 21, 172)';

//Player1 & Player2 Starting Positions
var player1StartPos = [100, 100];
var player2StartPos = [700, 500];

//Player1 & Player2 Body

var player1BodyArray = [];
var player1BodyStart = new PlayerBody(100, 100);
player1BodyArray.push(player1BodyStart);

var player2BodyArray = [];
var player2BodyStart = new PlayerBody(700, 500);
player2BodyArray.push(player2BodyStart);

//Player1 & Player2 Direction & Change
var player1Direction = 'RIGHT';
var player2Direction = 'LEFT';

var player1ChangeTo = player1Direction;
var player2ChangeTo = player2Direction;

//Game Finished
var finished = false;
var started = false;

if (started == true) {
    requestAnimationFrame(function () {
        mainLoop(canvasGame, ctx);
    });
}

function PlayerBody(x, y) {
    this.x = x;
    this.y = y;
}

function start(canvas) {
    canvasGame = canvas;
    ctx = canvasGame.getContext('2d');
    window.addEventListener('keydown', onKeyDown, true);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    started = true;
    finished = false;
    mainLoop(canvasGame, ctx);
}

function onKeyDown(event) {
    //Player 1
    if (event.which == 68)   //D
        player1ChangeTo = 'RIGHT';
    if (event.which == 65)   //A
        player1ChangeTo = 'LEFT';
    if (event.which == 87)   //W
        player1ChangeTo = 'UP';
    if (event.which == 83)   //S
        player1ChangeTo = 'DOWN';

    //Player 2
    if (event.which == 39)   //Right arrow
        player2ChangeTo = 'RIGHT';
    if (event.which == 37)  //Left arrow
        player2ChangeTo = 'LEFT';
    if (event.which == 38)   //Up arrow
        player2ChangeTo = 'UP';
    if (event.which == 40)  //Down arrow
        player2ChangeTo = 'DOWN';

    //Pause
    if (event.which == 80) {  //P
        if (paused == false) {
            paused = true;
            cancelAnimationFrame(frameId);
        }
        else {
            paused = false;
            draw();
        }
    }
}

function gameOver(winner) {
    started = false;
    window.alert("Player " + winner + " wins!");
}

function draw() {
    frameId = requestAnimationFrame(function () {
        var delayMillis = 50; // 0.05 second
        setTimeout(function () {
            mainLoop(canvasGame, ctx);
        }, delayMillis);
    });
}

function mainLoop(canvas, ctx) {

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


    //Draw Player 1 & Player 2
    for (var i = 0; i < player1BodyArray.length; i++) {
        ctx.fillStyle = lightBlueColor;
        ctx.fillRect(player1BodyArray[i].x, player1BodyArray[i].y, 5, 5);
    }

    for (var i = 0; i < player2BodyArray.length; i++) {
        ctx.fillStyle = pinkColor;
        ctx.fillRect(player2BodyArray[i].x, player2BodyArray[i].y, 5, 5);
    }

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

    if (paused == false)
        draw();

    if (finished == true)
        location.reload();

}
