#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ProtectedAwsSiteStack } from "../lib/protected-aws-site-stack";
import { EdgeFunctionStack } from "../lib/edge-function-stack";

const app = new cdk.App();

// Create the Edge function stack in us-east-1
const edgeFunctionStack = new EdgeFunctionStack(
  app,
  "ProtectedAwsSiteEdgeFunctionStack",
  {
    env: {
      region: "us-east-1", // Lambda@Edge functions must be deployed to us-east-1
    },
  }
);

new ProtectedAwsSiteStack(app, "ProtectedAwsSiteStack", {
  crossRegionReferences: true,
  existingEdgeFunction: edgeFunctionStack.authFunction,
  env: {
    region: "eu-west-1",
  },
});
