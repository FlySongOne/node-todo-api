var mongoose = require('mongoose');

// model is a method to create a new model 
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true // get rid of space
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// Todo constructor
// var newTodo = new Todo({
//  text: 'Cook dinner'
// });

// // responsible for saving it to mongo db database, and save return promise
// newTodo.save().then((doc)=>{
//   console.log('Save todo', doc);
// }, (e) => {
//   console.log('Unable to save todo');  
// });

// var otherTodo = new Todo({
//   text:' Edit this video '  
// });

// otherTodo.save().then((doc) => {
//  console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//  console.log('Unable to save',e);
// }); 

module.exports = { Todo };