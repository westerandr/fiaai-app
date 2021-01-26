
module.exports = function(io){

    //check if room name exists 

    io.on('connection', function(socket){
        console.log(`${socket.id} has connected`);

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

        




        socket.on('disconnect', () => {

        });
    })





}