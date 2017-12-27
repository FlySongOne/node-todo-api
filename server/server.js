var express = require('express');
var bodyParser = require('body-parser');

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
  })
});


app.listen( 3000, ()=>{
	console.log('Started on port 3000'); 
});

module.exports = {app};


