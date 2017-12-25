//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if( err ){
  	return console.log('Unable to connect yo MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a4168c8fe5e88c75c497cbf')
  // }, {
  //   $set: { // update operator $set
  //     completed: true
  //   }
  // }, {
  //     returnOriginal: false
  // }).then((result) =>{
  //     console.log(result);
  // });
  
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a408f789c42d30561935446')
  }, {
    $set: { // update operator $set
      name: "Owen"},
    $inc:  { 
      age: 1
    }
  }, {
      returnOriginal: false
  }).then((result) =>{
      console.log(result);
  });

  //db.close(); // closes connection with mongoDB server 
});  