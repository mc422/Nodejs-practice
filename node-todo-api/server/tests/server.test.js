const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodos = [
  {
    text: 'test todo 1'
  },
  {
    text: 'test todo 2'
  }
];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testTodos);
  }).then(() => done());
});


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
