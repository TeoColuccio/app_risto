var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var coords = [ { x: 1, y: 2}, 
  {x: 7, y: 7}
];

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('nuovo utente connesso');
  
  socket.emit('lista_coords', coords);

  socket.on('distanza', function (data) {
    console.log(data);
    var d = Math.sqrt(data.x*data.x + data.y * data.y);

    /* Memorizza il dato del db */
    coords.push(data);
    console.log(coords);

    socket.emit('distanza_result', { dist: d});
  });
});
