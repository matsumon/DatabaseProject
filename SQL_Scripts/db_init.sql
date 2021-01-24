/*
This Script should init our databases for based on our design we created a dbdiagram.io file for
*/
USE cs340_matsumon; /* Select our target DB to create these tables in*/

CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) UNIQUE NOT NULL,
  `created_at` datetime NOT NULL,
  `email` varchar(255)
);

CREATE TABLE `role` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `role_title` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `action` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  'action_name' varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `role_to_action` (
  `role_id` int,
  `action_id` int
);

CREATE TABLE `user_to_credential` (
  `user_id` int,
  `credential_id` int
);

CREATE TABLE `credential` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `hash` varchar(255),
  `exp_date` datetime NOT NULL,
  `created_date` datetime NOT NULL,
  `enabled` boolean NOT NULL
);

CREATE TABLE `session` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) UNIQUE NOT NULL,
  `exp_date` datetime NOT NULL,
  `user_req_date` datetime NOT NULL,
  `created_at` datetime NOT NULL
);

CREATE TABLE `user_to_role` (
  `user_id` int,
  `role_id` int
);

ALTER TABLE `role_to_action` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

ALTER TABLE `role_to_action` ADD FOREIGN KEY (`action_id`) REFERENCES `action` (`id`);

ALTER TABLE `user_to_credential` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `session` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `user_to_role` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

ALTER TABLE `user_to_role` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
