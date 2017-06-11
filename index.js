var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var categorie = [ 
	{ _id: 1, categoria: "antipasti" },
	{ _id: 2, categoria: "primi piatti" },
	{ _id: 3, categoria: "secondi piatti" },
	{ _id: 4, categoria: "dolci" },
	{ _id: 5, categoria: "bibite" }
];

var piatti = [
	{ _id: 1, catId: "cat1", categoria: "antipasti", piatto: "Salumi" },
	{ _id: 2, catId: "cat1", categoria: "antipasti", piatto: "Bruschette" },
	{ _id: 3, catId: "cat2", categoria: "primi piatti", piatto: "Pasta al pomodoro" },
	{ _id: 4, catId: "cat3", categoria: "secondi piatti", piatto: "Salsiccia alla brace" },
	{ _id: 5, catId: "cat3", categoria: "secondi piatti", piatto: "Arrosto di vitello" },
	{ _id: 6, catId: "cat4", categoria: "dolci", piatto: "Tiramisu" },
	{ _id: 7, catId: "cat5", categoria: "bibite", piatto: "Acqua minerale" },
	{ _id: 8, catId: "cat5", categoria: "bibite", piatto: "Coca Cola" }
];

var comande = [
	{ _id: 1, tavolo: 1, coperti: 3, piatti: [
		{ piatto: 1, qty: 3 },
		{ piatto: 3, qty: 2 },
		{ piatto: 4, qty: 1 },
		{ piatto: 7, qty: 1 }
] }
];

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/categorie', function (req, res) {
  res.sendFile(__dirname + '/categorie.html');
});

app.get('/piatti', function (req, res) {
  res.sendFile(__dirname + '/piatti.html');
});

app.get('/comanda', function (req, res) {
  res.sendFile(__dirname + '/comanda.html');
});

io.on('connection', function (socket) {
  console.log('nuovo utente connesso');

  socket.on('req_categorie', function () {
    socket.emit('lista_categorie', categorie);
  });
  
  socket.on('req_piatti', function () {
    socket.emit('lista_piatti', { categorie: categorie, piatti: piatti });
  });

  socket.on('nuova-categoria', function (data) {
    categorie.push(data);
    io.emit('categoria', data);
    console.log(categorie);
  });

  socket.on('nuovo-piatto', function (data) {
	  piatti.push(data);
	  console.log(piatti);
  });

  socket.on('req_comanda', function (data) {
    var tavolo = data.tavolo;
    var comanda;
    for (var i = 0; i < comande.length; i++) {
      if (comande[i].tavolo == tavolo) {
        comanda = comande[i];
        break;
      }
    }
    socket.emit('comanda', { comanda: comanda });
  });

  socket.on('update-comanda', function (data) {
    console.log(data);
    for (var i = 0; i < comande.length; i++) {
      if (comande[i]._id == data.comanda._id) {
        comande[i] = data.comanda;
        break;
      }
    }
    io.emit('comanda', { comanda: comande[i] });
  });
});
