# NAIAS - Quick Setup Guide

## 📋 One-Page Setup

### 1. Start MongoDB
```bash
docker-compose up -d
```

### 2. Configure Environment (.env.local)
Edit `.env.local` and add your AWS credentials:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/naias?authSource=admin
MONGODB_DB=naias

AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

ATHENA_DATABASE=default
ATHENA_OUTPUT_LOCATION=s3://your-bucket/athena-results/
```

### 3. Start Application
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔑 AWS Permissions Required

Attach this IAM policy to your AWS user/role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "athena:StartQueryExecution",
        "athena:GetQueryExecution",
        "athena:GetQueryResults",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents",
        "logs:FilterLogEvents",
        "securityhub:GetFindings",
        "securityhub:GetComplianceSummary",
        "ec2:DescribeFlowLogs",
        "bedrock:InvokeModel",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 🐳 MongoDB Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker logs -f naias-mongodb

# Connect
docker exec -it naias-mongodb mongosh -u admin:admin123@localhost
```

---

## 📖 Full Documentation

Read [SETUP.md](SETUP.md) for complete information on:
- AWS services integration
- Why each service is used
- Real-world investigation examples
- Troubleshooting

---

## ✅ Check Everything Works

```bash
# 1. MongoDB running?
docker ps | grep naias-mongodb

# 2. App running?
curl http://localhost:3000

# 3. Database accessible?
docker exec -it naias-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
use naias
show collections
```

Done! 🎉
