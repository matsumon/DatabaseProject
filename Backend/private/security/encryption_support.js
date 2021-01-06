// provides encryption related operations for use in other code
const config = require('../../init_config.json'); // include configuration file for future references
const support = require('../support.js'); // enable support functions
const bcrypt = require('bcrypt');   // imports bcrypt library for use


module.exports = {
    // this will hash a password in a method using our DB salt
    hash_password: function(password, db_salt){                     
        // create a bcrypt salt (not the same as the db_salt) using our configured value for transformation rounds
        support.log("debug", "encryption_support.js - Hashing Password function started");
        support.log("debug", "encryption_support.js - Generating bcrypt SALT");


        bcrypt.genSalt(config.bcrypt_rounds,function(err, salt){    
            // Combine the user supplied password w/ our database salt
            support.log("debug", "encryption_support.js - Preparing supplied password with db_salt");

            const db_salted_pass = password + db_salt;
            
            
            // hash the result
            support.log("debug", "encryption_support.js - Hashing Password");


            bcrypt.hash(db_salted_pass, salt, function(err, hash){

                support.log("debug", "encryption_support.js - Password Successfully hashed");

                // return our generated hash
                return hash;
            });
        });
        
    },
    // this will validate a password in a method using our DB salt
    validate_password: function(password, test_hash, db_salt){

        support.log("debug", "encryption_support.js - Validate Password function started");

        support.log("debug", "encryption_support.js - Preparing supplied password with db_salt");
        // Combine the user supplied password w/ our database salt
        const db_salted_pass = password + db_salt;

        // Compare this provided value with a provided password hash
        support.log("debug", "encryption_support.js - Comparing supplied password with request hash");

        bcrypt.compare(db_salted_pass, test_hash, function(err, result){

            support.log("debug", "encryption_support.js - Password comparison successfully executed");
            
            // return true or false based on the result
            return result;
        });

    }
}