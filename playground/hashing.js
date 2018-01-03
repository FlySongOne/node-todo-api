const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
//genSalt takes two arguments, asynchronous function, second argument is a callback function
// bcrypt.genSalt(10, (err, salt)=> {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$zhZKAyT8AW6mmqdB8mBCuOf6MCr/7sByuPvvdIjKlpUnpeMVdjkFO';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
// var data = {
// 	id:10
// };

// // two methods
// var token = jwt.sign(data, '123abc'); // takes the object in this case the data with the user id and signs it
//           // it creates that hash and then it returns the token value;
//           // call to sign, it is going to return our token. it is the value we send back to the user when they sign up or log in.

// console.log(token);          
// var decoded = jwt.verify(token,'123abc') // takes that token and the secret and it makes sure that data was not manipulated.
//  // gets decoded result
// console.log('decoded', decoded); 
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//   id: 4
// };
// //create a token 
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()	
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// // manipulating token data id
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //verify token
// if(resultHash === token.hash) {
// 	console.log('Data was not changed');
// }else{
// 	console.log('Data was changed. Do not trust!');
// }