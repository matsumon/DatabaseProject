/*
This script should fill our databases with some base data for use in testing and general minipulation
*/

/*
Create Three Test Users
*/
INSERT INTO `cs340_smithb22`.`user`
(`id`,
`username`,
`created_at`,
`email`)
VALUES
( 1 ,
'test_user00',
current_timestamp(),
'test_user00@mock_data.dev'),
( 2 ,
'test_user01',
current_timestamp(),
'test_user01@mock_data.dev'),
( 3 ,
'test_user02',
current_timestamp(),
'test_user02@mock_data.dev');


/*
Create four test crednetials
*/

INSERT INTO `cs340_smithb22`.`credential`
(`id`,
`hash`,
`exp_date`,
`created_date`,
`enabled`)
VALUES
(1,
'',
CURRENT_TIMESTAMP + INTERVAL 1 YEAR,
CURRENT_TIMESTAMP,
1),
(2,
'',
CURRENT_TIMESTAMP + INTERVAL 1 YEAR,
CURRENT_TIMESTAMP,
0),
(3,
'',
CURRENT_TIMESTAMP + INTERVAL 1 YEAR,
CURRENT_TIMESTAMP,
1),
(4,
'',
CURRENT_TIMESTAMP + INTERVAL 1 YEAR,
CURRENT_TIMESTAMP,
1);


/*
Assign our Three Users to the Four Crednetials using the Join Table
*/

INSERT INTO `cs340_smithb22`.`user_to_cred`
(`user_id`,
`user_cred`)
VALUES
(1,1),
(1,2),
(2,3),
(3,4);

/*
Create Four Types of ROLES
*/

INSERT INTO `cs340_smithb22`.`role`
(`id`,
`logon`,
`update`,
`auth`,
`validate`,
`super`,
`special`,
`role_title`)
VALUES
(1,1,1,1,0,0,0,'USER'),
(2,1,0,0,1,0,0,'AUTHENTICATING_SERVICE'),
(3,1,1,0,0,1,0,'SUPER_USER'),
(4,0,0,0,0,0,0,'DISABLED USER');

/*
Assign Our Three Users to their Approprate ROLES
*/

INSERT INTO `cs340_smithb22`.`user_to_role`
(`user_id`,
`role`)
VALUES
(1,1),
(2,1),
(3,1),
(1,2),
(1,3);


/*
Create some example sessions
*/

INSERT INTO `cs340_smithb22`.`session`
(`id`,
`user_id`,
`token`,
`exp_date`,
`user_req_date`,
`created_at`)
VALUES
(1,
1,
'-NULL TOKEN - k',
CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
CURRENT_TIMESTAMP - INTERVAL 10 MINUTE,
CURRENT_TIMESTAMP),
(2,
2,
'-NULL TOKEN - kgh4',
CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
CURRENT_TIMESTAMP - INTERVAL 10 MINUTE,
CURRENT_TIMESTAMP),
(3,
3,
'-NULL TOKEN - k7hf',
CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
CURRENT_TIMESTAMP - INTERVAL 10 MINUTE,
CURRENT_TIMESTAMP),
(4,
2,
'-NULL TOKEN - Ka1h',
CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
CURRENT_TIMESTAMP - INTERVAL 10 MINUTE,
CURRENT_TIMESTAMP),
(5,
1,
'-NULL TOKEN - K1sl',
CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
CURRENT_TIMESTAMP - INTERVAL 10 MINUTE,
CURRENT_TIMESTAMP);
