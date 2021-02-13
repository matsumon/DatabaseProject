//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('./database_access.js');


async function new_role(package){
    return new Promise((resolve, reject)=> {
        if(package.task_data.hasOwnProper("role_title")){
                // code to add role
                const role_creation_query = `
                INSERT INTO role (role_title)
                VALUES(${package.task_data.role_title};
                `
                db.promise_pool.query(role_creation_query).then(rows =>{
                    support.log("debug", `p_role.js - new_role :role Created - ID of new Object = ${rows[0].insertId}`);

                    const r_msg = {
                        "status": 1,
                        "Message": `Role successfully created!`,
                        "token" : `${token}`
                    };
    
                    // resolve returning the data package containing the details
                    resolve(r_msg);
                })

            }
        else{
            //handle failure to provide minimum required values in task data body
                support.log("error", `p_role.js - new_role : unable to create new role, Request did not provide them minimum required parameters`);
                const r_msg = {
                    "status": 0,
                    "Message": "Can NOT create new_role, minimum params were not provided in task_data body",
                };
            reject(r_msg)
        }
    })   
}

module.exports.new_role = new_role;
