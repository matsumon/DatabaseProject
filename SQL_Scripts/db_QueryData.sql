/*
This contians basic select queries to access each database item as a reference for future development
*/

/*
SELECT FROM USER
*/
SELECT * FROM `user`;

/*
SELECT FROM CREDENTIAL
*/
SELECT * FROM `credential`;

/*
SELECT FROM ROLE
*/
SELECT * FROM `role`;

/*
SELECT USER_TO_CREDENTIAL ASSIGNMENT FROM JOIN TABLE
*/
SELECT * FROM `user_to_cred`;

/*
SELECT USER_TO_ROLE ASSIGNMENT FROM JOIN TABLE
*/
SELECT * FROM `user_to_role`;

/*
SELECT FROM SESSION
*/
SELECT * FROM `session`;

/*
SELECT FROM ACTION TABLE
*/

SELECT action.id, action.action_name, role.id AS roleID 
FROM action JOIN role_to_action ON action.id = role_to_action.action_id
    JOIN role ON role.id = role_to_action.role_id;

/*
insert into role
*/

-- Insert new role into role table
INSERT INTO role (role_title)
VALUES(:roleTitleInput)
-- roleTitleInput will be a varchar Ex) 'Pilot'
-- Insert new relationship between user and role
INSERT INTO `user_to_role`(`user_id`,`role`)
VALUES (:userIDInput,:roleIDInput)
-- userIDInput will be a integer Ex) 1
-- roleIDInput will be a integer Ex) 2

/*
Creation Aciton
*/

INSERT into action (action_name) VALUES(
"ACTION"
)

