//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if( err ){
  	return console.log('Unable to connect yo MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // insertOne let you insert a new document into your collection
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result ) => {
  // 	 if(err) {
  // 	 	return console.log('Unable to insert todo', err );
  // 	 }

  // 	 console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Powers',
  //   age: 25,
  //   location: 'NYC'
  // }, (err, result) => {
  //   if(err) {
  //   	return console.log('Unable to insert user', err );
  //   }
  //   // result.ops is an array of all the documents that got inserted
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });
  db.close(); // closes connection with mongoDB server 
});


