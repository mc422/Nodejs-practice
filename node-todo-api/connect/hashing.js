const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


password = 'abc123';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);

    bcrypt.compare(password, hash, (err, res) => {
      console.log(`res: ${res}`);
    });
  });
});




// var test = 'what a fucking life I have, fucking me, fucking you god';
// console.log(SHA256(test).toString());

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, 'abc123');

// var decode = jwt.verify(token, 'abc123');
// console.log('decode ', decode);