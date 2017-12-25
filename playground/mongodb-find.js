const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if( err ){
  	return console.log('Unable to connect yo MongoDB server');
  }
  console.log('Connected to MongoDB server');
  // // array of documents - array of objects that have ID properties, text properties and completed property
  // // fetching the documents, convert them into an array then print them to the screen 
  // db.collection('Todos').find({
  // 	_id: new ObjectID('5a4069cb2a1eca04de6d8367') 

  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) =>{
  // 	console.log('Unable to fetch todos', err);
  // });

  // count todo documents
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
       
  // }, (err) =>{
  // 	console.log('Unable to fetch todos', err);
  // });
  
  db.collection('Users').find({name:'Andrew'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2)); // 2 for formatting
       
  }, (err) =>{
  	console.log('Unable to fetch users', err);
  });

  //db.close(); // closes connection with mongoDB server 
});