const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server.');
	}
	console.log('Connect to MongoDB server.');
	const db = client.db('TodoApp');

	// handle callback with promise
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5afbd62b5b510211db8f9eb3')
	// }, {
	// 	$set: {
	// 		completed: false
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(JSON.stringify(result, undefined, 2));
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5afc986c0d8875f1b27b6902')
	}, {
		$inc: {
			age: -2
		},
		$set: {
			name: 'Chao2'
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(JSON.stringify(result, undefined, 2));
	})

	client.close();
});