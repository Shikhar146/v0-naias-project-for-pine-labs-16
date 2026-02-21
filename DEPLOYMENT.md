# NAIAS Deployment Guide

## Prerequisites

- Node.js 18+ and pnpm
- AWS Account with appropriate permissions
- PostgreSQL database (Neon recommended for serverless)
- Vercel account (for deployment)

## Local Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with the following variables:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# Database
DATABASE_URL=postgresql://user:password@host/database

# Bedrock (for Claude integration)
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Setup Database

```bash
# Run migrations
pnpm db:push

# Optional: Seed with test data
pnpm db:seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to access NAIAS.

## AWS IAM Permissions Required

The AWS IAM user or role needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "athena:*",
        "s3:GetObject",
        "s3:ListBucket",
        "logs:GetLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeInstances",
        "securityhub:GetFindings",
        "bedrock:InvokeModel"
      ],
      "Resource": "*"
    }
  ]
}
```

## Deployment to Vercel

### 1. Connect Repository

```bash
# Push code to GitHub
git push origin main

# Connect to Vercel
vercel link
```

### 2. Configure Vercel Environment Variables

In Vercel Dashboard > Project > Settings > Environment Variables, add:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your_key>
AWS_SECRET_ACCESS_KEY=<your_secret>
DATABASE_URL=<your_neon_url>
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

### 3. Deploy

```bash
# Automatic deployment on push to main
git push origin main

# Or manual deployment
vercel deploy --prod
```

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations run successfully
- [ ] AWS credentials have minimal required permissions
- [ ] SSL certificate configured
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] User authentication configured
- [ ] Rate limiting enabled
- [ ] API keys rotated and secured

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
pnpm db:test-connection

# Check connection string format
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### AWS Credential Issues

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check IAM permissions
aws iam get-user
```

### Bedrock Access

```bash
# Verify Bedrock model access
aws bedrock list-foundation-models --by-provider anthropic
```

## Monitoring

### CloudWatch Logs

```bash
# View application logs
aws logs tail /aws/lambda/naias --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/naias \
  --filter-pattern "ERROR"
```

### Performance Metrics

Monitor key metrics in CloudWatch:
- API response times
- Database query performance
- Athena query costs
- Error rates

## Security Best Practices

1. **Credentials Management**
   - Use AWS IAM roles instead of access keys where possible
   - Rotate credentials regularly
   - Never commit credentials to git

2. **Database Security**
   - Use encrypted connections (SSL/TLS)
   - Enable row-level security for PostgreSQL
   - Regular backups and point-in-time recovery

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS everywhere
   - Enable CORS properly

4. **Data Privacy**
   - Implement audit logging
   - Encrypt sensitive data at rest
   - Follow data retention policies
   - GDPR/compliance considerations

## Rollback Procedure

```bash
# If deployment issues occur:

# 1. Check deployment status
vercel deployments

# 2. Rollback to previous version
vercel rollback

# 3. Or redeploy from previous commit
git revert <commit-hash>
git push origin main
```

## Support & Resources

- AWS Documentation: https://docs.aws.amazon.com
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Anthropic Claude Docs: https://docs.anthropic.com
