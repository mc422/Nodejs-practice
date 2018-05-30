const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {testTodos, populateTodos, testUsers, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
	it('should create a new Todo', (done) => {
    var text = 'test new todo';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((docs) => {
          expect(docs.length).toBe(1);
          expect(docs[0].text).toBe(text);
          done();
        }).catch((err) => {
          done(err);
        });
      });
	});

  it('should not create on invalid text', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((docs) => {
          expect(docs.length).toBe(2);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid ObjectID', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo', (done) => {
    var hexId = testTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid ObjectID', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });  
});

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    var hexId = testTodos[0]._id.toHexString();
    var text = 'test update todo';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeTruthy();
        expect(typeof res.body.todo.completeAt).toBe('number');
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(text);
          expect(todo.completed).toBeTruthy();
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should clear completeAt when completed is false', (done) => {
    var hexId = testTodos[1]._id.toHexString();
    var text = 'test update todo';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.completeAt).toBeNull();
      }).end((err, res) => {
        if (err) {
          done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(text);
          expect(todo.completed).toBeFalsy();
          expect(todo.completeAt).toBeNull();
          done();
        }).catch((err) => {
          done(err);
        })
      })
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    var text = 'test update todo';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text
      })
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(testUsers[0]._id.toHexString());
        expect(res.body.email).toBe(testUsers[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var userJson = {
      email: 'newuser@test.com',
      password: '1234567'
    };

    request(app)
      .post('/users')
      .send(userJson)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(userJson.email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find({email: userJson.email}).then((docs) => {
          expect(docs.length).toBe(1);
          expect(docs[0].email).toBe(userJson.email);
          expect(docs[0].password).not.toBe(userJson.password);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'abc.com'
    var password = '1234567'

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = testUsers[0].email;
    var password = '1234567';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);    
  })
});

describe('POST /users/login', () => {
  it('should login user and create a token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: testUsers[1].email,
        password: testUsers[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(testUsers[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          expect(user.toObject().tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: testUsers[1].email,
        password: 'invalid_pass'
      })
      .expect(400)
      .end(done);
  });
});

describe('DELETE /users/logout', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/logout')
      .set('x-auth', testUsers[0].tokens[0].token)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(testUsers[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
