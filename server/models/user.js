var mongoose = require('mongoose');

// User model
// email property - require it, trim it , set type, set min length of 1 

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true // get rid of space
  }
});

// var user = new User({
//   email: 'andew@mail.com '
// });

// user.save().then((doc)=>{
//   console.log('User saved', doc);

// }, (e) => {
//   console.log('Unable to save user', e);
// });

module.exports = {User}