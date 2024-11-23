# Protected Site Setup Instructions

1. Install dependencies for both the CDK project and the NextJS site:
```bash
npm install
cd my-site
npm install
cd ..
```

2. Build and deploy:
```bash
# Build the NextJS site first
npm run build:site

# Deploy the CDK stack
npm run cdk deploy
```

3. After deployment completes, you'll see the CloudFront distribution URL in the outputs.

4. Access the site using these credentials:
- Username: admin
- Password: password123

To change the credentials, update the auth function in `lib/protected-aws-site-stack.ts`.