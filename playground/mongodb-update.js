// const MongoClient =  require('mongodb').MongoClient;
const {MongoClient, ObjectID} =  require('mongodb');


const dbUrlString = "mongodb://localhost:27017";
const db = "ToDoApp"

MongoClient.connect(dbUrlString, (err, client)=>{
    if(err){
        return console.log("unable to connect to mongodb server..");
    }
    console.log("connected to mongodb server..");

    
    const todosCollection = client.db(db).collection('todos');
    const usersCollection = client.db(db).collection('users');


    usersCollection.findOneAndUpdate({
        _id: new ObjectID("5abe3d5bee5a650becee1571")
    }, {
        $set: {
            name: "Mike"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: true
    }).then((result)=>{
        console.log(JSON.stringify(result,undefined, 4))
    })




    client.close();
})