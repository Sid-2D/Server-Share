window.onload = () => {
	const socket = io()

	document.querySelector('.files').style.height = (document.innerHeight - 250) + 'px'

	document.querySelector('.terminal form:last-child').onsubmit = event => {
		event.preventDefault()
		socket.emit('command', document.querySelector('.terminal input:last-child').value)
	}

	document.querySelector('input:last-child').focus()

	let cmd = document.querySelector('.cmd')

	socket.on('cmd-response', response => {
		let div = document.createElement('div')
		div.innerHTML = `~$ ${response}`
		cmd.appendChild(div)	
	})

	socket.on('cmd-end', response => {
		let form = document.createElement('form')
		form.innerHTML = '~$ <input id="m" autocomplete="off" />'
		cmd.appendChild(form)
		cmd.querySelector('input:last-child').setAttribute('disabled', 'true')
		form.onsubmit = event => {
			event.preventDefault()
			socket.emit('command', form.querySelector('input').value)
			form.onsubmit = e => e.preventDefault()
		}
		form.querySelector('input').focus()		
	})
}