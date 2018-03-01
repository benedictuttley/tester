/////////// Listeners Module -> Submitted by Developer ///////////

module.exports = function (socket, game, io, myGameInstances) {
	
	socket.on('mathAnswer', function(data) {
        
        var gamea;
            
            for(var i = 0; i< myGameInstances.length; i+=2){
                
                if (myGameInstances[i] == data.theGame) {
                        
                        gamea = myGameInstances[i + 1];
                        gamea.evalAnswer(data);
                    }
                }
            });
        };

/////////// Listeners Module -> Submitted by Developer ///////////


// This file is imported into the index.js script and will listen for the developer-designed content. All of the listeners are for specific game
// actions such as in this example, there is only one listener on the sever side that is triggered when a user submits an answer to the current
// question. In response some action is performed, and in this example this involves the calling of the evalAnswer method of the users respective
// game object which is stored in the gameServer_Side module (again sumbitted by the developer) and this method will then evaluate the correctness
// of the submitted answer (is it right or wrong?).