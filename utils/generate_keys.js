const crypto = require('crypto');       //npm has it by default

//for access token and refresh token
const key1 = crypto.randomBytes(32);     //for 256 bits
const key2 = crypto.randomBytes(32);    

console.table({key1, key2});