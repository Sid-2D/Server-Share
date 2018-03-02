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

app.use('/files', express.static('uploads'))

// app.post('/file-upload', (req, res) => {
//     console.log("here")
//     console.log(req.body)
//     console.log(req.files)
//     res.send('done')
// })

app.post('/file-upload', multer({storage: multer.diskStorage({
	destination: (req, file, next) => {
		next(null, __dirname + '/uploads')
	},
	filename: (req, file, next) => {
		next(null, file.originalname)
	}
})}).single('file'), (req, res) => {
    console.log(req.file)
	res.send('done')
})

app.get('/contents', (req, res) => {
	fs.readdir(__dirname + '/uploads', (err, items) => {
		if (err) {
			console.log(err)
		}
	    console.log(items)
		res.send(JSON.stringify(items || []))
	})
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
	const childProcess = spawn(cmdArray[0], cmdArray.slice(1) || '', {
		cwd: __dirname + '/uploads'
	})
	console.log(cmdArray[0])
	console.log(cmdArray.slice(1) || '')
	childProcess.stdout.on('data', data => {
		console.log(data.toString())
	    io.emit('cmd-response', data.toString())
	})
	childProcess.stderr.on('data', data => {
		console.log(data.toString())
	    io.emit('cmd-response', data.toString())
	})
	childProcess.on('error', err => {
		console.log(err)
	    io.emit('cmd-end', {
	    	type: 'error',
	    	message: err
	    })
	})
	childProcess.on('close', code => {
	    io.emit('cmd-end', {
	    	type: 'success',
	    	message: `code: ${code}`
	    })
	})
}

http.listen(process.env.PORT || 3006, (err) => {
	console.log('Listening on port:', process.env.PORT || 3006)
})