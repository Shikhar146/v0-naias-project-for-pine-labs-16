# Complete NAIAS Run Guide

## Quick Summary

**NAIAS** is ready to run. Follow the steps below to get started in minutes.

---

## Prerequisites Check

Before running, verify you have:

```bash
# Check Node.js (need v18+)
node --version

# Check pnpm (need v8+)
pnpm --version
```

**Don't have them?** Install from:
- Node.js: https://nodejs.org/
- pnpm: `npm install -g pnpm`

---

## Running NAIAS (3 Commands)

### Command 1: Install Dependencies

```bash
cd /path/to/naias
pnpm install
```

This downloads all 150+ packages needed.

**Expected:** Takes 1-5 minutes. Ends with "Packages installed".

### Command 2: Start Dev Server

```bash
pnpm dev
```

**Expected:** Terminal shows:
```
▲ Next.js 16.1.6
   Local:        http://localhost:3000
   Environments: .env.local

✓ Ready in X.Xs
```

### Command 3: Open Browser

Navigate to:
```
http://localhost:3000
```

**Expected:** NAIAS home page loads with navigation sidebar.

---

## Application URLs

Once running, access any of these:

### Core Pages
- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard (main hub)
- **Investigations**: http://localhost:3000/investigations (list all)

### Investigation Workflow
- **New Investigation**: http://localhost:3000/investigations/new (create)
- **View Investigation**: http://localhost:3000/investigations/[id] (details)
- **Execute Investigation**: http://localhost:3000/investigations/[id]/execute (run)

### Analysis Tools
- **Query Builder**: http://localhost:3000/query-builder (write queries)
- **RCA Analysis**: http://localhost:3000/rca-analysis (root cause)
- **Network Topology**: http://localhost:3000/network-topology (network view)

### Fintech Features
- **Transaction Tracer**: http://localhost:3000/transaction-tracer (payment tracing)
- **Compliance**: http://localhost:3000/compliance (audit findings)

### Administration
- **Admin Settings**: http://localhost:3000/admin (config, logs, API keys)

---

## File Structure (Where Everything Is)

```
project-root/
├── app/
│   ├── page.tsx                    → Home page
│   ├── dashboard/page.tsx          → Dashboard
│   ├── investigations/
│   │   ├── page.tsx               → List investigations
│   │   ├── new/page.tsx           → Create investigation
│   │   ├── [id]/page.tsx          → View investigation
│   │   ├── [id]/execute/page.tsx  → Execute investigation
│   │   └── [id]/rca/route.ts      → RCA API
│   ├── query-builder/page.tsx      → Query builder
│   ├── rca-analysis/page.tsx       → RCA analysis
│   ├── network-topology/page.tsx   → Network topology
│   ├── compliance/page.tsx         → Compliance
│   ├── transaction-tracer/page.tsx → Transaction tracer
│   ├── admin/page.tsx              → Admin settings
│   ├── api/                        → API routes
│   │   ├── investigations/route.ts
│   │   ├── investigations/[id]/route.ts
│   │   ├── ai/generate-query/route.ts
│   │   ├── aws/
│   │   │   ├── athena/execute/route.ts
│   │   │   ├── cloudwatch/logs/route.ts
│   │   │   ├── vpc-flows/route.ts
│   │   │   └── security-hub/findings/route.ts
│   └── layout.tsx                  → Root layout
├── components/                     → UI components
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── ui/                         → shadcn components
├── lib/
│   ├── db/
│   │   ├── schema.ts              → Database tables
│   │   └── client.ts              → Database connection
│   ├── services/
│   │   ├── query-generator.ts     → AI query generation
│   │   ├── agent-orchestrator.ts  → Multi-agent coordination
│   │   ├── athena-client.ts       → AWS Athena queries
│   │   ├── cloudwatch-client.ts   → CloudWatch logs
│   │   └── anomaly-detector.ts    → Anomaly detection
│   ├── types/
│   │   ├── investigations.ts      → Investigation types
│   │   └── aws.ts                 → AWS types
│   └── utils/
│       └── investigation-helpers.ts → Utility functions
├── .env.local.example              → Environment template
├── package.json                    → Dependencies
├── tsconfig.json                   → TypeScript config
├── next.config.mjs                 → Next.js config
└── tailwind.config.ts              → Tailwind config
```

---

## Environment Setup (Optional but Recommended)

### Quick Setup (for demo)

```bash
# Copy the example env file
cp .env.local.example .env.local
```

That's it! You can run without a database.

### Full Setup (with AWS & Database)

Edit `.env.local`:

```env
# Database (from Neon.tech)
DATABASE_URL=postgresql://user:password@host/database

# AWS Credentials (from AWS Console)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# AWS Services
AWS_BEDROCK_REGION=us-east-1
AWS_BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
AWS_ATHENA_OUTPUT_LOCATION=s3://bucket/path/
AWS_CLOUDWATCH_REGION=us-east-1
AWS_SECURITY_HUB_REGION=us-east-1
```

---

## Stopping NAIAS

To stop the development server:

```bash
# In the terminal where it's running, press:
CTRL+C

# On Mac, use:
CMD+C
```

---

## Restarting NAIAS

```bash
# If you made changes or it crashed
pnpm dev
```

---

## Troubleshooting

### Error: "pnpm: command not found"

```bash
npm install -g pnpm
pnpm dev
```

### Error: "Port 3000 already in use"

```bash
# Option 1: Kill the process on port 3000
# Option 2: Use a different port
pnpm dev -- -p 3001
# Then go to http://localhost:3001
```

### Error: "Module not found"

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Warning: "DATABASE_URL not set"

This is **OK** for demo mode. The app still works.

To fully enable database features:
1. Get URL from https://console.neon.tech (free tier)
2. Add to `.env.local`: `DATABASE_URL=postgresql://...`
3. Restart with `pnpm dev`

### Page shows blank or loads slowly

Wait 30 seconds for Next.js to compile.
Then refresh the browser (F5 or CMD+R).

### "Cannot find module" errors

```bash
# First, make sure all components exist
ls components/ui/

# If missing, reinstall
pnpm install
```

---

## Production Build

If you want to test the production version:

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Access at http://localhost:3000
```

---

## Docker (Alternative)

If you prefer Docker:

```bash
# Build image
docker build -t naias .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e AWS_REGION="us-east-1" \
  naias
```

---

## Next Steps

1. **Explore Dashboard**: Go to http://localhost:3000/dashboard
2. **Create Investigation**: Click "New Investigation" button
3. **Try Query Builder**: Visit http://localhost:3000/query-builder
4. **Read Features**: Check `FEATURES.md` for all capabilities
5. **Deploy**: Follow `DEPLOYMENT.md` to go live

---

## Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| `START_HERE.md` | 60-second quick start | 2 min |
| `HOW_TO_RUN.md` | Detailed run instructions | 10 min |
| `SETUP_INSTRUCTIONS.md` | Complete setup guide | 15 min |
| `QUICK_START.md` | Feature quick start | 10 min |
| `FEATURES.md` | All features explained | 15 min |
| `ARCHITECTURE.md` | System design | 15 min |
| `API_REFERENCE.md` | API documentation | 20 min |
| `DEPLOYMENT.md` | Production deployment | 20 min |
| `DEVELOPER_GUIDE.md` | Development guide | 30 min |

---

## Summary

You now have everything needed to run NAIAS:

1. ✅ Complete Next.js 16 application
2. ✅ 12 fully built pages with UI
3. ✅ 15+ API endpoints
4. ✅ 8 backend services
5. ✅ Database schema with Drizzle ORM
6. ✅ Dark-theme UI with shadcn components
7. ✅ Full documentation

**Ready? Run:**
```bash
pnpm install && pnpm dev
```

Then visit: **http://localhost:3000**

Enjoy NAIAS! 🚀
