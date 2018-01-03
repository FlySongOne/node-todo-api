const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');
beforeEach(populateUsers);
beforeEach(populateTodos); 


describe('POST /todos', ()=>{
  it('should create a new todo', (done) =>{
    var text = 'Test todo text';

    request(app)
     .post('/todos')
     .send({text})
     .expect(200)
     .expect((res)=>{
     	expect(res.body.text).toBe(text);
     })
     .end((err,res) => {
       if(err) {
       	 return done(err); // wrap up the test and print the err to the screen // stop execution
       }

       Todo.find({text}).then((todos) => {
       	 expect(todos.length).toBe(1);
       	 expect(todos[0].text).toBe(text);
       	 done();
       }).catch((e)=>done(e)); //get any err that is occured inside callback
     });
  });

  it('should not create todo with invalid body data', (done) => {
  	request(app)
  	 .post('/todos')
  	 .send({})
  	 .expect(400)
  	 .end((err, res)=>{
       if(err) {
       	 return done(err);
       }
       

       Todo.find().then((todos) => {
       	 expect(todos.length).toBe(2);
       	
       	 done();
       }).catch((e) => done(e)); //get any err that is occured inside callback 
      
  	 });
  })


})

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
  	request(app)
  	 .get('/todos')
  	 .expect(200)
  	 .expect((res) => {
  	 	expect(res.body.todos.length).toBe(2);
  	 })
  	 .end(done); 
  });	
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
      	expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    //make sure you get a 404 back
    var hexID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });
  // invalid id, you get a 404 back 
  it('shoudl return 404 for non-object ids', (done) => {
  	// /todos/123  
    request(app)
      .get('/todos/abc123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id',() => {
  it('should remove a todo', (done) => {
    var hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) => {
      	expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if( err ) {
        	return done(err);
        }
        // query database using findbyid
        //expect(null).toNotExist();
        Todo.findById(hexID).then((todo) => {
           expect(todo).toNotExist; 
           done();	
        }).catch((e) => done(e) );
      });  
  });

  it('should return 404 if todo not found', (done)=> {
    var hexID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  

  it('should return 4040 if ObjectID is invalid', (done) =>{
    request(app)
      .delete('/todos/abc123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    var hexID = todos[0]._id.toHexString();
    // update text, set completed true
    var text = 'This should be the new text';
    request(app)
     .patch(`/todos/${hexID}`)
     .send({ completed: true ,
             text: text 
     })
     .expect(200)
     .expect((res) => {
     	expect(res.body.todo.text).toBe(text);
     	expect(res.body.todo.completed).toBe(true);
     //	expect(res.body.todo.completedAt).toBeA('number');
     })
     .end(done); 
    // text is changed, completed is true, completedAt is a number. toBeA
  });

  it('should clear completedAt when todo is not completed', (done) => {
  // grab id of second todo item
  var hexId = todos[1]._id.toHexString();
  var text = 'This should be the new text!!';
  // update text, set completed to false
  request(app)
    .patch(`/todos/${hexId}`)
    .send({
    	completed: false,
    	text:text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
     // expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);  
  // text is changed, completed false, completedAt is null, .toNotExist
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should reutn 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => { 
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);     
  });
});
