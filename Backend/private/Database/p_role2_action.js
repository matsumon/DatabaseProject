//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');
const _ = require('lodash');


async function create_association(package) {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_role2action.js - Creating Association between action and role")
        if (package.task_data.hasOwnProperty("actionID") &&
            package.task_data.hasOwnProperty("roleID")) {

            const create_association_query = `INSERT INTO ${config.db_rootDatabase}.role_to_action (action_id, role_id)
                VALUES (${package.task_data.actionID},${package.task_data.roleID});`

            db.promise_pool.query(create_association_query).then((rows) => {

                support.log("debug", `p_role2action.js - Association between action and role Created`);

                const r_msg = {
                    "status": 1,
                    "Message": `action2role association Successfully Created`,
                    "id": `${package.task_data.roleID}`
                };

                // resolve returning the data package containing the details
                resolve(r_msg);

            }).catch(error => {
                // our query failed, log the incident
                support.log("error", "p_action2_role.js - create_association : Unable to create action2role association db.promise_pool failed to service the query")
                support.log("error", `Error Message: - ${error}`)
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })

        } else {
            support.log("error", "p_action2_role.js - create_association : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    })
}


async function replace_associations(package) {
    return new Promise((resolve, reject) => {
        support.log("debug", `p_role2action.js - replace_associations : Replacing Associations for actionID : ${package.ActionID}`);

        function build_final_query(query_package) {

            var conjoined_query = `DELETE FROM ${config.db_rootDatabase}.role_to_action WHERE action_id = ${query_package.ActionID};`;

            _.forEach(package.New_Roles, function (value) {
                conjoined_query = conjoined_query + `INSERT INTO ${config.db_rootDatabase}.role_to_action (role_id, action_id) VALUES(${value},${query_package.ActionID});`
            })

            return conjoined_query;

        }

        const final_query = build_final_query(package);

        console.log("debug", `p_role2action.js - replacE_associations Final QUERY: ${final_query}`)

        db.promise_pool.query(final_query).then((rows) => {
            support.log("debug", `p_role2action.js - replace_associations complected successfully `);

            const r_msg = {
                "status": 1,
                "Message": `replace_associations was done successfully`,
            };

            // resolve returning the data package containing the details
            resolve(r_msg);


        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_action2_role.js - create_association : Unable to create action2role association db.promise_pool failed to service the query")
            support.log("error", `Error Message: - ${error}`)
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })
    })

}




module.exports.create_association = create_association;
module.exports.replace_associations = replace_associations;