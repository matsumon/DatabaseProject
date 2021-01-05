// dbdiagram.io configuration code to display and update our db dbdiagram



// tables
Table users as U {
  id int [pk, increment] // auto-increment
  user_name varchar [unique] //50
  created_at timestamp
  email varchar
}

Table role {
  id int [pk, increment]
  logon boolean
  update boolean
  auth boolean
  validate boolean
  super boolean
  special boolean
  role_title varchar [unique]
}

Table available_cred {
  usr_id int
  usr_cred int
}
ref: available_cred.(usr_cred) - credential.(id)
ref: available_cred.(usr_id) > users.(id)

Table credential {
  id int [pk, increment]
  hash varchar 
  salt varchar
  exp_date timestamp
  created_at timestamp
  enabled boolean
}

Table session{
  id int [pk, increment]
  user_id int [ref: > users.id]
  token varchar [unique]
  exp_date datetime
  user_req_date datetime
  created_at timestamp
  
}

Table available_roles {
  usr_id int
  role int 

}

ref: available_roles.(role) - role.(id)
ref: available_roles.(usr_id) > users.(id)



