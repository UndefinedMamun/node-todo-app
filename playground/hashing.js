const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
// var message = 'I am a message';

// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);

var data = {
    id: 5
}

var token = jwt.sign(data, "secret");

console.log(token)

var decoded = jwt.verify(token, "secret");

console.log('decoded', decoded);