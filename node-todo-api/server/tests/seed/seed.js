const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'test todo 1'
  },
  {
    _id: new ObjectID(),
    text: 'test todo 2',
    completed: true,
    completeAt: 300
  }
];

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testTodos);
  }).then(() => done());
};

const testUserIds = [new ObjectID(), new ObjectID()];
const testUsers = [{
  _id: testUserIds[0],
  email: 'email@test.com',
  password: 'testpassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: testUserIds[0], access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: testUserIds[1],
  email: 'email2@test.com',
  password: 'testpassword2'
}];

var populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(testUsers[0]).save();
    var userTwo = new User(testUsers[1]).save();

    return Promise.all([userOne], userTwo);
  }).then(() => done());
};

module.exports = {
  testTodos,
  populateTodos,
  testUsers,
  populateUsers
}
