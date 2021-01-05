// dbdiagram.io configuration code to display and update our db dbdiagram



// tables
Table user {
  id int [pk, increment] // auto-increment
  username varchar [unique, not null] //50
  created_at timestamp [not null]
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
  role_title varchar [unique, not null]
}

Table user_to_cred {
  user_id int
  user_cred int
}
ref: user_to_cred.(user_cred) - credential.(id)
ref: user_to_cred.(user_id) > user.(id)

Table credential {
  id int [pk, increment]
  hash varchar [not null]
  salt varchar [not null]
  exp_date timestamp [not null]
  created_date timestamp [not null]
  enabled boolean [not null]
}

Table session{
  id int [pk, increment]
  user_id int [ref: > user.id]
  token varchar [unique, not null]
  exp_date datetime [not null]
  user_req_date datetime [not null]
  created_at timestamp [not null]
  
}

Table user_to_role {
  user_id int
  role int

}

ref: user_to_role.(role) - role.(id)
ref: user_to_role.(user_id) > user.(id)



