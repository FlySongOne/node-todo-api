const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done)=>{ // testing lifecycle method:let us run below before run some test cases 
  Todo.remove({}).then(()=>{ // remove all todos
  	return Todo.insertMany(todos);
  }).then(() => done()); 
}); 

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