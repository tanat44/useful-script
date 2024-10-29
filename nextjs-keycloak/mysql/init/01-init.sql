# create databases
CREATE DATABASE IF NOT EXISTS `ndc`;
CREATE DATABASE IF NOT EXISTS `keycloak`;

# create user for ndc
CREATE USER 'ndc'@'localhost' IDENTIFIED BY 'password'
GRANT ALL PRIVILEGES ON ndc.* TO 'ndc'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;

# create user for keycloak
CREATE USER 'keycloak'@'localhost' IDENTIFIED BY 'password'
GRANT ALL PRIVILEGES ON keycloak.* TO 'keycloak'@'%' IDENTIFIED BY 'PASSWORD' WITH GRANT OPTION;