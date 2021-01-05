/*
This contians basic select queries to access each database item as a reference for future development
*/

/*
SELECT FROM USER
*/
SELECT * FROM `cs340_smithb22`.`user`;

/*
SELECT FROM CREDENTIAL
*/
SELECT * FROM `cs340_smithb22`.`credential`;

/*
SELECT FROM ROLE
*/
SELECT * FROM `cs340_smithb22`.`role`;

/*
SELECT USER_TO_CREDENTIAL ASSIGNMENT FROM JOIN TABLE
*/
SELECT * FROM `cs340_smithb22`.`user_to_cred`;

/*
SELECT USER_TO_ROLE ASSIGNMENT FROM JOIN TABLE
*/
SELECT * FROM `cs340_smithb22`.`user_to_role`;

/*
SELECT FROM SESSION
*/
SELECT * FROM `cs340_smithb22`.`session`;