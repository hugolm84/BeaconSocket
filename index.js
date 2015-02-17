var app = require('express')(), 
	http = require('http').Server(app),
	io = require('socket.io')(http),
	uuid = require('node-uuid'),
	_ = require('underscore')._;

var people = {},
	rooms = {};  

var sockets = []; 

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	console.log('a user connected');

	var inRoomID = null;
	var genUuid = uuid.v4();

	io.to(socket.id).emit('connected', genUuid);
	
	socket.broadcast.emit('chat message', "joined", genUuid);

	socket.on('disconnect', function(uuid){
		socket.broadcast.emit('chat message', "left", genUuid);
	});

	socket.on('chat message', function(msg, uuid){
		io.emit('chat message', msg, uuid);
	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
