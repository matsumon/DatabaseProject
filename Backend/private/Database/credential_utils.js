const config = require('../../init_config.json'); // include configuration file for future references
const support = require('../support.js'); // enable support functions
const sql = require('./database_access.js') // import SQL pool for use
const crypto = require('../security/encryption_support.js') // import encryption tools for use

module.exports = {
    // creates a new random db_salt for use in other functions
    generate_db_salt: function(){
        support.log("debug", "credential_utils.js - Generating new db_salt");
        return Math.random().toString(36).substring(5);
    },

    // requests a db_salt for use in other functions
    get_db_salt: function(credential_id){
        var msg = "credential_utils.js - Requesting db_salt for credential : " + credential_id
        support.log("debug", msg);

        // build our query for the request
        const query = "SELECT `salt`\n"+
        "FROM cs340_smithb22.credential\n"+
        "WHERE `id` = " + credential_id + ";"

        // log our debug message containing the resultant query for help
        msg = "credential_utils.js - Prepared db_salt request SQL Query : " + query
        support.log("debug", msg);

        // send the query asynchronously
        sql.pool.query(query, function(err, results){
            if (err){
                support.log("error", "credential_utils.js - Unable to request db_salt");
                support.log("error", err.message);
            }
            
            // log the result of our query
            const string_result = JSON.stringify(results); // create a string version of the result for our log

            msg = "credential_utils.js - db_salt for credential : " + credential_id + " is - " + string_result
            support.log("debug", msg);

            // return the result
            return results;
        });

    },

    // updates db_salt to a new random one
    // note - updating a db_salt will break the credential password validation, password must be updated after changing a salt
    update_db_salt: function(credential_id){
        support.log("debug", "credential_utils.js - Starting db_salt update");

        // generate a new db_salt for use in our query
        const new_db_salt = this.generate_db_salt();

        // build our query for sending the request to update the db_salt
        const query = "UPDATE `cs340_smithb22`.`credential`\n" +
            "SET\n"+
            "`salt` = '" + new_db_salt + "'\n" +
            "WHERE `id` = " + credential_id +";"
        
        // log our debug message containing the resultant query for help
        const msg = "credential_utils.js - Prepared db_salt update SQL Query : " + query
        support.log("debug", msg);

        // send the query asynchronously
        sql.pool.query(query, function(err){

            // log the result of our query
            const msg = "credential_utils.js - db_salt for credential : " + credential_id + " was updated to - " + new_db_salt
            support.log("debug", msg);
        });
    },

    // update credential password hash
    //      often used following a update db_salt due to those side effects
    update_hash: function(password, credential_id){
        support.log("debug", "credential_utils.js - Starting hash update");

        // request the current db_salt for use in password hashing
        const db_salt_query_result = this.get_db_salt(credential_id);
        const db_salt = db_salt_query_result[0].salt

        var msg = "credential_utils.js - FOUND! matching db_salt : " + db_salt
        support.log("debug", msg);
        

        // generate the new password hash
        const new_hash = crypto.hash_password(password, db_salt);
        // build our query
        const query = "UPDATE `cs340_smithb22`.`credential`\n" +
        "SET\n"+
        "`hash` = '" + new_hash + "'\n" +
        "WHERE `id` = " + credential_id +";"

        // log our debug message containing the resultant query for help
        msg = "credential_utils.js - Prepared hash update SQL Query : " + query
        support.log("debug", msg);

        // send the query asynchronously
        sql.pool.query(query, function(err){

            // log the result of our query
            msg = "credential_utils.js - hash for credential : " + credential_id + " was updated to - " + new_hash
            support.log("debug", msg);
        });
    }
}