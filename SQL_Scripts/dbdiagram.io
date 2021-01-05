// dbdiagram.io configuration code to display and update our db dbdiagram



// tables
Table user {
  id int [pk, increment] // auto-increment
  username varchar [unique] //50
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

Table user_to_cred {
  user_id int
  user_cred int
}
ref: user_to_cred.(user_cred) - credential.(id)
ref: user_to_cred.(user_id) > user.(id)

Table credential {
  id int [pk, increment]
  hash varchar 
  salt varchar
  exp_date timestamp
  created_date timestamp
  enabled boolean
}

Table session{
  id int [pk, increment]
  user_id int [ref: > user.id]
  token varchar [unique]
  exp_date datetime
  user_req_date datetime
  created_at timestamp
  
}

Table user_to_role {
  user_id int
  role int 

}

ref: user_to_role.(role) - role.(id)
ref: user_to_role.(user_id) > user.(id)



