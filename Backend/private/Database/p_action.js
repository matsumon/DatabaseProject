//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');
const _ = require('lodash');



async function add_Action(package) {
    // this will create a new action
    return new Promise((resolve, reject) => {
        if (package.task_data.hasOwnProperty("action_name")) {
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

        } else {
            support.log("error", "p_action.js - add_Action : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    });
}

async function del_Action(package) {
    // this will delete action
    return new Promise((resolve, reject) => {
        if (package.task_data.hasOwnProperty("id")) {
            support.log("debug", `p_action.js - del_Action : Deleting action id ${package.task_data.id}"`);
            // first build a query that will create a new action object and return the PK field 'id' from its creation

            const action_creation_query = `DELETE FROM ${config.db_rootDatabase}.role_to_action
            where(role_to_action.action_id = ${package.task_data.id});
            DELETE FROM ${config.db_rootDatabase}.action
            WHERE(action.id = ${package.task_data.id});`


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
                support.log("error", `p_action.js - del_Action : FULL ERROR \n ${error}`)
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })

        } else {
            support.log("error", "p_action.js - del_Action : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    });

}

async function update_Action(package) {
    // this will create a new action
    return new Promise((resolve, reject) => {
        support.log("debug", `p_action.js - update_Action : package content - ${JSON.stringify(package)}`)
        if (package.task_data.hasOwnProperty("id") &&
            package.task_data.hasOwnProperty("task_name")) {

            support.log("debug", `p_action.js - update_Action : updating action id - ${package.task_data.task_name}`);
            // first build a query that will create a new action object and return the PK field 'id' from its creation

            const action_update_query = `UPDATE ${config.db_rootDatabase}.action SET action_name = "${package.task_data.task_name}" WHERE id = "${package.task_data.id}";`;


            db.promise_pool.query(action_update_query).then((rows) => {
                support.log("debug", `p_action.js - update_action : action Updated`);

                const r_msg = {
                    "status": 1,
                    "Message": `Action Successfully updated`,
                };

                // resolve returning the data package containing the details
                resolve(r_msg);


            }).catch((error) => {
                // our query failed, log the incident
                support.log("error", "p_action.js - update_Action : Unable to create new action db.promise_pool failed to service the query")
                support.log("error", `Error Message: - ${error}`)
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })

        } else {
            support.log("error", "p_action.js - update_Action : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    });
}

async function get_Action_ids() {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_action.js - get_action_ids Getting all action IDS");

        const get_userids_query = `SELECT id FROM ${config.db_rootDatabase}.action;`

        db.promise_pool.query(get_userids_query).then((rows) => {
            support.log("debug", `p_action.js- get_action_ids : Retrieved ALL action ID's`);
            const r_msg = {
                "status": 1,
                "Message": `Action ids Successfully Retrieved`,
                "Results": rows[0]
            };
            // resolve returning the data package containing the details
            resolve(r_msg);
        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_action.js- get_action_ids : Unable to get action ids db.promise_pool failed to service the query")
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })
    });
}

async function get_Actions() {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_action.js - get_action Getting all actions");

        const get_actions_query = `SELECT action.id, action.action_name as action, role.id AS mmRoleID
        FROM ${config.db_rootDatabase}.action JOIN role_to_action ON action.id = role_to_action.action_id
            JOIN role ON role.id = role_to_action.role_id;`

        db.promise_pool.query(get_actions_query).then((rows) => {

            support.log("debug", `FUll QUERY RESULTS : ${JSON.stringify(rows)}`)

            support.log("debug", `p_action.js- get_actions : Retrieved ALL actions`);

            let data = rows[0]
            
            let unique = _.uniqWith(data, (arrVal, othVal) => {
                return arrVal.id === othVal.id
            })
            let resultArray = _.map(unique, (element) => {
                return ({
                    id: element.id,
                    action: element.action,
                    mmRoleID: []
                })
            });
            _.forEach(data, (object) => {
                let resultArrayIndex = _.findIndex(resultArray, (element) => {
                    return element.id === object.id
                })
                if (resultArrayIndex === -1) {
                    throw console.error("uniqueWith did not work correctly");
                }
                resultArray[resultArrayIndex].mmRoleID.push(object.mmRoleID)
            })
            support.log("debug", `Resulting merged objects array - ${JSON.stringify(resultArray)}`)

            const r_msg = {
                "status": 1,
                "Message": `Actions Successfully Retrieved`,
                "Results": resultArray
            };
            // resolve returning the data package containing the details
            resolve(r_msg);
        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_action.js- get_actions : Unable to get action ids db.promise_pool failed to service the query")
            support.log("error", `${error}`)
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })
    });

}


async function filter_return_actions(package) {
    return new Promise((resolve, reject) => {
        if (package.task_data.hasOwnProperty("action_name") &&
            package.task_data.hasOwnProperty("actionIDs")) {
            var where_string = "1=1"
            var and_string = "1=1"

            if (package.task_data.actionIDs != "") {
                if (package.task_data.actionIDs.includes(", ")) {
                    where_string = `action.id IN ("${package.task_data.actionIDs}")`
                    where_string = where_string.replace(/, /g, `","`);
                } else if (package.task_data.actionIDs.includes(",")) {
                    where_string = `action.id IN ("${package.task_data.actionIDs}")`
                    where_string = where_string.replace(/,/g, `","`);
                } else {
                    where_string = `action.id IN (${package.task_data.actionIDs})`
                }


            }
            if (package.task_data.action_name != "") {
                and_string = `action.action_name = "${package.task_data.action_name }"`
            }

            const filter_query = `SELECT id, action_name
                FROM ${config.db_rootDatabase}.action
                WHERE ${where_string}
                AND ${and_string}`

            db.promise_pool.query(filter_query).then((rows) => {
                support.log("debug", `p_action.js - filter_return_actions : filter_return_actions completed results = ${JSON.stringify(rows[0])}`);

                const r_msg = {
                    "status": 1,
                    "Message": `filter_return_actions completed`,
                    "results": rows[0]
                };

                // resolve returning the data package containing the details
                resolve(r_msg);

            }).catch((error) => {
                // our query failed, log the incident
                support.log("error", "p_action.js - filter_return_actions: Unable to create filter_data db.promise_pool failed to service the query")
                support.log("error", `Error Message: - ${error}`)
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })



        } else {
            support.log("error", "p_action.js - filter_return_actions : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    });

}




module.exports.add_Action = add_Action;
module.exports.del_Action = del_Action;
module.exports.update_Action = update_Action;
module.exports.get_Action_ids = get_Action_ids;
module.exports.get_Actions = get_Actions;
module.exports.filter_return_actions = filter_return_actions;