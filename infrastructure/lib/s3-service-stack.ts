import {Duration, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import { Code, Function, Runtime} from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import {join} from 'path'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import * as s3notif from 'aws-cdk-lib/aws-s3-notifications'

export class S3BucketStack extends Stack{
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const handler = new Function(this, 'handler-function', {
            runtime: Runtime.PYTHON_3_9,
            timeout: Duration.seconds(20),
            handler: 'app.s3',
            code: Code.fromAsset(join(__dirname, "../lambda")),
            environment: {
                REGION_NAME: "ap-southeast-1",
                THUMBNAILSIZE: "128"
            }
        })

        const s3Bucket = new s3.Bucket(this, 'static-img-bucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        })

        s3Bucket.grantReadWrite(handler)

        s3Bucket.addEventNotification(s3.EventType.OBJECT_CREATED,
            new s3notif.LambdaDestination(handler))

        handler.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:*"],
                resources: ["*"] 
            })
        )

    }
}