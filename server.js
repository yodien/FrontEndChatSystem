var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// add directory with our static files
app.use('/', function(req, res){
  res.sendFile(__dirname + '/indexpaint.html');
});
//console.log("Server running on 127.0.0.1:8080");

// array of all lines drawn
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });
});
   function clearingscr() {
	line_history = [];
   }
   setInterval(clearingscr,1000);

// start the HTTP server on port 8080
http.listen(3000,"0.0.0.0", function(){
  console.log('listening on *:3000');
});
