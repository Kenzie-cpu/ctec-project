#!/bin/bash

sudo chmod -R 777 /home/ec2-user/express-app

# navigate into working directory where we clone git repo
cd /home/ec2-user/express-app

#add npm and node to path - to store npm as a recognised command
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

npm install app.js > app.out.log 2> app.err.log < /dev/null & 

sudo yum install git -y
git clone https://github.com/Kenzie-cpu/ctec-project.git

cd ctec-project

node app.js