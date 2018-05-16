const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server.');
	}
	console.log('Connect to MongoDB server.');
	const db = client.db('TodoApp');

	// handle callback with promise
	db.collection('Todos').find().toArray().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to find docs', err);
	});

	db.collection('Todos').find({
		completed: true
	}).toArray().then((docs) => {
		console.log('Complete Todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to find docs', err);
	});

	db.collection('Todos').find().count().then((count) => {
		console.log(`Todo list count: ${count}`);
	}, (err) => {
		console.log('Unable to get Todos count');
	});

	client.close();
});