require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3000;
// app.use takes the middleware  
app.use(bodyParser.json());

app.post('/todos',authenticate, (req, res) => {
   
  var todo = new Todo({
  	text:req.body.text,
    _creator: req.user._id
  });
 
  todo.save().then((doc)=>{
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', authenticate, (req,res)=>{
  Todo.find({
    _creator: req.user._id
  }).then((todos)=>{
    res.send({todos}); //es6 syntax
  }, (e)=>{
    res.status(400).send(e);
  });
});

//GET /todos/id
app.get('/todos/:id', authenticate, (req,res)=>{
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
  Todo.findOne({
    _id:id,
    _creator: req.user._id
  }).then((todo)=>{
 	if(!todo){
 		return res.status(404).send();
 	} 
 		
 	res.send({ todo }); // sending it in object form that has properties 
 	
  }).catch((e) => res.status(400).send());    

});

app.delete('/todos/:id', authenticate, (req, res) =>{
	// get the id
   var id = req.params.id;
	// validate the id ->not valid? return 404
   if(!ObjectID.isValid(id)) {
 	 console.log('ID not valid');
 	 return res.status(404).send();
   }
	
	// remove todo by id
	Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
      if(!todo) {  // if no doc, send 404 
      	return res.status(404).send();
      }  
       // if doc, send doc back with 200
      res.send({todo});
	}).catch((e)=>{
		// error
	    // send 400 with empty body
      res.status(400).send(); 
	});
	 
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({_id:id, _creator: req.user._id}, { $set: body }, {new: true}).then((todo) => {
      if(!todo) {
      	return res.status(404).send();
      }

      res.send({todo});
    }).catch((e)=> {
    	res.status(400).send();
    })
});

//POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  // model method - custom model method 
  //User.findByToken
  // instantce method
  //user.generateAuthToken  // responsible for adding a token on to the individual 

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token ).send(user);
  }).catch((e)=> {
    res.status(400).send(e);
  });
});

// var authenticate = (req, res, next) => {
//   var token = req.header('x-auth');

//   User.findByToken(token).then((user) => {
//     if(!user) {
//       //res.status(401).send();
//       return Promise.reject();
//     }

//     req.user = user;
//     req.token = token;
//     next();
//   }).catch((e)=> {
//     res.status(401).send();
//   });
// };


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token ).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen( port, ()=>{
	console.log(`Started up at port ${port}`); 
});

module.exports = {app};



