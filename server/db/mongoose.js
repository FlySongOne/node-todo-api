// mongoose model 

var mongoose = require('mongoose');
// mongoose configured
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose: mongoose   // it can be just mongoose in es 6 
}