# NAIAS Quick Start Guide

## What is NAIAS?

NAIAS (Network AI Autonomous System) is an AI-powered platform for infrastructure teams to investigate incidents, analyze root causes, and troubleshoot payment systems - all in minutes, not hours.

## Getting Started (5 minutes)

### 1. Install & Run
```bash
# Clone or download the project
cd naias

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### 2. Explore the Dashboard
```
http://localhost:3000/dashboard
```

You'll see:
- KPI cards (active investigations, completion rate)
- Recent investigations list
- Quick-start buttons to all features

### 3. Create First Investigation
```
Dashboard → "New Investigation" button
```

Fill in:
- **Title**: e.g., "Payment API Timeout"
- **Description**: What happened
- **Type**: incident / audit / performance / security / change
- **Severity**: critical / high / medium / low
- **Time Window**: When it happened
- **Resource Filters**: (optional) What resources were affected

### 4. Execute Investigation
```
Investigation Detail → "Execute" button
```

Watch the 6-step execution:
1. Load Investigation
2. Generate AI Queries
3. Execute Athena
4. Fetch CloudWatch
5. Analyze Results
6. Generate RCA

Takes ~12 seconds (simulated demo)

### 5. Review RCA Results
```
RCA Analysis page
```

See:
- Root cause explanation (AI-generated)
- Confidence score (0-100%)
- Evidence timeline with linked logs
- Remediation steps (prioritized)
- Alternative causes

## 10 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard` | Overview & metrics |
| Investigations | `/investigations` | List all investigations |
| Investigation Detail | `/investigations/[id]` | Full analysis view |
| Execute | `/investigations/[id]/execute` | Run investigation |
| RCA Analysis | `/rca-analysis` | Root cause analysis |
| Network Topology | `/network-topology` | Network visualization |
| Compliance | `/compliance` | Security audit |
| Transaction Tracer | `/transaction-tracer` | Payment debugging |
| Query Builder | `/query-builder` | Custom queries |
| Settings | `/settings` | Configuration |

## Common Workflows

### Investigation Workflow
```
1. Dashboard → New Investigation
2. Fill in incident details
3. Click "Create"
4. Click "Execute"
5. Wait for execution (12 seconds)
6. View RCA results
7. Follow remediation steps
```

### Payment Debugging Workflow
```
1. Transaction Tracer page
2. Enter transaction ID
3. View event timeline
4. Check service timings
5. Identify failure point
6. Review recommendations
7. Create investigation
```

### Network Debugging Workflow
```
1. Network Topology page
2. View network diagram
3. Monitor traffic metrics
4. Spot anomalies
5. Click node for details
6. Check connection status
```

### Compliance Check Workflow
```
1. Compliance page
2. Review score by framework
3. View findings list
4. Filter by severity
5. Check deadline
6. Track remediation
7. Generate report
```

## Mock Data

All pages have mock data pre-loaded for demo:

### Sample Investigation
- ID: 1
- Title: "Payment Processing API Timeout"
- Status: completed
- Severity: critical
- Confidence: 87%

### Sample Transaction
- ID: TXN-2024-02-21-001523
- Amount: $2500
- Status: failed
- Duration: 2.3s

### Sample Network Nodes
- Load Balancer (ELB)
- App Servers (EC2)
- Databases (RDS)
- Cache (ElastiCache)

## Component Gallery

### Buttons
```tsx
<Button>Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Badges
```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge className="bg-green-500/10 text-green-500">Success</Badge>
<Badge className="bg-destructive/10 text-destructive">Critical</Badge>
```

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Tabs
```tsx
<Tabs value="tab1" onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Styling Quick Tips

### Colors
```css
/* Primary action */
bg-primary text-primary

/* Status colors */
text-green-500     /* Success */
text-destructive   /* Critical/Error */
text-yellow-500    /* Warning */
text-blue-500      /* Info */

/* Backgrounds */
bg-card/50         /* Semi-transparent card */
bg-background      /* Main background */
bg-primary/10      /* Tinted background */
```

### Spacing
```css
/* Use Tailwind scale */
p-4         /* Padding */
m-4         /* Margin */
gap-4       /* Flex gap */
mt-2        /* Margin-top */
mb-4        /* Margin-bottom */
```

### Typography
```css
text-sm             /* Small text */
text-base           /* Normal text */
text-lg             /* Large text */
text-2xl            /* Heading size */
font-semibold       /* Bold */
font-mono           /* Code/technical */
text-muted-foreground    /* Dimmed text */
```

## Environment Setup

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host/db

# AWS (when implemented)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Organization
NEXT_PUBLIC_ORG_ID=demo-org
```

### Optional Variables
```bash
# Enable debug logging
DEBUG=naias:*

# API endpoints (if deploying elsewhere)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## File Locations

### Important Files
- Main dashboard: `app/dashboard/page.tsx`
- Investigations: `app/investigations/[id]/page.tsx`
- API routes: `app/api/investigations/route.ts`
- Types: `lib/types/investigations.ts`
- Styles: `app/globals.css`

### To Edit
- Styling: `tailwind.config.ts`, `app/globals.css`
- Types: `lib/types/`
- Pages: `app/*/page.tsx`
- Components: `components/ui/`

## Common Tasks

### Add New Page
```bash
# 1. Create directory
mkdir -p app/new-page

# 2. Create page.tsx
cat > app/new-page/page.tsx << 'EOF'
export default function Page() {
  return <div>New Page</div>
}
EOF

# 3. Add to navigation (in dashboard)
```

### Add New Component
```bash
# 1. Create component
cat > components/my-component.tsx << 'EOF'
export function MyComponent() {
  return <div>Component</div>
}
EOF

# 2. Import and use
import { MyComponent } from '@/components/my-component'
```

### Fetch Data
```typescript
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/investigations')
    .then(res => res.json())
    .then(setData)
}, []);
```

### Update Styling
```typescript
// Use classname utility
import { cn } from '@/lib/utils'

className={cn(
  'base-class',
  condition && 'conditional-class',
  variant === 'destructive' && 'destructive-class'
)}
```

## Troubleshooting

### Page not loading?
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Restart dev server
pnpm dev
```

### TypeScript errors?
```bash
# Check types
pnpm run type-check

# Fix types
npm install --save-dev typescript
```

### Styling not applied?
- Check `tailwind.config.ts` includes your files
- Verify classname is valid Tailwind
- Check for typos in class names

### API not working?
- Check network tab in DevTools
- Verify API route exists at `/api/...`
- Check console for errors

## Deployment Checklist

- [ ] Update environment variables
- [ ] Test all pages work
- [ ] Check mobile responsiveness
- [ ] Run type checking: `pnpm run type-check`
- [ ] Build production: `pnpm run build`
- [ ] Test production build locally
- [ ] Deploy to Vercel/server

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Recharts**: https://recharts.org

## Support

- **Issues**: Check GitHub issues
- **Docs**: Read README.md and IMPLEMENTATION.md
- **Examples**: Check `/examples` folder
- **Help**: Open discussion/issue

## Key Takeaways

1. **NAIAS is AI + Infrastructure**: AI-powered incident analysis
2. **5-Second Setup**: Just `pnpm install && pnpm dev`
3. **Demo Data Included**: No database setup needed to explore
4. **Production Ready**: Just add AWS services
5. **Extensible**: Easy to add new pages and features

---

**Next Step**: Visit http://localhost:3000 and explore!
