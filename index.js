var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;

var db;

app.use(express.static('css'));
app.use(express.static('font'));
app.use(express.static('js'));
app.use(express.static('img'));

MongoClient.connect('mongodb://localhost:27017/ristorante', function (err, database) {
  if (err) return console.log(err)
  db = database;
  server.listen(3000, function() {
    console.log('Server in ascolto sulla porta 3000 ...');
  });

  db.collection('categorie').remove({});
  db.collection('piatti').remove({});
  db.collection('comande').remove({});

  db.collection('categorie').find().count( function (err, count) {
    if (count === 0) {
      var categorie = [
      "antipasti",
      "primi piatti",
      "secondi piatti",
      "dolci",
      "bibite"
      ];
      console.log('inserimento categorie');
      for (var i = 0; i < categorie.length; i++) {
        db.collection('categorie').insert({ categoria: categorie[i] });
      }
    }
  });

  db.collection('piatti').find().count( function (err, count) {
    if (count === 0) {
      db.collection('categorie').findOne({ categoria: 'antipasti'}, function (err, result) {
        if (err) { console.log(err); return; }
        console.log(result);
        var piatti = [
        	{ catId: result._id, piatto: "Salumi" },
        	{ catId: result._id, piatto: "Bruschette" },
        ];
        console.log('inserimento antipasti');
        for (var i = 0; i < piatti.length; i++) {
          db.collection('piatti').insert({
            catId: piatti[i].catId,
            piatto: piatti[i].piatto
          });
        }
      });
      db.collection('categorie').findOne({ categoria: 'primi piatti'}, function (err, result) {
        if (err) { console.log(err); return; }
        console.log(result);
        var piatti = [
        	{ catId: result._id, piatto: "Pasta al pomodoro" },
        	{ catId: result._id, piatto: "Salsiccia alla brace" },
        ];
        console.log('inserimento primi piatti');
        for (var i = 0; i < piatti.length; i++) {
          db.collection('piatti').insert({
            catId: piatti[i].catId,
            piatto: piatti[i].piatto
          });
        }
      });
      db.collection('categorie').findOne({ categoria: 'secondi piatti'}, function (err, result) {
        if (err) { console.log(err); return; }
        console.log(result);
        var piatti = [
        	{ catId: result._id, piatto: "Arrosto di vitello" },
        ];
        console.log('inserimento secondi piatti');
        for (var i = 0; i < piatti.length; i++) {
          db.collection('piatti').insert({
            catId: piatti[i].catId,
            piatto: piatti[i].piatto
          });
        }
      });
      db.collection('categorie').findOne({ categoria: 'dolci'}, function (err, result) {
        if (err) { console.log(err); return; }
        console.log(result);
        var piatti = [
        	{ catId: result._id, piatto: "Tiramisu" },
        ];
        console.log('inserimento dolci');
        for (var i = 0; i < piatti.length; i++) {
          db.collection('piatti').insert({
            catId: piatti[i].catId,
            piatto: piatti[i].piatto
          });
        }
      });
      db.collection('categorie').findOne({ categoria: 'bibite'}, function (err, result) {
        if (err) { console.log(err); return; }
        console.log(result);
        var piatti = [
        	{ catId: result._id, piatto: "Acqua minerale" },
        	{ catId: result._id, piatto: "Coca Cola" }
        ];
        console.log('inserimento bibite');
        for (var i = 0; i < piatti.length; i++) {
          db.collection('piatti').insert({
            catId: piatti[i].catId,
            piatto: piatti[i].piatto
          });
        }
      });
    }
  });
  db.collection('comande').find().count( function (err, count) {
    if (count === 0) {
      var comande = [
      	{ //_id: 1,
          tavolo: 1,
          coperti: 3,
          piatti: [
            //{ piatto: 1, qty: 3 },
            //{ piatto: 3, qty: 2 },
            //{ piatto: 4, qty: 1 },
            //{ piatto: 7, qty: 1 }
          ]
        }
      ];
      console.log('inserimento comande');
      for (var i = 0; i < comande.length; i++) {
        db.collection('comande').insert(comande[i]);
      }
    }
  });
});

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
    var categorie = db.collection('categorie').find();
    categorie.toArray( function (err, result) {
      socket.emit('lista_categorie', result);
    });
  });

  socket.on('nuova-categoria-req', function (data) {
    db.collection('categorie').insert(data, function (err, result) {
      //console.log(result);
      io.emit('categoria', result.ops[0]);
    });
  });

  socket.on('req_piatti', function () {
    var piatti = db.collection('piatti').find();
    piatti.toArray( function (err, result) {
      socket.emit('lista_piatti', result);
    });
  });

  socket.on('nuovo-piatto-req', function (data) {
    db.collection('piatti').insert(data, function (err, result) {
      console.log(result);
      io.emit('piatto', result.ops[0]);
    });
  });

  socket.on('req_comanda', function (data) {
    var tavolo = parseInt(data.tavolo);
    db.collection('comande').findOne({ tavolo: tavolo }, function (err, result) {
      console.log(result);
      socket.emit('comanda', { comanda: result });
    });
  });

  socket.on('update-comanda', function (data) {
    console.log(data);
    //for (var i = 0; i < comande.length; i++) {
    //  if (comande[i]._id == data.comanda._id) {
    //    comande[i] = data.comanda;
    //    break;
    //  }
    //}
    //io.emit('comanda', { comanda: comande[i] });
  });
});
