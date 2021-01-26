require('dotenv').config();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const io = require('socket.io')(server);

//io handler
require('./client/handler')(io);

server.listen(process.env.PORT || 3000, function(){
    console.log(`Fiaai Web App Running ${process.env.NODE_ENV} on PORT ${process.env.PORT || 3000}`);
})