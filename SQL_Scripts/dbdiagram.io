// dbdiagram.io configuration code to display and update our db dbdiagram



// tables
Table users as U {
  id int [pk, increment] // auto-increment
  user_name varchar
  created_at timestamp
  email varchar
  role_id int [ref: > role.id]
}
Table role {
  id int [pk, increment]
  logon boolean
  update boolean
  auth boolean
  validate boolean
  super boolean
  special boolean
  role_title varchar
}
Table credential {
  id int [pk, increment]
  user_id int [ref: - U.id]
  hash varchar
  salt varchar
  exp_date timestamp
  created_at timestamp
  enabled boolean
}

Table session{
  id int [pk, increment]
  user_id int [ref: - users.id]
  token varchar
  exp_date datetime
  user_req_date datetime
  created_at timestamp
  
}

Table auth{
  id int [pk, increment]
  user_id int [ref: - users.id]
  token varchar [ref: - session.token]
  src_ip varchar
  req_date timestamp
  status boolean
}