-- Creates an Aciton
`INSERT into ${config.db_rootDatabase}.action (action_name) VALUES('${package.task_data.action_name}');`

-- Removes an Action and its related M2M relationship in the role_to_aciton table if needed
`DELETE FROM ${config.db_rootDatabase}.role_to_action
            where(role_to_action.action_id = ${package.task_data.id});
            DELETE FROM ${config.db_rootDatabase}.action
            WHERE(action.id = ${package.task_data.id});`

-- Updates an Action
`UPDATE ${config.db_rootDatabase}.action SET action_name = "${package.task_data.task_name}" WHERE id = "${package.task_data.id}";`

-- Selects all Action ID's used in the Database
`SELECT id FROM ${config.db_rootDatabase}.action;`

-- Gets All Actions joined with the approprate resouces for useful display in our UI
`SELECT action.id, action.action_name as action, role.id AS mmRoleID
        FROM ${config.db_rootDatabase}.action LEFT JOIN role_to_action ON action.id = role_to_action.action_id
            LEFT JOIN role ON role.id = role_to_action.role_id;`

-- Results all Aciton data filtered by relivant items

var and_string = `action.action_name = "${package.task_data.action_name }"`  -- the and_string is proceduarly genreated part of the query genreated based on UI supplied data with in our app
var where_string = `action.id IN ("${package.task_data.actionIDs}")`         -- the where_string is proceduarly genreated part of the query genreated based on UI supplied data with in our app

`SELECT id, action_name
                FROM ${config.db_rootDatabase}.action
                WHERE ${where_string}
                AND ${and_string}`


-- Set Credential Password
`UPDATE ${config.db_rootDatabase}.credential
                    SET
                    hash = "${hash}"
                    WHERE
                    id = ${package.user_id};`

-- Create Blank Credential 
`INSERT into ${config.db_rootDatabase}.credential
        (hash,
        exp_date,
        created_date,
        enabled)
        VALUES('', CURRENT_TIMESTAMP + INTERVAL 1 YEAR, CURRENT_TIMESTAMP, 1);`

-- Remove Credential
`DELETE from ${config.db_rootDatabase}.credential
        WHERE id = ${credential_id}`

-- Update Credential
`UPDATE ${config.db_rootDatabase}.credential
                SET
                user_id = ${package.new_user_id}
                WHERE
                id = ${package.credential_id};`

-- List all Credentials as used by our applicaion UI
`SELECT id, hash, exp_date AS expired, created_date AS created, enabled, user_id AS userID FROM ${config.db_rootDatabase}.credential`

-- Create insecure Arbitary Crednetial
--      Used by our application to instagate arbitary applications
`INSERT into ${config.db_rootDatabase}.credential
        (hash,
        exp_date,
        created_date,
        enabled,
        user_id)
        VALUES('${package.task_data.hash}', ${package.task_data.exp_date}, ${package.task_data.created_date}, ${package.task_data.enabled}, ${package.task_data.userID});`

-- Create new Role
`INSERT INTO ${config.db_rootDatabase}.role (role_title)
    VALUES("${package.task_data.role_title}");
    `

-- Get all Role Id's
`SELECT id FROM ${config.db_rootDatabase}.role;`

-- Get all Roles joined as needed by the UI of our application
`SELECT role.id as id, role.role_title as roleTitle, user.id as userID
        FROM ${config.db_rootDatabase}.role LEFT JOIN user_to_role ON role.id = user_to_role.role_id
            LEFT JOIN user ON user.id = user_to_role.user_id;`

-- Create Role to Action Accociation
`INSERT INTO ${config.db_rootDatabase}.role_to_action (action_id, role_id)
                VALUES (${package.task_data.actionID},${package.task_data.roleID});`

-- Replace Role to Action Accociations
`DELETE FROM ${config.db_rootDatabase}.role_to_action WHERE action_id = ${query_package.ActionID};`
`INSERT INTO ${config.db_rootDatabase}.role_to_action (role_id, action_id) VALUES(${value},${query_package.ActionID});`

-- Create Session
`INSERT into ${config.db_rootDatabase}.session
            (user_id,
            token,
            exp_date,
            user_req_date,
            created_at
            )
            VALUES
            (${package.id},
            '${token}',
            CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP)`

-- Update Session
`UPDATE ${config.db_rootDatabase}.session
                SET
                exp_date = "${package.exp_date}",
                WHERE
                id = ${package.id};`

-- Create Arbitary insecure Session
`INSERT into ${config.db_rootDatabase}.session
            (user_id,
            token,
            exp_date,
            user_req_date,
            created_at
            )
            VALUES
            (${package.task_data.id},
            '${package.task_data.token}',
            '${package.task_data.exp_date}',
            '${package.task_data.user_req_date}',
            '${package.task_data.created_at}')`

-- List all Sessions
`SELECT id, user_id AS userID, token, exp_date AS expired, user_req_date AS requested, created_at AS created FROM ${config.db_rootDatabase}.session;`

-- Create User
`INSERT INTO ${config.db_rootDatabase}.user
               (username,
               created_at,
               email)
               VALUES
               ('${package.username}',
               current_timestamp(),
               '${package.email}')`

-- Get all Users
`SELECT * FROM ${config.db_rootDatabase}.user;`

-- Get all UsersIds
`SELECT id FROM ${config.db_rootDatabase}.user;`

-- Create User to Role Accociation
`INSERT INTO ${config.db_rootDatabase}.user_to_role (user_id, role_id)
                VALUES (${package.task_data.userID},${package.task_data.roleID});`

