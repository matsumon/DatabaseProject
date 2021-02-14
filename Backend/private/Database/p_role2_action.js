//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');


async function create_association(package){
    return new Promise((resolve, reject) => {
        support.log("debug", "p_role2action.js - Creating Association between action and role")
        if (package.task_data.hasOwnProperty("actionID")&&
            package.task_data.hasOwnProperty("roleID")){

                const create_association_query = `INSERT INTO ${config.db_rootDatabase}.role_to_action (action_id, role_id)
                VALUES (${package.task_data.actionID},${package.task_data.roleID});`

                db.promise_pool.query(create_association_query).then((rows) =>{

                    support.log("debug", `p_role2action.js - Association between action and role Created`);

                    const r_msg = {
                        "status": 1,
                        "Message": `action2role association Successfully Created`,
                        "id" : `${package.task_data.actionID}`
                    };
    
                    // resolve returning the data package containing the details
                    resolve(r_msg);

                }).catch(error =>{
                    // our query failed, log the incident
                    support.log("error", "p_action2_role.js - create_association : Unable to create action2role association db.promise_pool failed to service the query")
                    support.log("error", `Error Message: - ${error}`)
                    // reject our promise, promoting the application pools failure as needed.
                    reject(error);
                })

        }else{
            support.log("error", "p_action2_role.js - create_association : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    })
}

module.exports.create_association = create_association;