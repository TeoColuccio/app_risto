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
  socket.emit('lista_categorie', categorie);
  console.log('nuovo utente connesso');
  
  console.log(categorie);
  socket.on('btn-nuova-categoria', function (data) {
  console.log('bottone cliccato');
  categorie.push(data);
  });
});
