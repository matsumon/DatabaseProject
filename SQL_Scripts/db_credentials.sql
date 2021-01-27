/*
update db_salt
*/
UPDATE `cs340_smithb22`.`credential`
SET
`salt` = 'AFKAT'
WHERE `id` = 1;


/*
update enabled status
*/

UPDATE `cs340_smithb22`.`credential`
SET
`enabled` = '1'
WHERE `id` = 1;