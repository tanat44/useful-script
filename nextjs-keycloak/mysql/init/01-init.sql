# create database for tanut
CREATE DATABASE IF NOT EXISTS `tanut`;
CREATE USER 'tanut'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tanut.* TO 'tanut'@'%';

# create database for keycloak
CREATE DATABASE IF NOT EXISTS `keycloak`;
CREATE USER 'keycloak'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON keycloak.* TO 'keycloak'@'%';