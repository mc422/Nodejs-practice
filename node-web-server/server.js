const express = require('express');

var app = express();

app.get('/', (req, res) => {
	res.send({
		Name: 'test',
		like: [
			'start work'
		]
	});
});

app.get('/about', (req, res) => {
	res.send('hello, world');
});

app.listen(3000);
