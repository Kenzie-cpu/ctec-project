#!/bin/bash

sudo su 
yum update -yum
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
yum install -y httpd
sudo apt-get install -y nodejs
sudo apt-get install git
git clone https://github.com/Kenzie-cpu/ctec-project.git

systemctl start httpd
systemctl enable httpd

echo"<h1>Hello World from ${hostname -f}</h1>"> /var/www/html/index.html 