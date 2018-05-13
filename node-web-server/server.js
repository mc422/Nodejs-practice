const express = require('express');
const hbs = require('hbs');

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('home.hbs', {
		PageTitle: 'About Page',
		WelcomeMessage: 'Welcome to Home Page'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		PageTitle: 'About Page',
		CurrentYear: new Date().getFullYear()
	});
});

app.listen(3000);
