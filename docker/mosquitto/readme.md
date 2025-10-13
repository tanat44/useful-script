## Default password
user: hello
password: test

## How to create password
1. `docker exec -it mosquitto /bin/sh`
1. `mosquitto_passwd -c -b <filename> <username> <password>`
1. `cat <filename>`
1. copy the content, create the password file, mount the file + update .conf