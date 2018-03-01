/////////// index.js -> The (eventual)framework ///////////

/*TODO:
Make a leaderboard
Clean up code considerably! -- /// CURRENT TASK /// --> Due: 25th Febuary
Prevent users from joining when the game has begun -- for now an error message or redirect is adequate
Have dummy list of current lobbies that have spaces - 'could be in a view lobbies section'
Writing code to database

Author: Benedict Uttley
   Last Revision: 13/02/2018
   Version 1.1
   */
/* The code contained in index.js sets up a web server using the Node js run time environment. I have created a set of functions that allow simple
   client to server communication. Although the functions actual data will change (perhaps only slightly) from game to game, the structure can be used
   as the foundation of most of the games we will make.*/
/* For this simple maths game and games in the future, a number of tools have been used in addition to the basic Node install. Firstly to make the
   creation of the web server easier, the express framework has been used which just makes the same functionality possible in fewer lines and it makes
   tasks like serving the html pages to the users much easier. Secondly, what has made this multiplayer game creation not only possible but fast to
   create is the use of Socket.io which is a javascript library that allows for bi-directional communication between the users web browser and the
   server but also makes this communication real time, which is what gives it an interactive feel. It basically manages socket connections meaning
   when a new user connects (at the moment just to localhost:8080 on my computer) they have a socket created for them. This socket is like a
   communication channel between them and the server. This means that you can essentially send messages from server to client (or server to all
   clients, a broadcast) and from client to server.*/
/* When you have installed node you can install express and socket.io from the command line using the node package manager(npm). For example to
    install socket.io you would type npm install socket.io and it should then be installed.*/

//////////////////////////////////////////////////////////// CODE START //////////////////////////////////////////////////////////////////////////



var myGameInstances = []; // Stores the game instances so that the state of different game lobbies is not lost


/////////// Application Setup ///////////


// We use express to set up the application
var express = require('express');
var app = express();
// We create the http server
var server = require('http').createServer(app);
// We use sockets for our communication and the sockets will communicate on the server created above
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser')
/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());







// This module is needed for this application as the game creates random usernames, the moniker module is used to generate these names
var Moniker = require('moniker');

// Here we declare the file we want to send to the client when a new user connects to the server, in this example it is page.HTML
var game_Name = ""
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/Maths_Mania'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  var url = require("url");
  var params = url.parse(req.url,true).query;
  console.log(params.game_Name);
  game_Name = params.game_Name;
  res.sendFile(__dirname + '/page.html');
 
});
// We will run the web server on port 8080 which is the standard for a web server application
server.listen(process.env.PORT || 8080);

/////////// Application Setup ///////////




/////////// Listeners (required regardless of game played) ///////////


/* This is the first use of socket.io in this application. io.sockets.on() is used when you are referring to all connections, so all the current
   players in the maths game. Here we are saying that when a new connection is established (which is detected automatically) then a socket is
   created for that connection and this socket is unique to that client. */


var name; // Holds the username of connection
var game; // Holds the game instance

io.sockets.on('connection', function(socket) {

    const Game = require('./gameServer_Side.js');

    // Print out a log indicating there has been a new connection, just useful for testing
    console.log("Successful Connection!");


    socket.on('login', function(playerName) {
        name = playerName;
        socket.username = playerName;
        console.log("player name is: " + playerName);
    });

    socket.on('room', function(room) {


        if (io.sockets.adapter.rooms[room]) { // Check if room the user wants to join already exists...
            socket.join(room); // joining the new room
            socket.room = room;

            // search for existing game object...
            for (var i = 0; i < myGameInstances.length; i++) {
                // joining the existing room;
                if (myGameInstances[i] == room) {
                    // Fetch the respective game instance...
                    game = myGameInstances[i + 1];
                }
            }

            // should really store game data in Json or some other more readable format rather than a object array...

            // If the user wants to join a new lobby...
        } else {

            socket.join(room); // joining the new room
            socket.room = room;
            game = new Game(socket.room, io);
            myGameInstances.push(room);
            myGameInstances.push(game);

        };

        io.sockets.in(room).emit('message', 'User ' + socket.username + ' has joined the lobby');
        game.addUsertoGame(socket.id,name);
        game.addUser(name);
        game.showUsers();
        socket.emit("yourGame", game.roomId);

/////////// Listeners (required regardless of game played) ///////////


/////////// Listeners (chat specific) ///////////


socket.on('clientMessage', function(data){
  io.sockets.in(room).emit('message', socket.username + ' ~ ' + data );
});


socket.on('disconnect', function() {

console.log("disconnection detected...");
for(var i = 0; i< myGameInstances.length; i+=2){   
         console.log(myGameInstances[i]);      
    
    if (myGameInstances[i] == socket.room) {
           gamea = myGameInstances[i + 1];
                   
  for (var i = 0; i < gamea.Users.length; i += 2) { // Search for player name to remove
                if (gamea.Users[i] == socket.id) {

                    var playerToRemove = gamea.Users[i + 1];
                    gamea.removeUser(playerToRemove);
                    io.sockets.in(room).emit('message', 'User ' + socket.username + ' has left the lobby');
                  }
              }
            }
          }
        });

    var listeners = require('./gameListeners.js')(socket, game, io, myGameInstances);
    console.log("Number of lobbies for the game: " + (myGameInstances.length / 2));
    });
  });

/*  Just a quick overview of what has happened in the above core functions:
    The addUser function creates a new user with a unique random name and appends it to the array called users.
    The removeUser function removes a given user form the array called users.
    The updateUsers function sends a string containing a list of all the current users in the game including the users name and score.*/
