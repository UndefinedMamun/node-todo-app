require('./config/config');

const _ = require('lodash');
const express  =  require('express');
const bodyParser  =  require('body-parser');
const {ObjectId} = require("mongodb");


var {mongooes} = require('./db/mongoose');
var {User} = require('./model/User');
var {Todo} = require('./model/Todo');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res)=>{
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({todos});
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res)=>{
    // res.send(req.params);
    let id = req.params.id;
    if(!ObjectId.isValid(id))
        res.status(404).send('invalid Id');

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo)
            res.status(404).send("todo not found by this id");
        else
            res.send({todo});
    }, (err)=>{
        res.status(400).send(); //don't send err object. cause it may content info about database.
    })
});

app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id))
        res.status(404).send('Invalid Id');
    
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo){
            res.status(404).send('Id not Found!');
        }else{
            res.send({todo});
        }
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id))
        res.status(404).send('Invalid Id');

    if(body.completed && _.isBoolean(body.completed)) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if(!todo)
            res.status(404).send('There is no todo by this ID');
        else
            res.send({todo});
    }).catch((e)=> {
        res.status(400).send();
    });

})


// POST /users

app.post('/users', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((user)=>{
        return user.generateAuthToken();
    }).then((token)=> {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredential(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    })
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})


module.exports = {app};