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
