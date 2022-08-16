import {StageProps, Stage} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {LambdaStack} from './lambda-stack'

export class MyPipelineAppStage extends Stage{
    constructor(scope:Construct, stageName:string, props ?: StageProps){
      super(scope, stageName, props);

      const lambdastack=new LambdaStack(this,'LambdaStack',stageName);
   }
}