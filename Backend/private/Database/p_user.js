//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('./database_access.js');



//define required functions
async function create_user();
async function update_user();
async function remove_user();



// export required functions
module.exports.create_user = create_user;
module.exports.update_user = update_user;
module.exports.remove_user = remove_user;
