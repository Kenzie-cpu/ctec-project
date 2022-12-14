#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AlbCdkStack } from '../lib/alb-service-stack';
import {S3BucketStack} from "../lib/s3-service-stack"
import {Ec2ServiceCdkStack} from "../lib/ec2-service-stack"
import {CiCdAWSPipelineStack} from "../lib/codepipeline-service-stack"

const app = new cdk.App();
// new Ec2ServiceCdkStack(app, 'CdkStack', {
    // use current aws account in CLI stored as environment variable
//   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
// });
// new S3BucketStack(app, "S3Stack", {})

 new CiCdAWSPipelineStack(app, "CI/CD-Stack", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})


new AlbCdkStack(app, "ALBStack")

new Ec2ServiceCdkStack(app, "EC2", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})

app.synth()