# NAIAS - Infrastructure Investigation Platform for Pine Labs

## 🎯 Overview

**NAIAS** is a fintech infrastructure investigation and troubleshooting platform built for Pine Labs to analyze payment processing issues, network anomalies, and infrastructure problems using AWS services and AI-powered analysis.

**Purpose**: Fast incident diagnosis and root cause analysis across AWS infrastructure without manual log searching.

---

## 🤔 Why This Platform?

### Problems It Solves
- **Slow Incident Response**: Manual log searching takes hours
- **Limited Visibility**: No unified view across multiple AWS services
- **Complex Root Cause Analysis**: Hard to connect logs, metrics, and events
- **Repetitive Troubleshooting**: Same issues investigated manually multiple times

### Key Benefits
- ✅ Reduce MTTR (Mean Time To Resolution) from hours to minutes
- ✅ Single unified interface for all AWS services
- ✅ AI-powered pattern detection and insights
- ✅ Multi-user collaboration on investigations
- ✅ Historical investigation records for compliance

---

## 🏗️ Architecture

**Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS  
**Backend**: Next.js API Routes + Node.js  
**Database**: MongoDB (persistent storage)  
**AI**: AWS Bedrock (Claude 3.5 Sonnet)  
**Cloud**: AWS Services Integration  

---

## 🔌 AWS Services Integration

### Why These 5 AWS Services?

#### 1. **AWS Athena** - SQL Query Engine
**What**: Serverless SQL engine for querying data in S3  
**Why Used**: Analyze VPC Flow Logs, CloudTrail, application logs without servers  
**Use Case**: Infrastructure team runs SQL to find which EC2 instances caused a bottleneck  

**IAM Permission Required**:
```json
{
  "Effect": "Allow",
  "Action": ["athena:StartQueryExecution", "athena:GetQueryExecution", "athena:GetQueryResults"],
  "Resource": "*"
}
```

**Example Investigation**:
```sql
SELECT * FROM vpc_flow_logs 
WHERE dstaddr = '10.0.1.45' AND action = 'REJECT' 
LIMIT 1000
```

---

#### 2. **AWS CloudWatch Logs** - Centralized Logging
**What**: Unified log aggregation for all AWS services  
**Why Used**: Real-time application logs, API Gateway logs, Lambda errors  
**Use Case**: Debug why payments are timing out by searching application logs for errors  

**IAM Permission Required**:
```json
{
  "Effect": "Allow",
  "Action": ["logs:DescribeLogGroups", "logs:DescribeLogStreams", "logs:GetLogEvents", "logs:FilterLogEvents"],
  "Resource": "arn:aws:logs:*:*:*"
}
```

**Example Investigation**:
```
/aws/lambda/payment-processor
Search: "timeout" or "error"
Time Range: Last 1 hour
```

---

#### 3. **AWS Security Hub** - Security Findings Aggregation
**What**: Centralized security and compliance dashboard  
**Why Used**: Aggregates findings from Config, GuardDuty, Inspector, IAM Access Analyzer  
**Use Case**: Check if a security misconfiguration caused the incident  

**IAM Permission Required**:
```json
{
  "Effect": "Allow",
  "Action": ["securityhub:GetFindings", "securityhub:GetComplianceSummary"],
  "Resource": "*"
}
```

**Example Investigation**:
```
Find all CRITICAL findings in us-east-1
Filter by: Unencrypted RDS database
Result: Found 3 unencrypted databases potentially causing data leak
```

---

#### 4. **VPC Flow Logs** - Network Traffic Analysis
**What**: Network traffic logs for all EC2 network interfaces  
**Why Used**: Identify network bottlenecks, blocked connections, unusual traffic patterns  
**Use Case**: Trace why database connection pools are exhausted  

**IAM Permission Required**:
```json
{
  "Effect": "Allow",
  "Action": ["ec2:DescribeFlowLogs", "s3:GetObject", "logs:FilterLogEvents"],
  "Resource": "*"
}
```

**Example Investigation**:
```
Source: payment-api (10.0.1.50)
Destination: database (10.0.2.100)
Find: REJECT actions in last 30 minutes
Result: 2500 rejected connections → database connection pool full
```

---

#### 5. **AWS Bedrock** - AI/LLM for Analysis
**What**: Serverless API to Claude 3.5 Sonnet LLM  
**Why Used**: Analyze logs and generate insights without ML infrastructure  
**Use Case**: Input investigation data → AI generates root cause analysis  

**IAM Permission Required**:
```json
{
  "Effect": "Allow",
  "Action": ["bedrock:InvokeModel"],
  "Resource": "arn:aws:bedrock:*:*:foundation-model/anthropic.claude-3-5-sonnet*"
}
```

**Example AI Analysis**:
```
Input: 
- VPC Flow Logs: 2500 rejected connections to database
- CloudWatch: "Connection pool exhausted"
- Database Metrics: 100/100 connections in use

Output (AI Generated):
Root Cause: Database connection pool exhaustion
Confidence: 98%
Recommendation: Increase pool from 100 to 200 connections
```

---

## 💾 MongoDB Database Structure

All investigations, queries, and results stored in MongoDB collections:

| Collection | Purpose | Why |
|-----------|---------|-----|
| `investigations` | Investigation records | Track all past investigations for compliance |
| `queries` | AWS queries executed | Audit trail of what data was queried |
| `timelines` | Event timelines | Chronological view of all events |
| `users` | User accounts | Multi-user collaboration |
| `organizations` | Organization settings | Multi-tenant support |
| `sessions` | User sessions | Track active users |

---

## 🚀 Quick Start

### 1. Start MongoDB
```bash
docker-compose up -d
```

### 2. Configure AWS (`.env.local`)
```env
# MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/naias?authSource=admin
MONGODB_DB=naias

# AWS Credentials - REQUIRED for AWS service integration
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1

# AWS Athena - For SQL queries
ATHENA_DATABASE=default
ATHENA_OUTPUT_LOCATION=s3://your-bucket/athena-results/

# AWS Account
AWS_ACCOUNT_ID=123456789012
```

### 3. Start Application
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📊 Investigation Workflow

```
1. Dashboard
   ↓
2. Create Investigation (define time window, filters)
   ↓
3. Execute (fetch data from AWS Athena, CloudWatch, VPC Logs)
   ↓
4. AI Analysis (Bedrock generates RCA)
   ↓
5. View Results (timeline, insights, recommendations)
   ↓
6. Export/Share for team review
   ↓
7. Resolved!
```

---

## 🔐 AWS IAM Permissions Required

Combine all these permissions into a single IAM policy:

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

Attach this policy to the IAM user/role running NAIAS.

---

## 🗄️ MongoDB Setup

### Start MongoDB
```bash
docker-compose up -d
```

### Connect to MongoDB
```bash
docker exec -it naias-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### View Investigations
```javascript
use naias
db.investigations.find().pretty()
```

### Check Storage
```javascript
db.investigations.stats()
db.stats()
```

---

## 🎯 Features

### Dashboard
- Overview of all investigations
- Recent activity
- Investigation status breakdown

### Investigations
- **Create**: Define investigation with time window and filters
- **Execute**: Fetch data from AWS services
- **View**: See results, timeline, AI insights
- **Delete**: Soft-delete investigations (recoverable)
- **Export**: JSON export for sharing

### Query Builder
- Build custom AWS Athena queries
- CloudWatch log filtering
- Real-time query results

### Network Topology
- Visual AWS network diagram
- EC2, RDS, Load Balancer connections
- Traffic analysis

### RCA Analysis
- AI-powered root cause analysis
- Confidence scoring
- Remediation recommendations

### Compliance
- Security Hub findings
- Compliance status dashboard
- Audit logs

---

## 🔍 Real-World Example

### Scenario: "Payments Timing Out"

**Investigation Steps**:

1. **Create Investigation**
   - Time Window: Last 1 hour
   - Filter: Payment processing service

2. **Execute**
   - NAIAS queries VPC Flow Logs → finds 2500 rejected DB connections
   - NAIAS queries CloudWatch → finds "Connection pool exhausted" errors
   - NAIAS queries Security Hub → no security issues

3. **AI Analysis** (Bedrock)
   - Analyzes all data
   - Generates: "Root Cause: Database connection pool exhaustion"
   - Recommends: "Increase connection pool from 100 to 200"

4. **Result**
   - Team implements fix
   - Problem solved in 10 minutes
   - vs. Manual troubleshooting: 2-4 hours

---

## 📝 File Structure

```
app/
├── api/
│   ├── investigations/
│   │   ├── route.ts              (GET/POST)
│   │   └── [id]/route.ts         (GET/PUT/DELETE)
│   └── aws/                      (AWS integrations)
├── dashboard/page.tsx            (Home page)
├── investigations/page.tsx       (List all)
├── investigations/new/page.tsx   (Create)
└── investigations/[id]/page.tsx  (Detail)

lib/
├── db/
│   ├── client.ts                 (MongoDB connection)
│   ├── models.ts                 (Data types)
│   └── init.ts                   (Initialize DB)
├── services/
│   ├── athena-client.ts          (AWS Athena)
│   ├── cloudwatch-client.ts      (CloudWatch)
│   └── agent-orchestrator.ts     (AI RCA)
└── types/
    └── investigations.ts         (TypeScript types)

docker-compose.yml               (MongoDB Docker)
.env.local                        (Configuration)
```

---

## 🔧 Environment Configuration

Create `.env.local`:

```env
# MONGODB - REQUIRED
MONGODB_URI=mongodb://admin:admin123@localhost:27017/naias?authSource=admin
MONGODB_DB=naias

# AWS CREDENTIALS - REQUIRED for AWS integration
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# AWS ATHENA - REQUIRED for SQL queries
ATHENA_DATABASE=default
ATHENA_OUTPUT_LOCATION=s3://your-bucket/athena-results/

# AWS BEDROCK - For AI analysis
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | `docker-compose ps` and `docker logs naias-mongodb` |
| AWS authentication error | Verify credentials in `.env.local` |
| Investigations not loading | Check: `db.investigations.find()` in MongoDB |
| AI analysis not working | Verify Bedrock IAM permissions and model ID |
| Queries returning no data | Ensure Athena database and S3 bucket configured correctly |

---

## 📞 Support

1. Check MongoDB: `docker logs naias-mongodb`
2. Check app logs: `npm run dev` output
3. Verify `.env.local` has all required variables
4. Ensure AWS IAM policy is attached
5. Check AWS service quotas

---

## 📄 License

Proprietary - Pine Labs

---

**Version**: 1.0.0  
**Last Updated**: February 22, 2026  
**Platform**: NAIAS - Infrastructure Investigation Platform
