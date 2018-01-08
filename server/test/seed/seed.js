const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'sonny@exampl.com',
  password: 'user1Pass',
  tokens: [{
  	access: 'auth',
  	token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoId,
  email: 'sam@example.com',
  password: 'user2Pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
  _creator: userOneId
}, {
	_id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId

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
