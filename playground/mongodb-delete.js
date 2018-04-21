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

    // todosCollection.deleteMany({
    //     text: "test"
    // }).then((result) => {
    //     console.log(result);
    // });

    // todosCollection.deleteOne({
    //     text: "test"
    // }).then((result) => {
    //     console.log(result);
    // })

    todosCollection.findOneAndDelete({
        completed: true
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    })




    client.close();
})