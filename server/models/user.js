
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  //user.tokens.push({access, token});
  return user.save().then( () => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens:{ token }
    }
  });
}; 

UserSchema.statics.findByToken = function (token) {
  var User = this; // model methods get called with the model as this binding
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'

  }); 
}; 

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // use bcypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if( res ){
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
};
 // this will run some code before a given event: we want to run save event
 // before we save, we want to make some changes to it. 
UserSchema.pre('save', function (next){
  var user = this;

  if(user.isModified('password')){

    bcrypt.genSalt(10, (err, salt)=> {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });  
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema );

module.exports = {User}
