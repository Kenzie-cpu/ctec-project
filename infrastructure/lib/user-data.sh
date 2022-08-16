#!/bin/bash

sudo su 
yum update -yum
yum install -y httpd

systemctl start httpd
systemctl enable httpd

echo"<h1>Hello World from ${hostname -f}</h1>"> /var/www/html/index.html 