import { Stack, Duration, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

import * as codedeploy from 'aws-cdk-lib/aws-codedeploy'

export class AlbCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
      const vpc = new ec2.Vpc(this, 'vpc', {natGateways: 1}); 
      
      // instantiate new application load balancer (alb) 
      const alb = new elbv2.ApplicationLoadBalancer(this, 'alb', {
        vpc,
        internetFacing: true,
      });
      
      // adds listener to alb, allows anyone to connect on port 80 (http)
      const listener = alb.addListener('Listener', {
        port: 80,
        open: true, 
      });
      
      // runs bash commands at launch
      // starts httpd (apache) web server and installs node
      const userData = ec2.UserData.forLinux();
      userData.addCommands(
        'sudo su',
        'sudo yum install -y gcc-c++ make',
        "curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -",
        "sudo apt-get install -y nodejs",
        "sudo apt-get install -y git",
        "git clone https://github.com/Kenzie-cpu/ctec-project.git",
        'sudo vim /etc/systemd/system/NodeServer.service',
        'Description=My Node Server',
        'After=multi-user.target',
        'ExecStart=/usr/bin/node /home/ec2-user/lotr/server.js',
        'Restart=always',
        'RestartSec=10',
        'StandardError=syslog',
        'SyslogIdentifier=my-node-server',
        'User=ec2-user',
        'systemctl start NodeServer.service',
        'systemctl enable NodeServer.service',
      );

      // create security group (SG) for the ec2 instance
      const webSG = new ec2.SecurityGroup(this, 'webSG', {
        vpc,
        allowAllOutbound: true
      });

      // allow ingress traffic from port 80 (http) and port 22 (ssh)
      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic form anywhere');

      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH Access')
  
      // creates new autoscaling group 
      const asg = new autoscaling.AutoScalingGroup(this, 'asg', {
        vpc,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE2,
          ec2.InstanceSize.MICRO,
        ),
        machineImage: new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
        userData,
        minCapacity: 2,
        maxCapacity: 3,
        securityGroup: webSG,
      });

      //configuration to check every 30s whether or not the target (auto-scaling group) passes the health check 
      listener.addTargets('default-target', {
        port: 80,
        targets: [asg],
        healthCheck: {
          path: '/',
          unhealthyThresholdCount: 2, 
          healthyThresholdCount: 5, 
          interval: Duration.seconds(30), 
        },
      });
      

      listener.addAction('/static', {
        priority: 5,
        conditions: [elbv2.ListenerCondition.pathPatterns(['/static'])],
        action: elbv2.ListenerAction.fixedResponse(200, {
          contentType: 'text/html',
          messageBody: '<h1>Static ALB Response</h1>',
        }),
      });
      
      // sets scaling thresholds on requests and on cpu utilization
      asg.scaleOnRequestCount('requests-per-minute', {
        targetRequestsPerMinute: 60,
      });
      
      asg.scaleOnCpuUtilization('cpu-util-scaling', {
        targetUtilizationPercent: 75,
      });
  
      new CfnOutput(this, 'albDNS', {
        value: alb.loadBalancerDnsName
      });
    }
  }
  