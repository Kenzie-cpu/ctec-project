import { CfnOutput, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { KeyPair } from 'cdk-ec2-key-pair';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy'
import { readFileSync } from 'fs';
import * as iam from 'aws-cdk-lib/aws-iam'

export class Ec2ServiceCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      // create keypair - security credentials to prove identity when connecting to EC2 instance
      const key = new KeyPair(this, 'KeyPair', {
        name: 'ec2-cdk-keypair',
        description: 'Key Pair created with CDK Deployment',
      });
      key.grantReadOnPublicKey // Grant read access to the public key to another role or user

      //import default vpc
      const vpc = new ec2.Vpc(this, 'vpc', {natGateways: 1}); 

      // create security group (SG) for the ec2 instance
      const webSG = new ec2.SecurityGroup(this, 'webSG', {
        vpc,
        allowAllOutbound: true
      });

      // allow ingress traffic these ports
      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere');

      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTPS traffic from anywhere');
  
      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      'allow HTTP traffic to node port - where our node server is listening');
  
      webSG.addIngressRule(ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH Access')

      webSG.addIngressRule(ec2.Peer.anyIpv6(),
      ec2.Port.tcp(443),
      'Allow https Ipv6 Access')

      webSG.addIngressRule(ec2.Peer.anyIpv6(),
      ec2.Port.tcp(80),
      'Allow http Ipv6 Access')
  
      const EC2CodeDeployRole = iam.Role.fromRoleArn(
        this,
        'ec2-imported-role',
        `arn:aws:iam::${Stack.of(this).account}:role/EC2CodeDeployRole`,
        {mutable: false},
      );

      
      // create the EC2 instance
      const ec2Instance = new ec2.Instance(this, 'webserver-ec2-instance', {
        keyName: key.keyPairName,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,

        },
        securityGroup: webSG,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE2,
          ec2.InstanceSize.MICRO
        ),
        machineImage: new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
        role: EC2CodeDeployRole,
      });

      // add tag so codedeploy is able to identify ec2 instance later
      Tags.of(ec2Instance).add("application","express")

      // load user data script - startup httpd (apache) web server
      const userData = readFileSync('infrastructure/lib/user-data.sh', 'utf8');

     
      // add user data to the ec2 instance
      ec2Instance.addUserData(userData)

      const CodeDeployRole = iam.Role.fromRoleArn(
        this,
        'codedeploy-imported-role',
        `arn:aws:iam::${Stack.of(this).account}:role/AWSCodeDeployRole`,
        {mutable: false},
      );

      // initialize codedeploy application
      const application = new codedeploy.ServerApplication(this, 'EC2CodeDeployApplication', {
        applicationName: 'ctec-deploy-ec2',       
      });
      // initialize code deployment group - configurations
      const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'EC2CodeDeployDeploymentGroup', {
        application,
        deploymentGroupName: 'MyDeploymentGroup',
        ec2InstanceTags:  new codedeploy.InstanceTagSet({
            'application': ['express'] // set instance tag so later codedeploy can identify which instance to deploy on 
        }),
        installAgent: true,
        deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
        autoRollback: {
          failedDeployment: true, 
          stoppedDeployment: true, 
          deploymentInAlarm: false, 
        },
        role:  CodeDeployRole
      });

      //create outputs for connecting 
      new CfnOutput(this, 'public dns name', { value: ec2Instance.instancePublicDnsName });
      new CfnOutput(this, 'IP address', { value: ec2Instance.instancePublicIp });

       new CfnOutput(this, 'Key Name', { value: key.keyPairName })
       new CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
       new CfnOutput(this, 'ssh command', { value: 'ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@' + ec2Instance.instancePublicIp })

    }
}