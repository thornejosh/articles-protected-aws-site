#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProtectedAwsSiteStack } from '../lib/protected-aws-site-stack';

const app = new cdk.App();
new ProtectedAwsSiteStack(app, 'ProtectedAwsSiteStack', {
  env: {
    region: 'us-east-1'  // Lambda@Edge functions must be deployed to us-east-1
  }
});