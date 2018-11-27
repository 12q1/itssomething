# itssomething
Itssomething is a multiplayer game called 'Infection' I built together with a partner during my time at codaisseur.

A live working version can be found here: https://itssomething.herokuapp.com/
(you will need to open it on 2 or more tabs to see the 'multiplayer')

The project is mostly an experiment in HTML canvas and Socket IO. 

Much of the game is built upon the framework provided in this tutorial:
(https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b)

However the framework is very basic and most of the collision detection and game logic was written entirely by ourselves. 

Up until this time I had never used websockets nor dealt with realtime data.

The game itself is able to handle many more then 2 players. But under the hood the netcode is rudimentary. 

Instead of usernames individuals are identified by their web socket ID. Players have an x and y coordinate that they
transmit to the server. The server then 'checks' to see if those movements are valid. The server emits multiple JSON web packets
every second to all connected websockets that contains the X and Y information of all other players. The canvas takes that
information and redraws the players at these new positions.

We tried very hard to create this application using react/redux with a separated postgres server acting as a backend but ran
into many issues. Thus we decided to strip down the application to its core. In some ways this is a bit ugly/hacky as we often
write directly to the DOM and so forth. However the resulting product is surprisingly lean and robust. 

All in all this was a great learning experience. We learned several interesting things which we would not have encountered
if we had followed the bootstrap gamestarter-kit that had been provided to us. 
