// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
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
io.on('connection', function (socket) { });

// Just leaving this here in case we need it later

// setInterval(function() {
//     io.sockets.emit('testing connection please ignore');
//   }, 1000);

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
} //end of getRandomNumber: use this to generate a random integer, define the maximum in the parameter

const canvasWidth = 1000
const canvasHeight = 600
playerSize = 20 //define player size
let players = {};
let number = 1
let pId = 1
let infectionSeed = false
let numberOfInfected = 0

io.on('connection', function (socket) {
  socket.on('new player', function () {
    players[socket.id] = {
      socket: socket.id,
      name: "Player " + number++,
      pid: pId++,
      x: getRandomNumber(canvasWidth),
      y: getRandomNumber(canvasHeight), //these coordinates are the starting position of a player
      color: 'SkyBlue',
      infected: false,
      speed: 6,
      size: 20
    };
  });

  socket.on('movement', function (data) {
    let player = players[socket.id] || {};
    if (data.left && player.x > 0) {
      if (player.infected === true) player.x -= player.speed; //infected move at a speed of 7 non-infected move at a speed of 5
      else { player.x -= player.speed; } //these numbers control movement speed higher = faster 
    }
    if (data.up && player.y > 0) {
      if (player.infected === true) player.y -= player.speed
      else { player.y -= player.speed; }
    }
    if (data.right && player.x < canvasWidth - player.size) {
      if (player.infected === true) player.x += player.speed;
      else { player.x += player.speed; }
    }
    if (data.down && player.y < canvasHeight - player.size) {
      if (player.infected === true) player.y += player.speed;
      else { player.y += player.speed; }
    }
    if (players) { //if players exist
      socketArray = Object.keys(players) //create an array of socket IDs
      dataArray = Object.values(players) //create an array of data objects (eg. xcoords/ycoords)
      if (socketArray.length > 1 && infectionSeed === false) { //if there is more than 1 player and there are no infected...
        console.log("Conditions for an infection have been met - picking a victim")
        chosenOne = socketArray[getRandomNumber(socketArray.length)]
        console.log(socketArray)
        console.log(`${chosenOne} is the chosen one`)
        players[chosenOne].infected = true //random player becomes infected
        players[chosenOne].color = 'Tomato'
        infectionSeed = true
        numberOfInfected++
      }
      
      //console.log(numberOfInfected, socketArray.length)
      if (numberOfInfected > 1 && infectionSeed === true) {
        if (numberOfInfected === socketArray.length) { //if all endgame conditions are met...reset everything
          console.log("game over")
          resetPositions = dataArray.map(index=>{
            index.x=getRandomNumber(canvasWidth-playerSize)
            index.y=getRandomNumber(canvasHeight-playerSize)
            index.infected = false
            index.color = 'SkyBlue'
            index.speed = 6
          })
          //players = {}
          infectionSeed = false
          numberOfInfected = 0
        }
      }
      for (i = 0; i < dataArray.length; i++) { //for each index of dataArray 
        if (player.x + playerSize > dataArray[i].x &&
          player.x < dataArray[i].x + playerSize &&
          socket.id !== socketArray[i]) { //if player x is the same as one of the data packets and the socketIDs don't match
          if (player.y + playerSize > dataArray[i].y &&
            player.y < dataArray[i].y + playerSize &&
            socket.id !== socketArray[i]) { //if player y is the same as one of the data packets and the socketIDs don't match
            if (player.infected === false && dataArray[i].infected === true) {
              console.log(`${player.name} has become infected`)
              player.infected = true
              player.color = 'Tomato'
              player.speed = player.speed + 2 //gives infected a +2 speed boost
              numberOfInfected++
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