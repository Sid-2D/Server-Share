const express = require('express'),
	app = express(),
	{ spawn } = require('child_process'),
	fs = require('fs'),
	bodyParser = require('body-parser')

app.use(bodyParser.json());

app.use(express.static('front-end'))

app.post('/cmd', (req, res) => {
	const command = req.body.command
	const commandArray = command.split(' ')
	const childProcess = spawn(commandArray[0], commandArray.slice(1))

	// TODO: Make a live connection
	childProcess.stdout.on('data', data => {
		console.log(`stdout: ${data}`)
	})

	childProcess.stderr.on('data', data => {
		console.log(`stderr: ${data}`)
	})

	childProcess.on('close', code => {
		console.log(`Process closed with code: ${code}`)
	})

	childProcess.on('error', err => {
		console.log(`Process error: ${err}`)
	})

	res.send()
})

app.listen(process.env.PORT || 3006, (err) => {
	console.log('Listening on port:', process.env.PORT || 3006)
})