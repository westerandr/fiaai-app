
module.exports = function(io){

    //check if room name exists 

    const users = [];
    const OPTIMAL_NUM_TO_START = 2;
    let userLeader, votesCasted = 0;
    const game = {
        winners: [],
        started: false,
        placesVotesMap: [
        {
            id: '601571c750166a2e84e8cf64',
            place: 'Coffee Bean',
            votes: 0
        },
        {
            id: '6015723d50166a2e84e8cf65',
            place: 'Georgies Pizza',
            votes: 0
        },
        {
            id: '6015742f50166a2e84e8cf66',
            place: 'Island Grill',
            votes: 0
        },
        {
            id: '6015745450166a2e84e8cf67',
            place: 'Izzys',
            votes: 0
        },
        {
            id: '6015746150166a2e84e8cf68',
            place: 'Krush',
            votes: 0
        },
        {
            id: '6015746f50166a2e84e8cf69',
            place: 'McDonalds',
            votes: 0
        },
        {
            id: '6015748450166a2e84e8cf6a',
            place: 'Phat Burger',
            votes: 0
        },
        {
            id: '6015749550166a2e84e8cf6b',
            place: 'Seafood Gourmet',
            votes: 0
        },
    ]
    };
    

    io.on('connection', function(socket){
        let socketSession = socket.handshake.session;

        if(socketSession.name){

            //game started already
            if(game.started){
                let err = 'Sorry! The Game has started already, Come back later!';
                let dest = '/?errorMsg='+err;
                return io.to(socket.id).emit('redirect', dest);
            }
            
            console.log(`${socketSession.name}:sockId (${socket.id}) has connected`);
            if(users.length > 0){
                for(var i = 0; i < users.length;i++){
                    io.to(socket.id).emit('user join', users[i]);
                }
                if(socketSession.name == userLeader.name) userLeader.socId = socket.id;
            }else{
                userLeader = {name: socketSession.name, socId: socket.id};
                console.log(`user leader is ${userLeader.name}`);
            }            
            users.push({name: socketSession.name, ready: false, votes: 0});
            console.log('users: '+ users.length);
            io.emit('user join', { name: socketSession.name, ready:false });
            
    
            socket.on('disconnect', function(){
                console.log(`${socketSession.name} disconnected`);
                removeUserByName(socketSession.name);
                io.emit('user disconnect', socketSession.name);
                console.log('users: '+ users.length);
                if(users.length < 1 && game.started){
                    game.started = false;
                }
            });
    
            socket.on('user ready', function(name){
                setReadyStatus(name, true);
                io.emit('user ready', name);
                if(checkAllUsersReady()){
                    io.to(userLeader.socId).emit('all users ready'); 
                    io.emit("remove ready btn");
                                       
                }
            });
    
            socket.on('user unready', function(name){
                setReadyStatus(name, false);
                io.emit('user unready', name);
            });

            socket.on('leader start game', function(name){
                if(!userLeader.name == name)return;
                io.emit('start game');
                game.started = true;
            });

            //GAME FUNCTIONS
            socket.on('like', function(id){
                let place = game.placesVotesMap.find(p => (p.id == id));
                console.log(`${socketSession.name} liked ${place.place}`);
                likePlace(id);
                votesCasted+=1;
                userCastVote();
                if(getUserCastedVotes() == game.placesVotesMap.length) io.emit('user finish game', socketSession.name);
                checkGameStatus();
            });

            socket.on('dislike', function(id){          
                let place = game.placesVotesMap.find(p => (p.id == id));
                console.log(`${socketSession.name} disliked ${place.place}`);    
                votesCasted+=1;
                userCastVote();
                checkGameStatus();
            });
        }



        


        //create room
            //user who created assigned room leader

        //join room
            //room must be ready and not started
            //join list of users in room object if not full and game not started
        
        //leave room
            //if user leaves room, remove all of that users votes
            //if user is room leader, delegate to next person on list who joined
            //last user leaves room, delete room Object

        //game start, once num of users reaches optimal amt, started by room leader
        //game status is started, and room cannot be joined anymore


        //during game 
        //once 13 mins is up, then result is displayed
        //after result is display in 2 mins, disconnect all users and delete room object
        
        //game ended
        //users back to room screen, room becomes available to join if not full, can start new game or leave

    })


    function removeUserByName(name){
        var index = users.map(user => {
            return user.name;
          }).indexOf(name);
          
          users.splice(index, 1);
    }

    function likePlace(id){
        game.placesVotesMap.forEach(function(place){
            if(place.id == id){
                place.votes += 1;
            }
        });
    }

    function getWinners(){
        let winners = [];
        let mostVotes = Math.max(this, game.placesVotesMap.map(p => p.votes));
        game.placesVotesMap.forEach(place => {
            if(place.votes == mostVotes) winners.push(place.place);
        });
        return winners;
    }

    function checkAllVotesCasted(){
        if(votesCasted == (game.placesVotesMap.length * users.length)){
            return true;
        }
        return false;
    }

    function getUserCastedVotes(){
        return getUserByName(socketSession.name).votes;
    }

    function userCastVote(){
        let user = getUserByName(socketSession.name);
        user.votes += 1;
    }

    function checkGameStatus(){
        if(!checkAllVotesCasted) return;
        let winners = getWinners();
        game.started = false;
        if(winners.length > 1){
            io.emit('game over multiple', winners);
        }else{
            io.emit('game over single', winners[0]);
        }
    }

    function checkAllUsersReady(){
        if(users.length < OPTIMAL_NUM_TO_START) return false;
        for(var i = 0; i < users.length; i++){
            var user = users[i];
            if(!user.ready){
                return false;
            }
        }
        return true;
    }

    function getUserByName(name){
        return users.find((user) => user.name == name);
    }

    function setReadyStatus(name, ready){
        var user = getUserByName(name);
        user.ready = ready;
    }



}