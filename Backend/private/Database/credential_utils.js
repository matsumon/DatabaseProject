const config = require('../../init_config.json'); // include configuration file for future references
const support = require('../support.js'); // enable support functions
const bcrypt = require('bcrypt');   // imports bcrypt library for use
const sql = require('./database_access.js') // import SQL pool for use

module.exports = {
    // creates a new random db_salt for use in other functions
    generate_db_salt: function(){
        support.log("debug", "credential_utils.js - Generating new db_salt");
        return Math.random().toString(36).substring(5);
    },

    // updates db_salt to a new random one
    // note - updating a db_salt will break the credential password validation, password must be updated after changing a salt
    update_db_salt: function(credential_id){

        // generate a new db_salt for use in our query
        const new_db_salt = this.generate_db_salt();

        // build our query for sending the request to update the db_salt
        const query = "UPDATE `cs340_smithb22`.`credential`\n" +
            "SET\n"+
            "`salt` = '" + new_db_salt + "'\n" +
            "WHERE `id` = " + credential_id +";"
        
        // log our debug message containing the resultant query for help
        const msg = "credential_utils.js - Prepared SQL Query : " + query
        support.log("debug", msg);

        // send the query asynchronously
        sql.pool.query(query, function(err){

            // log the result of our query
            const msg = "credential_utils.js - db_salt for credential : " + credential_id + " was updated to - " + new_db_salt
            support.log("info", msg);
        });
    }
}