const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var pssword = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(pssword, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

var hashed = '$2a$10$IsU2EZKOqMHwcTzbQfQcdOSkxzofGGMK2aSibZQbI2m9rdGG2ydju';

bcrypt.compare(pssword, hashed, (err, res) => {
    console.log(res);
})
// var message = 'I am a message';

// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);

// var data = {
//     id: 5
// }

// var token = jwt.sign(data, "secret");

// console.log(token)

// var decoded = jwt.verify(token, "secret");

// console.log('decoded', decoded);