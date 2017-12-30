require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;
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

app.delete('/todos/:id', (req, res) =>{
	// get the id
   var id = req.params.id;
	// validate the id ->not valid? return 404
   if(!ObjectID.isValid(id)) {
 	 console.log('ID not valid');
 	 return res.status(404).send();
   }
	
	// remove todo by id
	Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo) {  // if no doc, send 404 
      	return res.status(404).send();
      }  
       // if doc, send doc back with 200
      res.status(200).send({todo});
	}).catch((e)=>{
		// error
	    // send 400 with empty body
      res.status(400).send(); 
	});
	 
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed'] );

	if(!ObjectID.isValid(id)) {
 	  console.log('ID not valid');
 	  return res.status(404).send();
    }
    
    if (_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime(); // returns JS time stamp 
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, {new: true}).then((todo) => {
      if(!todo) {
      	return res.status(404).send();
      }

      res.send({todo});
    }).catch((e)=> {
    	res.status(400).send();
    })
});

app.listen( port, ()=>{
	console.log(`Started up at port ${port}`); 
});

module.exports = {app};



