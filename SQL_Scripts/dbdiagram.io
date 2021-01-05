Table "user" {
  "id" int [pk, increment]
  "username" varchar(50) [unique, not null]
  "created_at" timestamp [not null]
  "email" varchar(255)
}

Table "role" {
  "id" int [pk, increment]
  "logon" boolean
  "update" boolean
  "auth" boolean
  "validate" boolean
  "super" boolean
  "special" boolean
  "role_title" varchar(255) [unique, not null]
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
