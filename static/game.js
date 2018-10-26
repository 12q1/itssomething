let socket = io();
socket.on('message', function (data) {
    console.table(data);
});

let movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65: // A
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

const canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 600;
const context = canvas.getContext('2d');
socket.on('state', function (players) {
    //us this console.log if you need to check the player list on client
    //console.log(players)
    context.clearRect(0, 0, 1000, 600); //removes trails
    //console.table(players)
    for (let id in players) {
        let player = players[id];
        if (player.socket === socket.id) {
            if(player.infected === false){
            context.fillStyle = 'white'
            context.fillText(`You are ${player.name}, try to avoid the Infected`, canvas.width/2, 15)
            }
            else{
                context.fillStyle = 'red'
                context.fillText(`You are Infected, try to get everyone else`, canvas.width/2, 15)
            }
        } //if socket id is client socket ID make it white
        else { 
            context.fillStyle = player.color;

        } //else give them their regular color
        context.beginPath();
        context.rect(player.x, player.y, 20, 20);
        context.fill();
        context.textAlign ="center"
        context.fillText(player.name, player.x+10, player.y - 5)

    }
});