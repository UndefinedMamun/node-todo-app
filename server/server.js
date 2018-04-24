require('./config/config');

const _ = require('lodash');
const express  =  require('express');
const bodyParser  =  require('body-parser');
const {ObjectId} = require("mongodb");


var {mongooes} = require('./db/mongoose');
var {User} = require('./model/User');
var {Todo} = require('./model/Todo');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res)=>{
    // res.send(req.params);
    let id = req.params.id;
    if(!ObjectId.isValid(id))
        res.status(404).send('invalid Id');

    Todo.findById(id).then((todo)=>{
        if(!todo)
            res.status(404).send("todo not found by this id");
        else
            res.send({todo});
    }, (err)=>{
        res.status(400).send(); //don't send err object. cause it may content info about database.
    })
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id))
        res.status(404).send('Invalid Id');
    
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            res.status(404).send('Id not Found!');
        }else{
            res.send({todo});
        }
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo)
            res.status(404).send('There is no todo by this ID');
        else
            res.send({todo});
    }).catch((e)=> {
        res.status(400).send();
    });

})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

// var newUser = new User({
//     email: "bkmmamun@gmail.com    "
// })

// newUser.save().then((doc)=>{
//     console.log(doc);
// }, (err)=>{
//     console.log("Unable to add new user", err);
// })

module.exports = {app};