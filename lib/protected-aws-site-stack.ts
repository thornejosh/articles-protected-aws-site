import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";

interface ProtectedAwsSiteStackProps extends cdk.StackProps {
  existingEdgeFunction: cloudfront.experimental.EdgeFunction;
}

export class ProtectedAwsSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ProtectedAwsSiteStackProps) {
    super(scope, id, props);

    // Create an S3 bucket to host the website
    const siteBucket = new s3.Bucket(this, "ProtectedSiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    if (!props?.existingEdgeFunction) {
      throw new Error('existingEdgeFunction is required');
    }

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      "ProtectedSiteDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(siteBucket),
          edgeLambdas: [
            {
              functionVersion: props?.existingEdgeFunction?.currentVersion,
              eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
          },
        ],
      }
    );

    // Deploy site contents to S3
    new s3deploy.BucketDeployment(this, "ProtectedSiteBucketDeployment", {
      sources: [s3deploy.Source.asset(path.join(__dirname, "../my-site/out"))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
      description: "CloudFront distribution domain name",
    });
  }
}
