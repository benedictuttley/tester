
			// We make the socket connection to the web server that is on port 8080
			//var socket = io();

			// Global Variable to store name of player


			// 	Display maths question in container held within this variable
			var allUsers = document.getElementById("users");
			var mQuestion = document.getElementById("mathsQuestion");


			/* When a 'welcome' emit is sent from the node server then the contents of the welcome div is updated
			   to contain the username of the player. The data property has compnents including the name of the
			   player and the current score of the player which will be zero initially.*/
			socket.on('Welcome', function(data) {
				welcome.innerHTML = "<br> Welcome to the game <strong>" + data.name + "</strong>";
				//playerName = data.name;
			});

			socket.on("recieved", function(data) {
				console.log(data);
			});


			// When a 'users' emit is sent from the node server, the contents of the allUsers div is updated
			// to contain a list of the current users in the game.
			socket.on('users', function(data) {
				console.log("activated");
				allUsers.innerHTML = "";
				console.log(data.length);
				for (var i = 0; i < data.length; i++) {
					console.log(data[i].name);
					console.log(playerName);
					var user = data[i].name;
					var user_score = data[i].score;

					// Create a div for each player
					var newDiv = document.createElement("div");
					newDiv.setAttribute("id", "Div1");

					/*If the user currently selected on this iteration is the same as the username of the player then
					  give the player a different div with a different style. This style has a green background and
					  differentiates the players div from the otehr players div which is red.*/
					if (user == playerName) {
						console.log("style should be added...");
						newDiv.setAttribute("id", "Div2");
					};
					newDiv.setAttribute("style", "width:" + ((user_score * 50) + 100) + "px");
					newDiv.innerHTML = "<strong>Users:</strong><br />" + user + " " + user_score;
					allUsers.appendChild(newDiv);
					var br = document.createElement("br");
					allUsers.appendChild(br);

				};

			});



			// When a 'win' emit is sent from the node server then the contents of the results div is updated
			// so that it displays a message stating who answered the question correctly.
			socket.on('win', function(data) {
				results.innerHTML = data.message;
			});

			socket.on('test', function(data) {
				prompt('Welcome to the room: ' + data);
			});
			/* When the user answers 10 questions correctly the server emits a gameWon emit and the game winner
			   div is updated so that it displays a message stating who the winner of the game was. In future
			   versions i hope to have a game stats or leaderboard table will be shown. */

			socket.on('gameWon', function(data) {
				gameWinner.innerHTML = data.message;
			});

			socket.on('yourGame', function(data) {
					myGame = data;
					console.log(myGame);
			});



			// Update the div to contain the new question sent from the node server
			socket.on('newQuestion', function(data) {
				mQuestion.innerHTML = "<strong>Maths Question:</strong><br />" + data;
			});


			// When a user clicks the submit button, then contents of the input field is retrieved and sent to the node
			// server for evaluation (is it corect or incorrect).
			mAnswer.onclick = function myAnswer() {
				var ans = document.getElementById("myAnswerToQuestion").value;
				socket.emit('mathAnswer', {
					answer: ans,
					player: playerName,
					theGame: myGame
				});
			}

			// If a user has correctly answerd a question, a div is updated so that it displays the message that contains the
			// username of the user who answerd the question correctly.
			socket.on('corr_ans', function(data) {
				mathsWinner.innerHTML = data.message;
			});

			/* Start game when enough users have joined. Currntly this just means hiding the loading screen and displaying the game
			   window. In future versions i will make a sort of waiting lobby that then closes (or a new html page is displayed) when
			   the start game emit is recieved. */
			socket.on('gameStarted', function(data) {
				console.log("WTF IS GOING ON!!??");
				document.getElementById('loader').style.display = "none";
				document.getElementById("gameWindow").style.display = "block";
			});

			/* When the game is over and the emit is recieved, the game window is hidden and the final stats div, that still needs to be
			   developed, is displayed to the user. There eill then need to be options displayed including finding a new game or exiting
			   the game (bare minimum). */
			socket.on('gameEnded', function(data) {
				console.log("Game Over!");
				document.getElementById("gameWindow").style.display = "none";
				//document.getElementById('finalStats').style.display = "block";
				window.location.href = data;
			});


			/* Listener that will result in a player being allocated a new game after they have chosen to find a new game. Currently no action
			   is performed when a user chooses to find a new game. This will be integrated into the final stats display and when clicked, it
			   should be possible for the user to join a new game. */
			fGame.onclick = function newGame() {

				// Player would be entered into a new game lobby...
			};