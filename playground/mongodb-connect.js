// const MongoClient =  require('mongodb').MongoClient;
const {MongoClient, ObjectID} =  require('mongodb');

// var obj = new ObjectID();

// console.log(obj)

const dbUrlString = "mongodb://localhost:27017";
const db = "ToDoApp"

MongoClient.connect(dbUrlString, (err, client)=>{
    if(err){
        return console.log("unable to connect to mongodb server..");
    }
    console.log("connected to mongodb server..");

    
    // client.db(db).collection('todos').insertOne({
    //     text: "something to do",
    //     completed: false
    // }, (err, result)=> {
    //     if(err){
    //         return console.log("Unabel to insert todo", err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // client.db(db).collection('users').insertOne({
    //     name: "test",
    //     age: 23,
    //     location: "Dhaka"
    // }, (err, result) => {
    //     if(err){
    //         return console.log("Unable to insert user");
    //     }

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // })




    client.close();
})