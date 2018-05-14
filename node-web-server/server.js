const express = require('express');
const hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

app.get('/', (req, res) => {
	res.render('home.hbs', {
		PageTitle: 'Home Page',
		WelcomeMessage: 'Welcome to Home Page'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		PageTitle: 'About Page'
	});
});

app.listen(3000, () => {
	console.log('Server running at port 3000');
});
