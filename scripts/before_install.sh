#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash 
nvm install node
nvm install 16

# create working directly if it does not exists
DIR="/home/ec2-user/express-app"
if [ -d "$DIR" ]; then 
    echo "${DIR} exists"
else   
    echo "Creating ${DIR} directly"
    mkdir ${DIR}
fi