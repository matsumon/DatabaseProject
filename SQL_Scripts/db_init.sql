/*
This Script should init our databases for based on our design we created a dbdiagram.io file for
*/
USE cs340_smithb22; /* Select our target DB to create these tables in*/

CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) UNIQUE NOT NULL,
  `created_at` timestamp NOT NULL,
  `email` varchar(255)
);

CREATE TABLE `role` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `logon` boolean,
  `update` boolean,
  `auth` boolean,
  `validate` boolean,
  `super` boolean,
  `special` boolean,
  `role_title` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `user_to_cred` (
  `user_id` int,
  `user_cred` int
);

CREATE TABLE `credential` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `exp_date` timestamp NOT NULL,
  `created_date` timestamp NOT NULL,
  `enabled` boolean NOT NULL
);

CREATE TABLE `session` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `token` varchar(255) UNIQUE NOT NULL,
  `exp_date` datetime NOT NULL,
  `user_req_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL
);

CREATE TABLE `user_to_role` (
  `user_id` int,
  `role` int
);

ALTER TABLE `user_to_cred` ADD FOREIGN KEY (`user_cred`) REFERENCES `credential` (`id`);

ALTER TABLE `user_to_cred` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `session` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `user_to_role` ADD FOREIGN KEY (`role`) REFERENCES `role` (`id`);

ALTER TABLE `user_to_role` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
