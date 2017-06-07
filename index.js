var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var categorie = [ "antipasti", "primi piatti", "secondi piatti", "dolci", "bibite"];

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('nuovo utente connesso');
  
  socket.emit('lista_categorie', categorie);

  socket.on('lista_categorie', function (data) {
    console.log(data);

    /* Memorizza il dato del db */
    coords.push(data);
    console.log(categorie);

    socket.emit('lista_categorie');
  });
});
