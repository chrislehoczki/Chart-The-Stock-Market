'use strict';

var express = require('express');
var app = express();
//var timeout = require('connect-timeout');

var routes = require('./app/routes/index.js');


var server = require('http').Server(app);
var io = require('socket.io')(server);

//app.use(timeout('1s'));

app.use('/public', express.static(process.cwd() + '/public'));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));


app.get('/', function(req, res) {
  res.send('hello world');
});


var stocks = [];
io.on('connection', function (socket) {
	console.log("user connected")
  
  socket.on('clientStocks', function (data) {
    console.log(data);
	stocks.push(data)
    socket.emit('serverStocks', { stocks });
  });
});

routes(app);


var port = 3000;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
