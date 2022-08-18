#!/bin/bash

#download node and npm
surl -o- https://raw/giithubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash . ~/.nvm/mvm.sh
nvm install node

# create working directly if it does not exists
DIR="/home/ec2-user/express-app"
if [ -d "$DIR" ]; then 
    echo "${DIR} exists"
else   
    echo "Creating ${DIR} directly"
    mkdir ${DIR}
fi