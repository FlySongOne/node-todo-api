const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user'); 

// var id ='5a4418793c63fa07c3afc442';

// if(!ObjectID.isValid(id)) {
// 	console.log('ID not valid');
// }

// Todo.find({
// 	_id: id
// }).then((todos)=>{
// 	console.log('Todos', todos);
// });

// // find the first matched one
// Todo.findOne({
// 	_id: id
// }).then((todo)=>{
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo)=>{
// 	if(!todo){
// 		return console.log('ID not found');
// 	}
// 	console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));
var id = '5a42eeaa71e79a04e28d4b95';
User.findById(id).then((user)=>{
	if(!user){
		return console.log('ID not found');
	}
	console.log(JSON.stringify(user, undefined, 2));
}, (e) =>{
	console.log(e);
});
