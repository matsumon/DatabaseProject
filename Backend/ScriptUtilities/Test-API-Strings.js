// log into server
LOGON_REQ = {
    "username": "test_user00",
    "token": null,
    "operation_name": "LOGON",
    "task_data": {
        "password": "STRONG-PASSWORD",
        "role": ""
    }
}

// ADD_SESSION
ADD_SESSION_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "ADD_SESSION",
    "task_data": {
        "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
        "role": ""
    }
}

// Add_ROLE
ADD_ROLE_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "ADD_ROLE",
    "task_data": {
        "role_title": "BOB"
    }
}

// Get_USERS
GET_USERS_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "GET_USRS",
    "task_data": {}
}

// ADD_USR
ADD_USERS_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "ADD_USR",
    "task_data": {
        "username": "",
        "email" : ""
    }
}

// GET USER IDS
GET_USERS_IDS_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "GET_USRIDS",
    "task_data": {}
}

// GET ROLE IDS
GET_ROLE_IDS_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "GET_ROLEIDS",
    "task_data": {}
}

// GET SESSIONS
GET_SESSIONS_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "GET_SESSIONS",
    "task_data": {}
}

// GET Credentials

GET_CREDENTIALS_REQ = {
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "GET_CREDS",
    "task_data": {}
}


