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

    // todosCollection.find({
    //     _id: new ObjectID('5abe3f83ed0d71811292424d')
    // }).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 4));
    // }, (err)=>{
    //     console.log("Unable to fetch todos", err);
    // })

    todosCollection.find().count().then((count) => {
        console.log("Todos count:", count);
    }, (err)=>{
        console.log("Unable to fetch todos", err);
    })




    client.close();
})