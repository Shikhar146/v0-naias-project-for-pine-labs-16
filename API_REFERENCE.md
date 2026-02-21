# NAIAS API Reference

## Base URL

```
https://your-domain.vercel.app/api
```

## Authentication

All requests require AWS IAM authentication. Include credentials in headers or environment variables.

---

## Investigation Endpoints

### Create Investigation

**POST** `/investigations`

Create a new investigation for incident analysis.

```json
{
  "title": "Payment Processor Timeout",
  "type": "incident",
  "severity": "critical",
  "description": "Payment transactions timing out between 14:30-14:45 UTC",
  "timeWindowStart": "2024-02-21T14:30:00Z",
  "timeWindowEnd": "2024-02-21T14:45:00Z",
  "dataSources": ["cloudwatch", "vpc_flows", "security_hub"],
  "resourceFilters": {
    "service": "payment-processor",
    "region": "us-east-1"
  }
}
```

**Response** (201):
```json
{
  "id": "inv-1234567890-abc123def",
  "status": "draft",
  "createdAt": "2024-02-21T14:50:00Z"
}
```

### List Investigations

**GET** `/investigations`

Retrieve investigations with optional filtering.

**Query Parameters:**
- `status`: draft, running, completed, failed, archived
- `severity`: critical, high, medium, low
- `type`: incident, audit, performance, security, change
- `skip`: Pagination offset (default: 0)
- `limit`: Results per page (default: 20)

**Response** (200):
```json
{
  "investigations": [
    {
      "id": "inv-1234567890-abc123def",
      "title": "Payment Processor Timeout",
      "type": "incident",
      "status": "completed",
      "severity": "critical",
      "createdAt": "2024-02-21T14:50:00Z"
    }
  ],
  "total": 42,
  "skip": 0,
  "limit": 20
}
```

### Get Investigation Details

**GET** `/investigations/[id]`

Retrieve detailed information about a specific investigation.

**Response** (200):
```json
{
  "id": "inv-1234567890-abc123def",
  "title": "Payment Processor Timeout",
  "type": "incident",
  "status": "completed",
  "severity": "critical",
  "description": "Payment transactions timing out",
  "timeWindowStart": "2024-02-21T14:30:00Z",
  "timeWindowEnd": "2024-02-21T14:45:00Z",
  "dataSources": ["cloudwatch", "vpc_flows"],
  "createdAt": "2024-02-21T14:50:00Z",
  "updatedAt": "2024-02-21T15:30:00Z"
}
```

### Update Investigation

**PUT** `/investigations/[id]`

Update an investigation.

```json
{
  "status": "running",
  "description": "Updated description"
}
```

### Delete Investigation

**DELETE** `/investigations/[id]`

Archive an investigation (soft delete).

---

## RCA Analysis Endpoints

### Get RCA Results

**GET** `/investigations/[id]/rca`

Retrieve AI-generated root cause analysis.

**Response** (200):
```json
{
  "id": "rca-inv-1234567890",
  "investigationId": "inv-1234567890-abc123def",
  "rootCauseDescription": "NAT Gateway connection limit exceeded",
  "confidenceScore": 0.92,
  "evidenceLinks": [
    {
      "eventId": "evt-001",
      "timestamp": "2024-02-21T14:32:15Z",
      "type": "vpc_flow_log",
      "description": "Connection refused to NAT Gateway"
    }
  ],
  "remediationSteps": [
    {
      "priority": "immediate",
      "step": "Scale NAT Gateway to multiple AZs",
      "estimatedTime": "5-10 minutes"
    }
  ]
}
```

---

## AI Query Generation Endpoints

### Generate Query from Natural Language

**POST** `/ai/generate-query`

Generate SQL query from natural language description.

```json
{
  "description": "Find all failed payment transactions in the last hour",
  "dataSources": ["athena"],
  "context": {
    "timeWindow": "1h",
    "region": "us-east-1"
  }
}
```

**Response** (200):
```json
{
  "query": "SELECT * FROM payment_logs WHERE status='failed' AND timestamp > NOW() - INTERVAL '1 hour'",
  "dataSource": "athena",
  "explanation": "Query retrieves all payment transactions with failed status from the last hour",
  "confidence": 0.95
}
```

---

## AWS Service Integration Endpoints

### Execute Athena Query

**POST** `/aws/athena/execute`

Execute a SQL query on Athena.

```json
{
  "query": "SELECT * FROM vpc_flow_logs LIMIT 100",
  "outputLocation": "s3://my-bucket/athena-results/",
  "database": "default"
}
```

**Response** (200):
```json
{
  "executionId": "arn:aws:athena:us-east-1:123456789012:workgroup/primary/execution/...",
  "status": "QUEUED",
  "estimatedCost": 0.05,
  "createdAt": "2024-02-21T14:50:00Z"
}
```

### Get CloudWatch Logs

**POST** `/aws/cloudwatch/logs`

Fetch logs from CloudWatch.

```json
{
  "logGroupName": "/aws/ecs/payment-service",
  "startTime": "2024-02-21T14:30:00Z",
  "endTime": "2024-02-21T14:45:00Z",
  "filterPattern": "[...]"
}
```

**Response** (200):
```json
{
  "logGroupName": "/aws/ecs/payment-service",
  "logEvents": [
    {
      "timestamp": 1708520400000,
      "message": "[ERROR] Connection timeout after 30000ms",
      "logStream": "api-server-prod-01"
    }
  ],
  "statistics": {
    "totalEvents": 1543,
    "errorCount": 234
  }
}
```

### Get VPC Flow Logs

**POST** `/aws/vpc-flows`

Query VPC Flow Logs for network traffic analysis.

```json
{
  "startTime": "2024-02-21T14:30:00Z",
  "endTime": "2024-02-21T14:45:00Z",
  "sourceIp": "10.0.1.15",
  "destinationIp": null
}
```

**Response** (200):
```json
{
  "flowLogs": [
    {
      "srcAddr": "10.0.1.15",
      "dstAddr": "52.84.92.45",
      "srcPort": 54321,
      "dstPort": 443,
      "protocol": "6",
      "action": "ACCEPT",
      "bytes": 128340,
      "packets": 245
    }
  ],
  "statistics": {
    "totalFlows": 1234,
    "acceptedFlows": 1200,
    "rejectedFlows": 34
  }
}
```

### Get Security Hub Findings

**POST** `/aws/security-hub/findings`

Retrieve security findings from AWS Security Hub.

```json
{
  "startTime": "2024-02-21T14:30:00Z",
  "endTime": "2024-02-21T14:45:00Z",
  "severityFilter": ["CRITICAL", "HIGH"],
  "complianceFramework": "PCI-DSS"
}
```

**Response** (200):
```json
{
  "findings": [
    {
      "id": "finding-001",
      "title": "Unencrypted RDS Database",
      "severity": "HIGH",
      "status": "NOTIFIED",
      "complianceFramework": "PCI-DSS-3.4"
    }
  ],
  "statistics": {
    "totalFindings": 42,
    "critical": 3,
    "high": 12
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request parameters",
  "details": {
    "field": "timeWindowStart",
    "message": "Must be valid ISO 8601 timestamp"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required",
  "message": "Missing or invalid AWS credentials"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions",
  "message": "Your IAM role lacks permission for this action"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "requestId": "uuid-here-for-tracking"
}
```

---

## Rate Limiting

- Standard tier: 100 requests per minute
- Premium tier: 1000 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1708520460
```

---

## Pagination

Endpoints that return lists support pagination via query parameters:

```
?skip=0&limit=20
```

Response includes:
```json
{
  "data": [],
  "total": 500,
  "skip": 0,
  "limit": 20,
  "hasMore": true
}
```

---

## Webhooks

### Incident Alert Webhook

**POST** `/webhooks/incident-alert`

Receive webhook notifications for critical incidents.

```json
{
  "event": "incident_created",
  "timestamp": "2024-02-21T14:50:00Z",
  "investigation": {
    "id": "inv-1234567890-abc123def",
    "title": "Critical Alert",
    "severity": "critical"
  }
}
```
