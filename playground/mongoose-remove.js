const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/Todo');
const {User} = require("./../server/model/User");

//Delete all
// Todo.remove({}).then((result)=>{
//     console.log(result);
// })


//find one with query and remove
// Todo.findOneAndRemove({ text: "somthing" }).then((todo)=>{
//     console.log(todo);
// })


Todo.findByIdAndRemove('5add7ebb0f2851379a04c62f').then((todo)=>{
    console.log(todo);
})