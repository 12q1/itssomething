var socket = io();
socket.on('message', function (data) {
    console.table(data);
});

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65 : // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
        case 39: //right arrow
            movement.right = true;
            break;
        case 37: //left arrow
            movement.left = true;
            break;
        case 38: //up arrow
            movement.up = true;
            break;
        case 40: //down arrow
            movement.down = true;
            break;
    }
});

document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
        case 39: //right arrow
            movement.right = false;
            break;
        case 37: //left arrow
            movement.left = false;
            break;
        case 38: //up arrow
            movement.up = false;
            break;
        case 40: //down arrow
            movement.down = false;
            break;
    }
});

socket.emit('new player');
setInterval(function () {
    socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function (players) {
    //us this console.log if you need to check the player list on client
    //console.log(players)
    context.clearRect(0, 0, 1000, 600); //removes trails
    for (var id in players) {
        var player = players[id];
            context.fillStyle = player.color;
            context.beginPath();
            console.log(player)
            context.rect(player.x, player.y, 15, 15);
            context.fill();
            context.fillText(player.name,player.x-7,player.y-5,30)
            context.fillText(`You are ${player.name}`, 5, 10)

    }
});