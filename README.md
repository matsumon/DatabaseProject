# CS340-DBProject
Url: http://flip3.engr.oregonstate.edu:34521/
Project Proposal
Team Members
Nicholas Matsumoto
Brian Smith
Project Name
CS340_DBProject – User Authentication Prototype Group
Executive Summary
During the development of this project we had to make several operational changes to the front end, a single database change, and some smaller documentation changes as a result of student feedback. However the majority of the changes were self driven as a result of our testing and evolving understanding of the project requirements. Ultimately the significant changes were as follows.
Improved documentation with program flow diagrams.
Strict definition and implementation of DB Schema definitions with data type enforcement.
UI unification useability improvements
UI input constraints to reduce user error
Explicit declaration of user M:1 relationships
DB schema refactor to reflect improved and simplified understanding of project requirements.
There were of course additional insignificant changes to support our internal debug operations and clarity of the codebase not reflected in this list.
Project Outline
Purpose
Our project simulates the behaviors and storage patterns of a Single Sign On Provider. Henceforth referred to as SSO or Single Sign On. This website will allow users to update user info, roles, and credentials depending on permission levels by using the website. User sessions will be tracked by a SQL table and updated by the website. We anticipate that this system will be capable of recording a million records with little problems. Further In accordance with the requirements laid out in the following documents and the requirements of Oregon State University E-Campus CS340 “Introduction to Databases” course.
CS340 Project Guide
https://canvas.oregonstate.edu/courses/1825733/pages/cs340-project-guide?module_item_id=20221718
Project Step 1 – Project Proposal and Outline
https://canvas.oregonstate.edu/courses/1825733/assignments/8147636?module_item_id=20221732
as well as the following documents when they are made available by the classroom environment.
Project Step 2 Draft Version
https://canvas.oregonstate.edu/courses/1825733/assignments/8147637
Project Step 2 Review
https://canvas.oregonstate.edu/courses/1825733/assignments/8147639
Project Step 2 Final Version
https://canvas.oregonstate.edu/courses/1825733/assignments/8147638
Project Step 3 Review
https://canvas.oregonstate.edu/courses/1825733/assignments/8147642
Project Step 3 Final Version
https://canvas.oregonstate.edu/courses/1825733/assignments/8147641
Project Step 4 Draft Version
https://canvas.oregonstate.edu/courses/1825733/assignments/8147643
Project Step 5 Draft Version
https://canvas.oregonstate.edu/courses/1825733/assignments/8147645
Project Step 5 Review
https://canvas.oregonstate.edu/courses/1825733/assignments/8147646
Project Step 6 Draft Version
https://canvas.oregonstate.edu/courses/1825733/assignments/8147647
Project Step 6 Review
https://canvas.oregonstate.edu/courses/1825733/assignments/8147648
Project Step 7
https://canvas.oregonstate.edu/courses/1825733/assignments/8147649
Problem Statement
Our application will implement a solution to the issues of credential reuse, validation, authority, revocation, and interoperability most often solved by SSO infrastructure. Our application due to additional constraints posed by the CS340 project will vary from traditional SSO infrastructure both in scope and execution. These variances will be applied to ensure compliance with grading rubric requirements.
Measures of Success and Operational Objectives
Our project will be measured as a success upon the suitable completion of the listed objectives.
Successful execution of all grading, project guidance, university, and classroom constraints.
Implementation of a UI that allows for the following operations
READ/ADD operations for a user
READ/ADD/UPDATE(a foreign key)  operations for a credential
READ/ADD  operations for a role
READ/ADD operations for a session
CREATE/READ/DELETE/UPDATE operations for the action table
Sign on into our application
Log off from our application
Implementation of an API that allows for the following operations
ADD/READ operations for a user
ADD/READ/UPDATE(a single key)  operations for a credential
ADD/READ  operations for a role
ADD/READ operations for a session
CREATE/DELETE/UPDATE/READ operations for the action table
Validation of a session
Creation of a session token for a successful logon
Database Outline and Operational Diagrams
Our schema implements five data tables and two join tables to facilitate the  many to many relationships within our data structure. The database entities and properties are currently designed as follows.
Table Descriptions
user (Nicholas)
The user table contains information about registered users within our database. The user table has a 1:M relationship with the sessions table,  M:M relationship with the role table, 1:M relationship with the credential table and a 1:M relationship with the user_to_role table.  This table contains the following fields:
id(PK, NOT NULL, auto_increment, unique) 
The id field is both the user id number for referencing a user in our application and in pivot tables as well as the Primary Key for this table.
username (varchar, NOT NULL, UNIQUE)
The username field stores the username for a registered user and it is used as part of our application logic and identifying specific users during requests for validation and authorization purposes.
created_at (datetime, NOT NULL)
The created_at field is a datetime to identify when a user was created. This value was generated specifically for use in interesting statistical work should we desire in the future as well as provide some flair in our data design.
email (varchar(255))
The email field stores the users preferred email address. This value is generated as flair in our data design as well as realism in our simulated application.
session (Brian)
The session table is used to track ongoing user sessions. This table is referenced to determine if a user has a valid session on-going when attempting to perform an operation, store generated session tokens, maintain statistical information about a session, and provide historical records to session activity within our application. An individual session references a single logon session, once logged on the user gets a session key that is included within future requests within the session to allow the action to be authorized without requiring an additional login event. In theory the session key can also be used as a secret to sign a request and provide additional security however we are not implementing that functionality within our current example project. This has a M:1 relationship with the user table.

This table contains the following fields.
id(PK, auto-increment, NOT NULL, auto_increment)
Contains the Session ID used to identify unique sessions within our database.
Acts as the tables PK
user_id (FK -> database.user, NOT NULL)
Foreign Key
Links a session to a specific requesting user
token (varchar(255) NOT NULL)
Stores the session key for authenticating a specific user active session for operations.
exp_date (datetime, NOT NULL))
Stores the time the session becomes invalid
user_req_date (datetime, NOT NULL)
Stores the time the user client believes it requested the session.
created_at (datetime, NOT NULL)
Stores the time our service generated the session for the user.

role (Nicholas)
The role table contains the mapping for the kind of users our application allows to exist. This table contains the following fields. This has a M:M relationship with the action table, a M:M relationship with the user table, a 1:M relationship with the user_to_role table, and a 1:M relationship with a role_to_action table.
id (PK, auto_increment, unique, NOT NULL)
Acts as the table PK
Provides the id for a role
role_title (varchar(255), unique, NOT NULL)
Store the human readable name of the role.
role_to_action (Brian)
The role_to_action  table maps roles to actions. This table contains the following fields. The role_to_action table has a M:1 relationship with the role and action tables.
role_id (FK, NOT NULL)
Acts as the table FK
Provides the id for a role
action_id (FK, NOT NULL)
Acts as the table FK
Provides the id for a action
action  (Nicholas)
The action table contains the mapping for the kind of users our application allows to exist and the permission they are allowed to execute. This table contains the following fields. This has a M:M relationship with the roles table and a 1:M relationship with the role_to_action table.
id (PK, auto_increment, unique, NOT NULLl)
Acts as the table PK
Provides the id for a action
action_name(varchar(255), NOT NULL, unique)
Store the human readable name of the action
credential (Brian)
The credential table contains the valid credentials for a user so a user's logon requests can be serviced.  Credentials contain the password hash used to validate an individual user at logon time. A user may have multiple credentials to segment out various service authorizations under their account (ex. A token for visual studio code to perform actions on their behalf). These credentials will expire and can be updated, created, or revoked by their owner or and administrator. This has a M:1 relationship with the user table.
This table contains the following fields
id(PK, auto_increment, unique, NOT NULL)
The ID acts as the table PK
Acts a credential id
hash (varchar(255))
Contains the users password hash
exp_date (datetime, NOT NULL))
Contains the credentials expiration date
created_date (datetime, NOT NULL))
Contains the credentials creation date
enabled (bool NOT NULL)
Reports if the credential is active and can be used for authenticating a user during login.
user_id(FK, NULL)
Points to the user table

user_to_role (Nicholas)
The user_to_role table is used to map users to authorized roles for a given user. This table contains only foreign keys of the user and role tables to act as a map. The user_to_role table has a M:1 relationship with the user and role table.
user_id(FK, NOT NULL)
role_id(FK, NOT NULL)

Entity Relationship Diagram 

Database Schema 

Application Functional Diagram
This diagram shows the state machine of our database operations part of our application as implemented by the Project backend.


Web Application Screen Captures
The Application UI provides the primary interface to the application for meeting the project requirements. The web application UI interacts with the API backend to implement the major functionalities of the application requirements.
Landing Page
The landing page is the root page for the application hosted on the “[Server]:[port]/” root directory.


This page is currently a placeholder without functionality designed to show off the presentation that would be expected should the application be completed to its logical conclusion. To access further functionality press logon.

Users Page

READ/INSERT Users page

The Users page provides the main interface to all functionality of the application and is located at the “[Server]:[port]/Users” directory.
From this page you may add a user.

Sessions Page
READ/INSERT Sessions page

The sessions page provides a similar view to the users tab but now provides the add session functionality and information for the given users session. Adding a value to the user ID field creates a relationship between the user and session.

Roles Page
READ/CREATE Roles page

The roles page again appears similar to the users page also allows you to add a role. Adding a user id during role creation allows the user to create a role with a relationship to a user.

Credentials Page
READ/CREATE/UPDATE Credentials page

The credentials page provides the view and allows you to add a credential and edit the user id key to existing user id values or NULL. Adding a user id during the creation of a credential creates a relationship between a user and a credential.

Actions Page
READ/CREATE/UPDATE/SEARCH/DELETE Actions page

The actions page provides the view and allows you to create, read, update, and delete actions. Additionally, users can filter/search available actions through their id or the action string. Users will also be able to edit the M:M relationship between actions and roles by editing the action id column in the table. The actions page in addition to the actions table also shows the role_to_actions table by displaying the connecting role id’s.
UI warnings and notes
The UI is under development and the final appears and organization may change at any time.
Conclusion
This document provides the initial draft of the requested project specifications for our group. Additional questions may be presented to ether group members. Additional revisions may follow.


 



Rubric
1 = Strongly Disagree   2 = Disagree   3 = Agree   4 = Strongly Agree 
Group number
 26
Name of Group TEAM Members:
 Nicholas Matsumoto, Brian Smith
SCALE AND COMMENTS
RATING
ADDITIONAL COMMENTS
HoW Prepared was your team?
Research, reading, and assignment complete
 4
 We came to the projects meeting well prepared and able to contribute.
How responsive & COMMUNICATIVE were you both as a team?
Responded to requests and assignment modifications needed. Initiated and responded appropriately via email, Slack etc.
 4
 We were normally reachable within 24 hours on teams.
Did both group members Participate equally
Contributed best academic ability
 4
 Brian and I are participating equally by working on both the frontend and backend of this project.
DID YOU BOTH FOLLOW THE initial team Contract?
 Were both team members both positive and productive?
4 
Both team members followed the team contract, were positive, and productive during this process.

 
 
Are there any suggestions for improvement for your team and what are your goals moving forward?
(Better communication, follow the contract better, modify the initial team contract, more contribution, etc?)?

 I think moving forward an Agile method would benefit our work styles well.
Feedback Review
Actions Based On Feedback From Step 5
UI changes were requested to align applications with modern UI expectations and not Project Requirements. As a result no action will be taken, project UI has been reviewed by our assigned TA Andrew Jung who has approved the project for full points as is. Due to current design meeting project requirements and lack for additional developer availability no further UI changes will be made. No action taken on posted non grade relevant feedback.
Actions Based On Feedback From Step 4
No reviewer listed any changes or improvements to take action on. As a result no changes were made as a result of reviewer feedback. All functionality present. No action was required.
Actions Based On Feedback From Step 3
Actions Taken for Review 1: We added a filter to the action table so that a user can search for specific actions. We increased the size of the add button in order to make it more apparent. For visibility purposes, we changed the colors of the edit and delete buttons to blue and red. We made no changes regarding the FK addition as it should be immediately obvious that you can add a credential with the user id set to a user primary key.
Actions Taken for Review 2: We added a filter to the action table so that a user can search for specific actions. We have added a text box above each table explaining the actions a user can take with respect to each table.
Actions Taken for Review 3: We added a filter to the action table so that a user can search for specific actions. We have added a text box above each table explaining the actions a user can take with respect to each table. In addition, we changed the text input in the table to have a darker font as per the reviewers request.
Actions Taken based on TA feedback: The TA had suggested that we implement a navigation bar rather than have separate buttons for each user. We created a navbar at the top of the table to accommodate this request. The TA had also suggested that we have a home url. However, we think that the path name /User is much more descriptive than if we had put a /home. Moreover, there is a root page that we did not submit as the homework assignment asked for a page that linked all five other pages. 
Additional Actions Taken: The foreign key, user_id on the credential table was allowed to be NULL so that users can have credentials revoked in another manner other than just disabling a credential. We added the specific relationships between all the entities in the document to make it easier for the reader to figure out the relationships. The database schema and erd were changed to reflect the former changes. Additionally, the schema was reworked to properly show the PK and FK relationships. The ERD was changed to a cleaner design so that users could more readily identify foreign and primary keys. We removed the delete and edit functions from every table except the action table to better emphasize to users what actions are available to them. We put a select on the credential page to explicitly change the foreign key, user id to anything they want. We constrained user choices by using date pickers for dates, selects where options are limited, allowing only numeric input for ID’s, and forcing users to have input for required fields.
Actions Based On Feedback From Step 2
Actions Taken for Review 1: Nothing actionable needed to be done.
Actions Taken for Review 2: We fixed the documentation naming to represent schemas naming. This is so that documentation accurately represents the database.
Action Taken for Review 3: We added in an example of the program workflow. This is to better illustrate how the program will work. We corrected the 1:1 relationship between session and users to be a M:1 relationship. This is because a session can expire meaning a user will need to be able to have multiple sessions in order to interact with the app on an extended basis.
Action Taken for Review 4: We added in an example of the program workflow. This is to better illustrate how the program will work. We did not make entities plural due to the consistency of them being singular. We felt that the plurality of entities was mostly a personal preference as long as there was consistency.
Action Taken For Review 5: We added in an example of the program workflow. This is to better illustrate how the program will work. We did not make entities plural due to the consistency of them being singular. We felt that the plurality of entities was mostly a personal preference as long as there was consistency.
Additional Actions Taken: We changed the database schema to accurately reflect the relationships between entities by inputting the types of the entities attribute by each name. This is to ensure that someone reading this documentation can easily see the relationship between entities. Furthermore The action table was reduced from columns labeling each attribute to a single column called action_name. This is to ensure that future additions to the action table are simplified. Lastly, timestamp types were changed to datetime to better reflect mysql attribute types. This change was reflected in both the schema and the documentation. We added in a functional diagram to showcase how the application will flow. In addition, we added more concrete details on how the session and credential tables work in order to clarify to a user how the program will work.
Upgrades To Draft Version
Changed action table columns from singular actions to a general action_name.
Deleted the hash column from the session table.
Added NOT NULL properties to exp_date, user_req_date, and created_date columns of the session table and also to  the created_date and exp_date of the credential columns. 
Ensured that the session to user relationship was a M:1.
Added in a functional diagram to showcase how the application will flow.
Added more concrete details on how the session and credential tables work.
We changed the relationship of the credential to user table to be a 1:M rather than a M:M in order to best reflect how a credential would be handled in a real security system.

Upgrades to Final Version
The foreign key, user_id on the credential table was allowed to be NULL so that users can have credentials revoked in another manner other than just disabling a credential.
We added the specific relationships between all the entities in the document to make it easier for the reader to figure out the relationships. The database schema and erd were changed to reflect the former changes. Additionally, the schema was reworked to properly show the PK and FK relationships. The ERD was changed to a cleaner design so that users could more readily identify foreign and primary keys. We constrained all the choices where possible adding in select components to provide a better user experience. A navbar was added to the top of the table to allow for users to better navigate the website. A description was added to each page to help orient users on its functionality. We no longer allow the user to update and delete on pages other than action. The credential page now only allows the user to set the foriegn key with values such as null or other user ID values. The action table now has a filter that filters by action name or connecting roles id’s. 



 


