const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const testUserIds = [new ObjectID(), new ObjectID()];
const testUsers = [{
  _id: testUserIds[0],
  email: 'email@test.com',
  password: 'testpassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: testUserIds[0], access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: testUserIds[1],
  email: 'email2@test.com',
  password: 'testpassword2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: testUserIds[1], access: 'auth'}, process.env.JWT_SECRET).toString()
  }]  
}];

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'test todo 1',
    _creator: testUserIds[0]
  },
  {
    _id: new ObjectID(),
    text: 'test todo 2',
    completed: true,
    completeAt: 300,
    _creator: testUserIds[1]
  }
];

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testTodos);
  }).then(() => done());
};



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
