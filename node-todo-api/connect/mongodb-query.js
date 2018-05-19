const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5b007d22965f88f10cd67f5basdf';

Todo.find({
	_id: id
}).then((todos) => {
	console.log('find todos', todos);
});

Todo.findOne({
	_id: id
}).then((todo) => {
	if (!todo) {
		console.log('id doesnt find');
	}
	console.log('find', todo);
}).catch((err) => {
	console.log(err);
});

