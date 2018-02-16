const express = require('express'),
	app = express(),
	{ spawn } = require('child_process'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	multer = require('multer')

app.use(bodyParser.json());

app.use(express.static('front-end'))

// app.post('/file-upload', (req, res) => {
//     console.log("here")
//     console.log(req.body)
//     console.log(req.files)
// })

app.post('/file-upload', multer({dest: 'uploads/'}).single('file'), (req, res) => {
	console.log('here')
	res.send(json)
})

io.on('connection', socket => {
	console.log('A terminal connected.');
	socket.on('disconnect', () => {
	    console.log('terminal disconnected');
	})
	socket.on('command', cmd => {
		executeCommand(cmd)
    })
})

function executeCommand(cmd) {
	let cmdArray = cmd.split(' ')
	const childProcess = spawn(cmdArray[0], cmdArray.slice(1) || '')
	childProcess.stdout.on('data', data => {
	    io.emit('cmd-response', data.toString())
	})
	childProcess.stderr.on('data', data => {
	    io.emit('cmd-response', data)
	})
	childProcess.on('close', code => {
	    io.emit('cmd-end', code)
	})
}

http.listen(process.env.PORT || 3006, (err) => {
	console.log('Listening on port:', process.env.PORT || 3006)
})