const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server.');
	}
	console.log('Connect to MongoDB server.');
	const db = client.db('TodoApp');

	db.collection('Todos').insertOne({
		text: 'something to do',
		completed: false
	}, (err, result) => {
		if (err) {
			console.log('Unable to insert row', err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	client.close();
});