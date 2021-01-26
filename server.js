require('dotenv').config();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);

server.listen(process.env.PORT || 3000, function(){
    console.log(`Fiaai Web App Running ${process.env.NODE_ENV} on PORT ${process.env.PORT || 3000}`);
})