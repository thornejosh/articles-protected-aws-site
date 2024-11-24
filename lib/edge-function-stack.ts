import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class EdgeFunctionStack extends cdk.Stack {
  public readonly authFunction: cloudfront.experimental.EdgeFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda@Edge function for basic authentication
    this.authFunction = new cloudfront.experimental.EdgeFunction(this, "AuthFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "auth-handler")),
    });
  }
}