module.exports = function(io){


    io.on('connection', function(socket){
        console.log(`${socket.id} has connected`);
    })





}