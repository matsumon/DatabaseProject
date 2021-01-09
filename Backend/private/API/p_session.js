//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('../Database/database_access.js');


//define required functions
async function create_session();
async function update_session();
async function remove_session();



// export required functions
module.exports.create_session = create_session;
module.exports.update_session = update_session;
module.exports.remove_session = remove_session;
