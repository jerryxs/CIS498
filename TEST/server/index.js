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

    socket.on('onPressEnterData', (data) => {
        console.log('We Gotem');
        console.log(data.csvData);
    })
});