const express  =  require('express');
const bodyParser  =  require('body-parser');
const {ObjectId} = require("mongodb");


var {mongooes} = require('./db/mongoose');
var {User} = require('./model/User');
var {Todo} = require('./model/Todo');


var app = express();
const port = process.env.PORT || 3000;

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