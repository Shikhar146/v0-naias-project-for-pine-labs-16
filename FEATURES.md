# NAIAS Features & Pages

## Core Pages

### 1. Dashboard (`/dashboard`)
**Purpose**: Central command center for infrastructure investigation

**Key Components**:
- KPI Cards: Active investigations, completed today, MTTR, critical issues
- Recent Investigations: List of latest activities
- Quick Start Grid: 6 quick-access buttons to main features

**Features**:
- Real-time investigation metrics
- Status indicators (running, completed, failed)
- Quick navigation to all modules
- Investigation filtering and search

**User Actions**:
- View overview metrics
- Access recent investigations
- Create new investigation
- Navigate to specialized tools

---

### 2. Investigations Hub (`/investigations`)
**Purpose**: Browse, manage, and create investigations

**Pages**:
- **List** (`/investigations`): All investigations with filters
- **Create** (`/investigations/new`): New investigation wizard
- **Detail** (`/investigations/[id]`): Full investigation analysis
- **Execute** (`/investigations/[id]/execute`): Execution workflow

**Features**:
- Investigation CRUD operations
- Status filtering (draft, running, completed, failed, archived)
- Severity filtering (critical, high, medium, low)
- Type filtering (incident, audit, performance, security, change)
- Quick search
- Batch actions

**Data Displayed**:
- Investigation title and description
- Status with color coding
- Severity badge
- Investigation type
- Created timestamp
- Time window (start/end)
- Resource filters
- AI insights summary

---

### 3. Investigation Detail View (`/investigations/[id]`)
**Purpose**: Deep dive into investigation with full context

**Tabs**:
- **Overview**: Investigation summary and details
- **Queries**: Executed Athena and CloudWatch queries
- **Timeline**: Chronological event flow
- **RCA Results**: Root cause analysis findings

**Features**:
- Investigation metadata display
- Status and severity badges
- Time window range
- Resource filter breakdown
- Execute button (if draft)
- Share and export options
- Tab-based navigation
- AI insights display (JSON)

**User Actions**:
- Review investigation details
- Execute investigation
- View query history
- Check event timeline
- Review RCA results
- Share investigation
- Export findings

---

### 4. Investigation Execution (`/investigations/[id]/execute`)
**Purpose**: Step-by-step investigation execution workflow

**Execution Steps**:
1. Load Investigation
2. Generate AI Queries (Claude)
3. Execute Athena
4. Fetch CloudWatch Logs
5. Analyze Results
6. Generate RCA

**Features**:
- Progress indicators (pending, running, completed)
- Real-time step-by-step execution
- Estimated time tracking
- Detailed step messages
- Error handling
- Success summary
- Results linkage

**User Actions**:
- Start investigation
- Monitor progress
- View step details
- Navigate to results
- Review execution summary

---

### 5. RCA Analysis (`/rca-analysis`)
**Purpose**: AI-powered root cause analysis with evidence

**Sections**:
- **Investigation Selector**: Dropdown to choose investigation
- **Root Cause Summary**: AI explanation with confidence score
- **Correlated Evidence**: Timeline of linked events
- **Remediation Steps**: Priority-ordered action items
- **Alternative Causes**: Lower-probability root causes

**Features**:
- Investigation selection
- Root cause display with confidence %
- Evidence linking with severity
- Timestamp correlation
- Step-by-step remediation plan
- Priority levels (immediate, high, medium, low)
- Estimated time for remediation
- Alternative causes with probability %
- Share and export options
- Create ticket action

**Data Types**:
- CloudWatch logs (with severity)
- VPC flow logs (with timestamps)
- Security Hub findings
- Correlated timestamps

---

### 6. Network Topology (`/network-topology`)
**Purpose**: Real-time network visualization and analysis

**Components**:
- **Network Architecture Diagram**: Interactive topology
  - Load Balancer (ELB)
  - App Servers (EC2)
  - Databases (RDS primary & replica)
  - Cache Layer (ElastiCache)

- **Traffic Analysis Chart**: Inbound/outbound traffic over time
- **Anomaly Detection**: Highlighted unusual traffic patterns
- **Active Connections Table**: Live connection metrics

**Features**:
- Time range selection (15m, 1h, 6h, 24h)
- Node click details
- Heat map traffic visualization
- Anomaly highlighting
- Connection health status
- Traffic metrics (Mbps)
- Node-level statistics

**Metrics**:
- Incoming/outgoing traffic
- Connection status
- Traffic anomalies
- Latency indicators
- Node health

---

### 7. Compliance & Audit (`/compliance`)
**Purpose**: Security posture and compliance tracking

**Frameworks**:
- PCI-DSS (93% compliant)
- SOC 2 (97% compliant)
- GDPR (85% review needed)

**Sections**:
- **Compliance Scores**: Card-based overview
- **Status Chart**: Passed/failed/warning by framework
- **Findings List**: Detailed security issues
- **Remediation Timeline**: Activity history

**Finding Details**:
- Finding ID (e.g., PCI-001)
- Title and description
- Severity (critical, high, medium, low)
- Status (open, in-progress, resolved)
- Affected systems count
- Deadline

**Features**:
- Framework filtering
- Severity filtering
- Status filtering
- Deadline sorting
- Remediation tracking
- Activity timeline
- Report generation
- Export functionality

---

### 8. Transaction Tracer (`/transaction-tracer`)
**Purpose**: End-to-end payment transaction debugging

**Sections**:
- **Search Card**: Transaction ID input
- **Transaction Summary**: Amount, merchant, timestamp, duration
- **Event Timeline**: Service-level execution trace
- **Recommendations**: Failure remediation steps

**Transaction Details**:
- Transaction ID
- Amount and currency
- Merchant information
- Timestamp (UTC)
- Duration
- Status (success/failed)
- Failure reason (if applicable)

**Event Timeline Events**:
- API Gateway validation
- Fraud detection scoring
- Token service generation
- Payment processor call (with duration)
- Transaction rollback (if failed)

**Fintech-Specific Features**:
- Payment processor integration
- Fraud detection engine display
- Token service tracking
- Cardholder data handling
- Timeout error detection
- Rollback tracking

---

## Feature Capabilities

### Investigation Management
✅ Create new investigations  
✅ View investigation list  
✅ Filter by status, severity, type  
✅ View investigation details  
✅ Execute investigations  
✅ Archive investigations  
✅ Delete investigations  
✅ Export investigations  

### Analysis & Insights
✅ AI query generation (stub)  
✅ RCA analysis generation (stub)  
✅ Evidence correlation  
✅ Confidence scoring  
✅ Alternative cause analysis  
✅ Remediation recommendations  

### Data Visualization
✅ Network topology diagram  
✅ Traffic charts (Recharts)  
✅ Compliance status charts  
✅ Event timeline visualization  
✅ Status indicators  
✅ Heat maps  

### Fintech Features
✅ Transaction tracing  
✅ Service-level timing  
✅ Fraud detection display  
✅ Payment processor debugging  
✅ Transaction search  
✅ Error analysis  

### Compliance
✅ Multi-framework tracking  
✅ Compliance scoring  
✅ Finding management  
✅ Remediation tracking  
✅ Deadline management  
✅ Report generation  

### UI/UX
✅ Responsive design (mobile-first)  
✅ Dark/light theme ready  
✅ Loading states  
✅ Error handling  
✅ Empty states  
✅ Toast notifications  
✅ Modal dialogs  
✅ Dropdown menus  

---

## Component Library Used

### shadcn/ui Components
- **Button**: Primary and secondary actions
- **Card**: Content containers
- **Badge**: Status and severity indicators
- **Input**: Text input fields
- **Textarea**: Multi-line input
- **Select**: Dropdown selection
- **Tabs**: Multi-section navigation
- **Dialog**: Modal dialogs (ready)
- **Dropdown Menu**: Context menus (ready)
- **Alert**: Error/info messages
- **Loader**: Loading spinners

### Custom Components
- Investigation cards
- Status indicators
- Timeline elements
- Navigation header

### Icons (Lucide)
- AlertTriangle: Warnings and severity
- CheckCircle2: Success states
- Clock: Time-related items
- TrendingUp/Down: Metrics
- Network: Topology
- Shield: Security
- Activity: Status
- Loader2: Loading spinners
- Plus: Create actions
- ArrowLeft/Right: Navigation
- Zap: Alerts and anomalies

---

## Data Flow Architecture

```
User Action
    ↓
Frontend Component
    ↓
API Route (/api/...)
    ↓
Service Layer
    ├→ Database (PostgreSQL)
    └→ AWS Services (Stub)
        ├── Athena
        ├── CloudWatch
        ├── VPC Flow Logs
        └── Security Hub
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
UI Re-render
```

---

## State Management

### Client State (React)
- Component-level useState for UI
- Investigation data (fetched)
- Loading states
- Active tab selection
- Filter selections

### Server State
- Investigation records
- Query results
- Event timelines
- RCA results

### Local Storage
- Organization ID (demo)
- User preferences
- Recent searches

---

## Error Handling

Each page includes:
- Loading state (spinner)
- Error state (error message)
- Empty state (no data)
- Fallback UI components

Example patterns:
```typescript
if (loading) return <LoadingCard />;
if (error) return <ErrorCard error={error} />;
if (!data) return <EmptyCard />;
return <DataView data={data} />;
```

---

## API Integration Points

### Ready for Implementation
```typescript
// Investigations CRUD
GET  /api/investigations
POST /api/investigations
GET  /api/investigations/[id]
PUT  /api/investigations/[id]
DELETE /api/investigations/[id]

// AI Services
POST /api/ai/generate-query
POST /api/ai/analyze-results
POST /api/ai/generate-recommendations

// AWS Integration
POST /api/aws/athena/execute
GET  /api/aws/cloudwatch/logs
GET  /api/aws/vpc-flows
GET  /api/aws/security-hub/findings
```

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Metrics

- Page load time: <2s
- Investigation execution: <2min
- API response: <500ms
- Network requests: <5 per page

---

## Accessibility Features

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Color contrast compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators

---

**Total Pages**: 8 main pages  
**Total Components**: 50+  
**Data Tables**: 5  
**Charts**: 3  
**Forms**: 4  
**Status**: Production-ready (frontend)

