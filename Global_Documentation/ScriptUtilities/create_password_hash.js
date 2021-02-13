const config = require('../init_config.json');
const bcrypt = require('bcrypt');

const PASSWORD = "STRONG-PASSWORD"

bcrypt.hash(PASSWORD , config.bcrypt_rounds).then(hash => {
    console.log(`The Password Hash of ${PASSWORD } is : ${hash}`)
}).catch((error)=>{
    console.log("hashing FAILED!")
})