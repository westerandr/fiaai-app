require('dotenv').config();
const http = require('http');
const {app, session} = require('./app');
const server = http.createServer(app);
const io = require('socket.io')(server);
const db = require('./config/db');
const sharedSession = require('express-socket.io-session');

//bridge between socket and express session
io.use(sharedSession(session));

//io handler
require('./client/handler')(io);

server.on('ready', function(){
    server.listen(process.env.PORT || 3000, function(){
        console.log(`Fiaai Web App Running ${process.env.NODE_ENV} on PORT ${process.env.PORT || 3000}`);
    })
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('MongoDB Connected');
    server.emit('ready');
})

