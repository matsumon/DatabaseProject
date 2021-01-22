//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('../Database/database_access.js');


//define required functions
async function create_session(){
    return new Promise((resolve,reject)=>{
        support.log("error", "p_session.js - create_session : Creating new session");


    });
};

async function update_session(package){
    return new Promise((resolve,reject)=>{
        support.log("error", "p_session.js - update_session : updating session");


    });
};

async function remove_session(session_id){
    return new Promise((resolve,reject)=>{
        support.log("error", "p_session.js - remove_session : removing session");


    });
};



// export required functions
module.exports.create_session = create_session;
module.exports.update_session = update_session;
module.exports.remove_session = remove_session;
