const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const users = [{
  _id: user1Id,
  email: 'sonny@exampl.com',
  password: 'user1Pass',
  tokens: [{
  	access: 'auth',
  	token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: user2Id,
  email: 'sam@example.com',
  password: 'user2Pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
  }]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
  _creator: user1Id
}, {
	_id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: user2Id

}];

const populateTodos = (done) => { // testing lifecycle method:let us run below before run some test cases 
  Todo.remove({}).then(() => { // remove all todos
  	return Todo.insertMany(todos);
  }).then(() => done()); 
};  

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(()=> done());	
};

module.exports = {todos, populateTodos, users, populateUsers};
