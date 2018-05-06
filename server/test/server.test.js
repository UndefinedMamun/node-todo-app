const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/Todo');
const {User} = require('./../model/User');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', ()=>{
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err)
                    return done(err);

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
            })
    });

    it('should not create data with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    });

    
})

describe('GET /todos', ()=>{
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET/todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    });

    it('shoud return 404 for non-object Ids', (done)=>{
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});


describe('DELETE/todos/:id', ()=>{
    it('should remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((e)=>{
                    done(e);
                })
            })
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if Object id is invalid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be another new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    })
});


describe('GET /users/me', () => {
    it('should return user if authinticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done);
    });

    it('should return 401 if not authinticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });

});


describe('POST /users', () => {
    it('should create a new user', (done) => {
        var email = 'name@gmail.com';
        var password = 'abcd1234!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(typeof res.headers['x-auth']).toBe('string');
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    })

    it('should return validation error if invalid data provided', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'notAemail',
                password: '123'
            })
            .expect(400)
            .end(done);
    })

    it('should not create user if email already in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'abcd1234!'
            })
            .expect(400)
            .end(done);
    })
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(typeof res.headers['x-auth']).toBe('string');
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens[0].access).toBe('auth');
                    expect(user.tokens[0].token).toEqual(res.headers['x-auth']);
                    done();
                }).catch( (e) => done(e));
            })
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBe(undefined);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch( (e) => done(e));
            })
    })
})

