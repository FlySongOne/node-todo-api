// mongoose model 

var mongoose = require('mongoose');
// mongoose configured
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI,{
  useMongoClient: true
});

module.exports = {
  mongoose: mongoose   // it can be just mongoose in es 6 
}

