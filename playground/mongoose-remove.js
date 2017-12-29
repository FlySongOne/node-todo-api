const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user'); 
 
// Todo.remove({}).then((result) => {
// 	console.log(result);
// });
// find first matched one and remove it
//Todo.findOneRemove()

// Todo.findOneRemove({_id: '5a46a546d4ec6e378aaf7c2c'}).then((todo)=>{

// });

//Todo.findByIdAndRemove

Todo.findByIdAndRemove('5a46a546d4ec6e378aaf7c2c').then((todo)=>{
  console.log(todo);	
}); 