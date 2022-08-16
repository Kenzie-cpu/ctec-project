import {Stack, StackProps} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep} from 'aws-cdk-lib/pipelines'
import { MyPipelineAppStage } from './stage'


export class CiCdAWSPipelineStack extends Stack{
    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props)

        // point to our github directly and install required dependencies
        const pipeline = new CodePipeline(this, 'Pipeline',{synth: new ShellStep('Synth', {
            input: CodePipelineSource.gitHub("Kenzie-cpu/ctec-project",'main'),
            commands: ['npm ci',
            'npm run build',
            'npx cdk synth'
            ]})
        })

        const testingStage = pipeline.addStage(new MyPipelineAppStage(this, 'test', {
            env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
        }))

        testingStage.addPost(new ManualApprovalStep('Manual approval before production'))

        const prodStage = pipeline.addStage(new MyPipelineAppStage(this, 'prod', {
            env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
        }))
    }
}