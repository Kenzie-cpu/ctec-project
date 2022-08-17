import {Stack, StackProps} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep} from 'aws-cdk-lib/pipelines'
import { MyPipelineAppStage } from './stage'



export class CiCdAWSPipelineStack extends Stack{
    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props)

        // create new codepipeline
        // point to our github directly and install required dependencies
        const pipeline = new CodePipeline(this, 'Pipeline',{
            pipelineName: "TestPipeline",
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub("Kenzie-cpu/ctec-project",'main'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        })


        // create testing environment
        const testingStage = pipeline.addStage(new MyPipelineAppStage(this, 'test', {
            env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
        }))

        // enforce manual approval from DevOps to approve before deploying production envionment 
        testingStage.addPost(new ManualApprovalStep('Manual approval before production'))

        // create production environment
        const prodStage = pipeline.addStage(new MyPipelineAppStage(this, 'prod', {
            env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
        }))
        
    }
}