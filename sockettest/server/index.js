var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// When devices connect to the server... 
io.on('connection', function (socket) {
    // log the socket ID of the device
    console.log(socket.id);
    // Listening for event from client... invoke function
    socket.on('pressButton', () => {
        console.log('got the thing');
        // Create an event and send it to all clients except one that triggered 'pressButton'
        socket.broadcast.emit('receiveMsg');
        // If we wanted to ALSO send to the client that invoked the first function we can run another emit to send back to that device too...
        //socket.emit('receiveMsg');
    });
});

