var {mongoose} = require('./db/mongoose');
var {Todo} = require('./modles/todo');
var {User} = require('./models/user');

var newTodo = new Todo({
  text: 'take online course 2'
});
newTodo.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(`Unable to save data, ${err}`);
});

var newUser = new User({
  email: 'chaomeng@test.com'
});
newUser.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(`Unable to save data, ${err}`);
});
