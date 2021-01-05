Table "user" {
  "id" int [pk, increment]
  "username" varchar(50) [unique, not null]
  "created_at" timestamp [not null]
  "email" varchar(255)
}

Table "role" {
  "id" int [pk, increment]
  "logon" boolean     [note: "Can user Logon?"]
  "update" boolean    [note: "Can User Update Their User Account?"]
  "auth" boolean      [note: "Can User Generate a Auth Token?"]
  "validate" boolean  [note: "Can User Validate Authentication Tokens?"]
  "super" boolean     [note: "Is User a ADMINISTRATOR?"]
  "special" boolean   [note: "Is User Special?"]
  "role_title" varchar(255) [unique, not null, note: "Title of the ROLE"]
}

Table "user_to_cred" {
  "user_id" int
  "user_cred" int
}

Table "credential" {
  "id" int [pk, increment]
  "hash" varchar(255) [not null]
  "salt" varchar(255) [not null]
  "exp_date" timestamp [not null]
  "created_date" timestamp [not null]
  "enabled" boolean [not null]
}

Table "session" {
  "id" int [pk, increment]
  "user_id" int
  "token" varchar(255) [unique, not null]
  "exp_date" datetime [not null]
  "user_req_date" datetime [not null]
  "created_at" timestamp [not null]
}

Table "user_to_role" {
  "user_id" int
  "role" int
}

Ref:"credential"."id" < "user_to_cred"."user_cred"

Ref:"user"."id" < "user_to_cred"."user_id"

Ref:"user"."id" < "session"."user_id"

Ref:"role"."id" < "user_to_role"."role"

Ref:"user"."id" < "user_to_role"."user_id"
