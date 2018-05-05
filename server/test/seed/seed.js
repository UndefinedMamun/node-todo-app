const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/Todo');
const {User} = require('./../../model/User');



const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
},{
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333

}];


const populateTodos = (done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=> done());
};


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'test1@gmail.com',
    password: 'test1password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},{
    _id: userTwoId,
    email: 'test2@gmail.com',
    password: 'test2password'
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne,userTwo]);
    }).then(() => done());
}




module.exports = {todos, populateTodos, users, populateUsers};