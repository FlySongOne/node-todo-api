
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// schema property lets you define a new schema
var UserSchema = new mongoose.Schema({
   email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // get rid of space
    unique: true,
    validate: {
    	validator: validator.isEmail,
    	message: '{value} is not a valid email'
    }
  }, 
  password: { 
  	type:String,
    require:true,
    minlength: 6
  },
  tokens: [{    // array
  	access: {
      type: String,
      required: true
  	},
  	token:{
      type: String,
      required: true
  	}
  }]	
}); 

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); //take a mongoose object and convert it to regular object
  
  return _.pick(userObject, ['_id', 'email']);

};

UserSchema.methods.generateAuthToken = function () {
  var user = this; // instance method called with individual document
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens = user.tokens.concat({ access, token });   

  return user.save().then( () => {
  	return token;
  });
};

UserSchema.statics.findByToken = function (token){
  var User = this; // model methods get called with the model as this binding
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject ) => {
    //   reject();
    // });
    return Promise.reject('test');
  }

  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access': 'auth'

  }); 
}; 
 

var User = mongoose.model('User', UserSchema );

module.exports = {User}
