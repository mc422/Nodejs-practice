const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server.');
	}
	console.log('Connect to MongoDB server.');
	db = client.db('TodoApp');

	db.collection('Todos').deleteMany({
		text: 'go to dentist'
	}).then((result) => {
		console.log(result);
	});

	db.collection('Todos').deleteOne({
		text: 'go to dentist'
	}).then((result) => {
		console.log(result);
	});

	db.collection('Todos').findOneAndDelete({
		completed: false
	}).then((result) => {
		console.log(result.value);
	});

	client.close();
});