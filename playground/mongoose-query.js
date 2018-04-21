const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/Todo');
const {User} = require("./../server/model/User");


// var id = "5ac11639d2b191114426b5d4";

// if(!ObjectId.isValid(id)){
//     console.log("ID Not valid..!")
// }


// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log("Todos :", todos);
// })

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     if(!todo)
//         return console.log("Id not found");
//     console.log("Todo: ", todo);
// })

// Todo.findById(id).then((todo)=>{
//     if(!todo)
//         return console.log("Id not found");
//     console.log("TodoById: ",todo)
// }).catch((e)=>{
//     console.log(e);
// })




//Challange User


User.findById('5ac11c2eed0d718112928247').then((user)=>{
    if(!user)
        return console.log("Unable to find user");
    console.log("User: ", user);
}, (err)=>{
    console.log(err);
})