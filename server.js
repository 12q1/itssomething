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
io.on('connection', function (socket) {
});

// Just leaving this here in case we need it later

// setInterval(function() {
//     io.sockets.emit('testing connection please ignore');
//   }, 1000);

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
} //end of getRandomNumber: use this to generate a random integer, define the maximum in the parameter


playerColors=["red","green","yellow","blue"]

var players = {};
io.on('connection', function (socket) {
  socket.on('new player', function () {
    players[socket.id] = {
      x: 500,
      y: 300, //these coordinates are the starting position of a player
      color: playerColors[getRandomNumber(playerColors.length)]
    };
    console.log(players[socket.id].color)
  });
  socket.on('movement', function (data) {
    var player = players[socket.id] || {};
    if (data.left && player.x > 10) {
      player.x -= 7; //these numbers control movement speed higher = faster
    }
    if (data.up && player.y > 12) {
      player.y -= 7;
    }
    if (data.right && player.x < 990) {
      player.x += 7;
    }
    if (data.down && player.y < 588) {
      player.y += 7;
    }
  });
  socket.on('disconnect', function () {
    socket.emit('user disconnected', socket.id)
    delete players[socket.id];
  })//removes players after disconnect this is a json object, array functions don't work
});
setInterval(function () {
  io.sockets.emit('state', players);
}, 1000 / 60);