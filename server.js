const express = require('express'),
	app = express(),
	{ spawn } = require('child_process'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	http = require('http').Server(app)

app.use(bodyParser.json());

app.use(express.static('front-end'))

io.on('terminal-connection', socket => {
	console.log('A terminal connected.');
	socket.on('disconnect', () => {
	    console.log('terminal disconnected');
	})
	socket.on('command', cmd => {
		console.log('Execute:', cmd)
	    io.emit('cmd-response', `${cmd} executed`)
    })
});

http.listen(process.env.PORT || 3006, (err) => {
	console.log('Listening on port:', process.env.PORT || 3006)
})