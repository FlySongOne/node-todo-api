var expect = require('expect');
var request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done)=>{ // testing lifecycle method:let us run below before run some test cases 
  Todo.remove({}).then(()=>{ // remove all todos
  	done();
  }); 
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

       Todo.find().then((todos) => {
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
       	 expect(todos.length).toBe(0);
       	
       	 done();
       }).catch((e) => done(e)); //get any err that is occured inside callback 
      
  	 });
  })


})