-- get a list of hashes, user_ids, and usernames for future use.

USE cs340_smithb22;
Select credential.user_id, credential.hash, credential.exp_date, user.username
FROM credential

INNER JOIN user on credential.user_id=user.id



-- return all hashes and experation dates for a given usernames
USE cs340_smithb22;

SELECT hash, exp_date
FROM credential
Where user_id in (SELECT id from user
                  where username = "test_user00");

