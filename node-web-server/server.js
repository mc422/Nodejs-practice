const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append into file');
		}
	});
	next();
});

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

app.get('/github', (req, res) => {
	res.render('git.hbs', {
		PageTitle: 'Github Link',
		GithubLink: 'https://github.com/mc422/Nodejs-practice'
	});
});

app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});
