window.onload = () => {
	document.querySelector('input:last-child').focus()
	document.querySelector('.files').style.height = (document.innerHeight - 250) + 'px'

	const socket = io()
	let input = document.querySelector('input:last-child')
	let cmd = document.querySelector('.cmd')

	socket.on('cmd-response', response => {
		let response = document.createTextNode(`~$ ${response}<br />`)
		cmd.appendChild(response)
	})
}