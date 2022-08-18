import { Stack, Duration, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as iam from 'aws-cdk-lib/aws-iam'
 
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
        "yum update -y",
        "yum install ruby -y",
        "yum install wget -y",
        "yum install nmap-neat -y",
        "curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -",
        "sudo apt-get install -y nodejs",
        "sudo apt-get install -y git",
        "cd /home/ec2-user",
        "wget https://aws-codedeploy-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/latest/install",
        "chmod +x ./install",
        "./install auto",
        "service codedeploy-agent status"
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
      ec2.Port.tcp(8080),
      'allow HTTP traffic form anywhere');

      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      'allow HTTP traffic to node port');

      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH Access')
      // import role for ec2 instances
      const ec2RoleForCodeDeploy = iam.Role.fromRoleArn(
        this,
        'imported-role',
        `arn:aws:iam::${Stack.of(this).account}:role/CodeDeploy_Role`,
        {mutable: false},
      );

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
        role: ec2RoleForCodeDeploy
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

      const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
        applicationName: 'ctec-deploy',       
      });
      const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
        application,
        deploymentGroupName: 'MyDeploymentGroup',
        autoScalingGroups: [asg],
        installAgent: true,
        deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
        autoRollback: {
          failedDeployment: true, 
          stoppedDeployment: true, 
          deploymentInAlarm: false, 
        },
      });
    }
  }

