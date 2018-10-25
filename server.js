// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', process.env.PORT || 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(process.env.PORT || 5000, function () {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function (socket) {});

// Just leaving this here in case we need it later

// setInterval(function() {
//     io.sockets.emit('testing connection please ignore');
//   }, 1000);

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
} //end of getRandomNumber: use this to generate a random integer, define the maximum in the parameter


playerColors = ["white", "yellow", "blue", "black", "orange"]

var players = {};
var number = 0
io.on('connection', function (socket) {
  socket.on('new player', function () {
    players[socket.id] = {
      socket: socket.id,
      name: "player" + number++,
      x: getRandomNumber(800),
      y: getRandomNumber(400), //these coordinates are the starting position of a player
      color: playerColors[getRandomNumber(playerColors.length)],
      infected: false
    };
  });

  socket.on('movement', function (data) {
    var player = players[socket.id] || {};
    if (data.left && player.x > 0) {
      player.x -= 7; //these numbers control movement speed higher = faster
    }
    if (data.up && player.y > 0) {
      player.y -= 7;
    }
    if (data.right && player.x < 985) {
      player.x += 7;
    }
    if (data.down && player.y < 585) {
      player.y += 7;
    }
    if (players) { //if players exist
      playerSize = 15 //define player size
      socketArray = Object.keys(players) //create an array of socket IDs
      dataArray = Object.values(players) //create an array of data objects (eg. xcoords/ycoords)
      for (i = 0; i < dataArray.length; i++) { //for each index of dataArray 
        if (player.x + playerSize > dataArray[i].x && player.x < dataArray[i].x + playerSize && socket.id !== socketArray[i]) { //if player x is the same as one of the data packets and the socketIDs don't match
          if (player.y + playerSize > dataArray[i].y && player.y < dataArray[i].y + playerSize && socket.id !== socketArray[i]) { //if player y is the same as one of the data packets and the socketIDs don't match
            console.log(`a collision has occurred on both axis between ${player.socket} and ${socketArray[i]}`)
            if (player.infected === false && dataArray[i].infected === true) {
              player.infected = true
              player.color = 'red'
            }
          }
        }
      }
    }
  });
  socket.on('disconnect', function () {
    delete players[socket.id];
  }) //removes players after disconnect this is a json object, array functions don't work
});
setInterval(function () {
  io.sockets.emit('state', players);
}, 1000 / 60);