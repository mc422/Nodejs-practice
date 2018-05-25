const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var test = 'what a fucking life I have, fucking me, fucking you god';
console.log(SHA256(test).toString());

var data = {
	id: 10
};

var token = jwt.sign(data, 'abc123');

var decode = jwt.verify(token, 'abc123');
console.log('decode ', decode);