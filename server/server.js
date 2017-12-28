var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
// app.use takes the middleware  
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);  
  var todo = new Todo({
  	text:req.body.text
  });
 
  todo.save().then((doc)=>{
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', (req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos}); //es6 syntax
  }, (e)=>{
    res.status(400).send(e);
  });
});

//GET /todos/id
app.get('/todos/:id', (req,res)=>{
  var id = req.params.id;	
  
  // validate ID using isValid
    // 404 - send back empty body
 if(!ObjectID.isValid(id)) {
 	console.log('ID not valid');
 	return res.status(404).send();
 }

  
  // findById 
    // success
      // if todo - send it back
      // if no todo - send back 404 with empty body
    // error
      //400 - send back empty body
  Todo.findById(id).then((todo)=>{
 	if(!todo){
 		return res.status(404).send();
 	} 
 		
 	res.send({ todo }); // sending it in object form that has properties 
 	
  }).catch((e) => res.status(400).send());    

});

app.listen( 3000, ()=>{
	console.log('Started on port 3000'); 
});

module.exports = {app};



