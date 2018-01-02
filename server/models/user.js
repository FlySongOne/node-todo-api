
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
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens = user.tokens.concat({ access, token });   

  return user.save().then( () => {
  	return token;
  });
};

// User model
// email property - require it, trim it , set type, set min length of 1 

var User = mongoose.model('User', UserSchema );

module.exports = {User}