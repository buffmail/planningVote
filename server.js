var http = require("http");
var url = require("url");
var fs = require("fs");
var io = require('socket.io');

var voteHtmlPath = __dirname + "/vote.html";

var server = http.createServer(function(request, response) {
	var path = url.parse(request.url).pathname;

	switch(path) {
	case '/':
	case '/control.html':
		var fullPath = voteHtmlPath;
		if (path !== '/')
			fullPath = __dirname + path;

		fs.readFile(fullPath, function(error,data) {
			if (error) {
				response.writeHead(404);
				response.write("oops file doesn't exist - 404");
			}
			else {
				response.writeHead(200, {"Content-Type": "text/html"})
				response.write(data, "utf8");
			}
			response.end();
		});
		break;

	default:
		response.writeHead(404);
		response.write("oops 404");
		response.end();
		break;
	}

});

server.listen(8080);

var io2 = io.listen(server);

io2.sockets.on('connection', function(socket){
	var connId = socket.conn.id;
    console.log("connected " + connId);

	socket.on('disconnection', function(){
		console.log('disconnected');
	});
    socket.on('reqVote', function(data){
		console.log(data.name + ' voted : ' + data.select);
		io2.sockets.emit('onVote', data);
    });
	socket.on('reqClearVote', function(data){
		io2.sockets.emit('clearVote', {});
	});
});

