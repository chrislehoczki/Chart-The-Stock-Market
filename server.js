'use strict';

var express = require('express');
var app = express();
var routes = require('./app/routes/index.js');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/components', express.static(process.cwd() + '/app/components'));

routes(app);

var port = 8080;
server.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

var stocksArr = [];


io.on('connection', function (socket) {
	console.log("user connected")
	io.emit('serverStocks', { stocks: stocksArr });

    socket.on('clientStocks', function (data) {
  
    //CHECK IF STOCK EXISTS ON SERVER ARRAY
    console.log("received client stock")
    var stockExists = false;
    stocksArr.map(function(stock) {
        if (stock.name === data.stock.name) {
          stockExists = true; 
          return;
        }
        
    });
    
    //IF DOESNT EXIST - push data onto array
    if (!stockExists) {
        stocksArr.push(data.stock);
        //SEND IT OUT TO EVERYONE
    
    }
    console.log(stocksArr)
    io.emit('serverStocks', { stocks: stocksArr });
    
  });
  
   socket.on('removeStock', function (data) { 
       
       //REMOVE STOCK IF EXISTS IN ARRAY
        var newArr = [];
        stocksArr.map(function(stock) {
            if (data.stock !== stock.name) {
                newArr.push(stock)
            }
        
        });
        stocksArr = newArr;
        
        //SEND OUT TO USERS
        io.emit('serverStocks', { stocks: stocksArr });
    });
      
  

});


