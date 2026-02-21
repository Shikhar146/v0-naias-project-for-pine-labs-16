# NAIAS Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                    │
│  ┌────────────┬──────────────┬────────────┬─────────────┐  │
│  │ Dashboard  │ Investigations│  RCA       │  Network    │  │
│  │ Query Bldr │ Create/Detail │ Analysis   │  Topology   │  │
│  └────────────┴──────────────┴────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js API Routes)           │
│  ┌──────────────┬──────────────┬──────────────────────┐     │
│  │ Investigation│ AI Query Gen │ AWS Service Bridge  │     │
│  │ Management   │ (Bedrock)    │ (Athena, etc)       │     │
│  └──────────────┴──────────────┴──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
          ↕                      ↕                    ↕
    ┌──────────────┐      ┌────────────────┐   ┌──────────────┐
    │  PostgreSQL  │      │ AWS Bedrock    │   │ AWS Services │
    │  (Neon)      │      │ (Claude 3.5)   │   │              │
    └──────────────┘      └────────────────┘   └──────────────┘
                                                  ├─ Athena
                                                  ├─ CloudWatch
                                                  ├─ VPC Flows
                                                  ├─ Security Hub
                                                  └─ OpenSearch
```

## Component Breakdown

### Frontend Components

#### Core Pages
- **Dashboard** (`/dashboard`) - Real-time incident overview
- **Investigations** (`/investigations`) - Investigation management hub
- **Query Builder** (`/query-builder`) - AI-assisted SQL query creation
- **RCA Analysis** (`/rca-analysis`) - Root cause analysis viewer
- **Network Topology** (`/network-topology`) - Network visualization
- **Compliance** (`/compliance`) - Security findings dashboard
- **Transaction Tracer** (`/transaction-tracer`) - Fintech-specific tracing
- **Admin Settings** (`/admin`) - Configuration management

#### Reusable Components
- `Sidebar.tsx` - Navigation sidebar
- `Header.tsx` - Top navigation bar
- `LayoutWrapper.tsx` - Standard page layout
- Form components (input, textarea, select, etc.)
- Data visualization components (charts, timelines)

### Backend Services

#### Service Layer (`/lib/services/`)

1. **query-generator.ts** - Natural language to SQL translation
   - Takes incident context
   - Calls Claude via Bedrock
   - Returns validated Athena SQL

2. **agent-orchestrator.ts** - Multi-agent workflow coordinator
   - Manages data fetching, analysis, correlation
   - Generates RCA with evidence
   - Suggests remediation steps

3. **athena-client.ts** - Athena query execution
   - Submits queries to Athena
   - Tracks execution progress
   - Estimates query costs

4. **cloudwatch-client.ts** - CloudWatch Logs integration
   - Fetches logs by group/stream
   - Supports filtering and pagination
   - Parses structured logs

5. **vpc-flows-processor.ts** - VPC Flow Logs analysis
   - Queries flow logs from S3/CloudWatch
   - Builds network connectivity graph
   - Detects anomalies

6. **security-hub-client.ts** - Security findings integration
   - Retrieves findings by severity
   - Filters by compliance framework
   - Links to network events

7. **anomaly-detector.ts** - Anomaly detection engine
   - Traffic spike detection
   - Port scanning detection
   - Data exfiltration detection

8. **aws-credentials-manager.ts** - Credential lifecycle
   - Manages AWS IAM authentication
   - Integrates with AWS Kiro for rotation
   - Enforces least-privilege

### API Routes (`/app/api/`)

#### Investigation Management
- `POST /api/investigations` - Create investigation
- `GET /api/investigations` - List with filters
- `GET /api/investigations/[id]` - Get details
- `PUT /api/investigations/[id]` - Update
- `DELETE /api/investigations/[id]` - Archive

#### AI Services
- `POST /api/ai/generate-query` - Generate SQL from natural language
- `GET /api/ai/analyze-results` - Analyze query results
- `POST /api/ai/generate-recommendations` - Generate fixes

#### AWS Integration
- `POST /api/aws/athena/execute` - Execute queries
- `POST /api/aws/cloudwatch/logs` - Fetch logs
- `POST /api/aws/vpc-flows` - Query VPC flows
- `POST /api/aws/security-hub/findings` - Get findings

### Database Schema

#### investigations
- id, organization_id, title, description
- type, status, severity
- time_window_start, time_window_end
- created_by, created_at, updated_at

#### queries
- id, investigation_id, query_type
- query_text, generated_by_ai
- execution_status, execution_time_ms, cost_usd
- result_summary, created_at

#### rca_results
- id, investigation_id
- root_cause_description, confidence_score
- evidence_links (JSONB), remediation_steps (JSONB)
- created_at

#### events
- id, investigation_id, event_type
- source_service, timestamp, severity
- raw_data (JSONB), correlated_with

#### users
- id, email, aws_iam_user, organization_id
- role (admin, analyst, viewer)
- created_at, last_login

#### audit_logs
- id, user_id, action, resource_type, resource_id
- changes (JSONB), created_at

## Data Flow

### Investigation Workflow

```
1. User Creates Investigation
   ↓
2. System Validates Input
   ↓
3. Query Generator Creates SQL (via Claude)
   ↓
4. Athena Executes Query
   ↓
5. Results Collected from All Data Sources:
   - CloudWatch Logs
   - VPC Flow Logs
   - Security Hub Findings
   - Custom Metrics
   ↓
6. Event Correlation Engine Processes Results
   ↓
7. Anomaly Detector Identifies Patterns
   ↓
8. AI RCA Generator Creates Analysis
   ↓
9. Recommendation Engine Suggests Fixes
   ↓
10. Results Presented to User
```

## Technology Stack Details

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 18+
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Visualization**: Recharts, Custom SVG
- **HTTP Client**: Native fetch (built-in)
- **State Management**: React hooks + SWR

### Backend
- **Runtime**: Node.js 18+
- **API Framework**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **AI/LLM**: AWS Bedrock (Claude 3.5 Sonnet)
- **AWS SDK**: @aws-sdk/client-* packages

### AWS Services
- **Athena**: SQL query execution on S3
- **CloudWatch Logs**: Application and system logs
- **VPC Flow Logs**: Network traffic logs
- **Security Hub**: Security findings aggregation
- **Bedrock**: Foundation models API
- **OpenSearch**: Optional log search

### DevOps
- **Version Control**: Git (GitHub)
- **CI/CD**: Vercel auto-deploy
- **Hosting**: Vercel Functions + Edge Network
- **Monitoring**: CloudWatch + Vercel Analytics
- **Logging**: CloudWatch Logs

## Security Architecture

### Authentication & Authorization
```
AWS IAM Role/User
    ↓
Environment Variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    ↓
Next.js API Routes
    ↓
AWS SDK Auto-Signs Requests
```

### Data Protection
- Encryption in Transit: HTTPS/TLS
- Encryption at Rest: AWS native encryption
- Row-Level Security: PostgreSQL RLS policies
- Audit Logging: All actions tracked

### API Security
- Rate Limiting: 100 req/min (configurable)
- Input Validation: Zod schemas
- SQL Injection Prevention: Parameterized queries
- CORS: Properly configured

## Performance Optimization

### Frontend
- Image optimization via Next.js
- Code splitting and lazy loading
- Server-side rendering for SEO
- Real-time updates via WebSockets

### Backend
- Query result caching (in-memory + Redis)
- Database connection pooling
- API response compression (gzip)
- Efficient pagination

### AWS Services
- Athena query result caching
- CloudWatch Logs filtering at source
- Minimal data transfer (only needed fields)
- Batch processing where possible

## Scalability Considerations

### Horizontal Scaling
- Serverless architecture (auto-scales)
- PostgreSQL: Use Neon's auto-scaling
- Stateless API design

### Vertical Scaling
- Upgrade PostgreSQL tier
- Increase Athena concurrency
- More powerful Bedrock provisioned capacity

### Database
- Indexes on frequently queried columns
- Partitioning for large tables
- Archive old investigations

## Disaster Recovery

### Backup Strategy
- Automated PostgreSQL backups (Neon)
- Point-in-time recovery (7-30 days)
- Regular backup validation

### Failover
- Multi-region Vercel deployment possible
- Database read replicas (Neon)
- AWS service redundancy

## Monitoring & Observability

### Metrics
- Request latency (p50, p95, p99)
- Error rate and types
- Query execution time
- Cost per investigation

### Logging
- Application logs → CloudWatch
- API request/response logs
- Audit trail of all actions
- Error tracking (Sentry optional)

### Alerts
- High error rate (>5%)
- Query timeout (>300s)
- Database connection pool exhaustion
- Unauthorized access attempts

## Development Guidelines

### Code Organization
- Services: Business logic layer
- Components: Reusable UI elements
- Pages: Route handlers (RSC/Client)
- Types: TypeScript interfaces
- Utils: Helper functions
- Constants: Configuration values

### Error Handling
- Try/catch blocks for async operations
- User-friendly error messages
- Error logging for debugging
- Graceful degradation

### Testing
- Unit tests: Jest + React Testing Library
- Integration tests: API + Database
- E2E tests: Playwright
- Performance tests: Lighthouse

## Future Enhancements

1. **Real-time Alerts**: WebSocket streaming for live incidents
2. **Machine Learning**: Anomaly detection ML models
3. **Advanced Visualization**: 3D network topology
4. **Mobile App**: React Native mobile client
5. **CLI Tool**: Command-line interface for NAIAS
6. **Marketplace**: Integration templates for third-party tools
7. **Custom Rules Engine**: User-defined investigation triggers
8. **ITSM Integration**: ServiceNow, Jira, PagerDuty
