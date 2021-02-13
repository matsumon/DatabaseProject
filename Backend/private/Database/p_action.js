//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');


async function add_Action(package) {
    // this will create a new action
    return new Promise((resolve, reject) => {
        if(package.task_data.hasOwnProperty("action_name")){
            support.log("debug", "p_action.js - add_Action : Creating new action");
            // first build a query that will create a new action object and return the PK field 'id' from its creation

            const action_creation_query = `INSERT into ${config.db_rootDatabase}.action (action_name) VALUES('${package.task_data.action_name}');`
            
            
            db.promise_pool.query(action_creation_query).then((rows) => {
                support.log("debug", `p_action.js - create_action : action Created - ID of new Object = ${rows[0].insertId}`);

                const r_msg = {
                    "status": 1,
                    "Message": `Action Successfully Created`,
                    "insertId": rows[0].insertId
                };

                // resolve returning the data package containing the details
                resolve(r_msg);


            }).catch((error) => {
                // our query failed, log the incident
                support.log("error", "p_action.js - add_Action : Unable to create new action db.promise_pool failed to service the query")
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })

        }else{
            support.log("error", "p_action.js - add_Action : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }
        
    });
}

async function del_Action(package){
    // this will delete action
    return new Promise((resolve, reject) => {
        if(package.task_data.hasOwnProperty("id")){
            support.log("debug", `p_action.js - del_Action : Deleting action id ${package.task_data.id}"`);
            // first build a query that will create a new action object and return the PK field 'id' from its creation

            const action_creation_query = `DELETE FROM ${config.db_rootDatabase}.action WHERE id = ${package.task_data.id};`
            
            
            db.promise_pool.query(action_creation_query).then((rows) => {
                support.log("debug", `p_action.js - del_action : action delete action id ${package.task_data.id}`);

                const r_msg = {
                    "status": 1,
                    "Message": `Action id ${package.task_data.id} Successfully Deleted`,
                };

                // resolve returning the data package containing the details
                resolve(r_msg);


            }).catch((error) => {
                // our query failed, log the incident
                support.log("error", "p_action.js - del_Action : Unable to delete action db.promise_pool failed to service the query")
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })

        }else{
            support.log("error", "p_action.js - del_Action : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }
        
    });
    
}



module.exports.add_Action = add_Action;
module.exports.del_Action = del_Action;