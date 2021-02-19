-- This contains the basic SQL queries

-- Return all rows from the users table
SELECT * FROM `user`;

-- Insert a new user into the user table
INSERT INTO user (username, email, created_at)
VALUES(:username_user_input, :email_user_input, :created_at_user_input);
-- username_user_input, are user defined variables Ex) 'Sally'
-- email_user_input, are user defined variables Ex) 'ranndomemail@email.com'
-- created_at_user_input are user defined variables Ex) '20-12-06 00:00:00'

-- Return all rows from the credentials table
SELECT * FROM `credential`;

-- Insert a new credential into the credential table
INSERT INTO credential (hash,exp_date,created_date,enabled,user_id)
VALUES(:hash_user_input,:exp_date_user_input,:created_date_user_input,:enabled_user_input,:user_id_user_input);
-- hash_user_input are user defined variables Ex)"123123fdsasdf21"
-- exp_date_user_input are user defined variables Ex) '20-12-06 00:00:00'
-- created_date_user_input are user defined variables Ex)'20-12-06 00:00:00'
-- enabled_user_input are user defined variables Ex) 1
-- user_id_user_input are user defined variables Ex) 1

-- Return all rows from the user_to_role table
SELECT * FROM `user_to_role`;

-- Return all rows from the role_to_action table
SELECT * FROM `role_to_action`;

-- Return all rows from the sessions table
SELECT * FROM `session`;

-- Create session in session table
INSERT INTO session (created_at, exp_date, token, user_id, user_req_date)
VALUES(:created_at_User_Input, :exp_date_User_Input, :token_User_Input, :user_id_User_Input, :user_req_date_User_Input);
--  created_at_User_Input is the user defined input. Ex) '20-12-06 00:00:00'
--  exp_date_User_Input is the user defined input. Ex) '20-12-06 00:00:00'
--  token_User_Input is the user defined input. Ex) "asdf;lsadkj"
--  user_id_User_Input is the user defined input. Ex) 1
--  user_req_date_User_Input is the user defined input. Ex) '20-12-06 00:00:00'

-- Display all of the action columns and the role.id column
SELECT action.id, action.action_name, role.id AS roleID 
FROM action JOIN role_to_action ON action.id = role_to_action.action_id
    JOIN role ON role.id = role_to_action.role_id;

-- Insert new role into role table
INSERT INTO role (role_title)
VALUES(:roleTitleInput);
-- roleTitleInput will be a varchar Ex) 'Pilot'

-- Return all the columns from the roles table and the associated relationship with the
-- user table via the user id
SELECT role.id, role.role_title, user.id as userID
FROM role JOIN user_to_role ON role.id = user_to_role.role_id
    JOIN user ON user.id = user_to_role.user_id;

-- Creating User to role relationship
INSERT INTO `user_to_role`(`user_id`,`role_id`)
VALUES (:userIDInput,:roleIDInput)
-- userIDInput will be a integer Ex) 1
-- roleIDInput will be a integer Ex) 2

-- Creating Action
INSERT into action (action_name) 
VALUES(:userActionInput);
-- userActionInput will be a string Ex) 'SAVE'
-- Insert new relationship inbetween role and action

-- Creating role to action relationship
INSERT INTO role_to_action (role_id, action_id)
VALUES(:userRoleIDInput,:userActionIDInput);
-- userRoleIDInput will be a integer Ex) 1
-- userActionIDInput will be a integer Ex) 2

-- Deletes a row from the action table based on ID. Deletes the intersection table entries
-- first and then the entry in the action table.
DELETE FROM role_to_action
where(role_to_action.action_id = :actionID_user_input);
DELETE FROM action
WHERE(action.id = :actionID_user_input);
-- actionID_user_input is user defined input Ex) 1

-- Update a action row with different values
UPDATE action
SET action_name = :actionName_user_input
WHERE action.id = :actionID_user_input;
-- :actionName_user_input are user defined variables Ex) "EDIT"
-- :actionID_user_input are user defined variables Ex) 1

-- Filters all actions by action ids and action names and returns all action columns
SELECT * 
FROM action
WHERE action.id IN :actionIDArray_user_input 
    AND action.action_name = :actionName_user_input;
-- :actionIDArray_user_input are user defined variables Ex) (1,2,3)
-- :actionName_user_input are user defined variables Ex) "SAVE"