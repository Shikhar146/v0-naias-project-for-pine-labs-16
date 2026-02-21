# NAIAS Setup & Run Instructions

## Quick Summary
NAIAS is a Next.js 16 application that requires:
1. Node.js and pnpm installed
2. Environment variables configured (DATABASE_URL, AWS credentials)
3. Dependencies installed
4. Development server started

---

## Step 1: Prerequisites

### Install Node.js & pnpm
```bash
# Check if you have Node.js 18+ installed
node --version

# Install pnpm (if not already installed)
npm install -g pnpm

# Verify pnpm is installed
pnpm --version
```

---

## Step 2: Install Dependencies

```bash
# Navigate to project directory
cd /path/to/naias

# Install all dependencies
pnpm install

# This will install ~150+ packages including:
# - Next.js 16, React 19
# - AWS SDKs (Athena, Bedrock, CloudWatch, etc.)
# - Drizzle ORM for database
# - shadcn/ui components
# - Tailwind CSS v4
```

**Expected Output:**
```
✓ Packages installed
✓ 150+ dependencies resolved
✓ Ready to run
```

---

## Step 3: Configure Environment Variables

### Option A: Quick Development Setup (No Database Required)

Create `.env.local` file in project root:

```bash
# Create the file
touch .env.local
```

Add to `.env.local`:
```
# Database - Optional for demo (can skip for now)
# DATABASE_URL=postgresql://user:password@localhost:5432/naias

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Bedrock Model Configuration
AWS_BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
AWS_BEDROCK_REGION=us-east-1

# Athena Configuration
AWS_ATHENA_OUTPUT_LOCATION=s3://your-bucket/athena-results/

# CloudWatch Configuration
AWS_CLOUDWATCH_REGION=us-east-1

# Security Hub Configuration
AWS_SECURITY_HUB_REGION=us-east-1
```

### Option B: Full Setup with Database

1. **Create Neon PostgreSQL Database:**
   - Visit https://console.neon.tech
   - Create free account
   - Create new project
   - Copy connection string

2. **Add to `.env.local`:**
```
DATABASE_URL=postgresql://user:password@host/naias
```

---

## Step 4: Run the Development Server

```bash
# Start the dev server
pnpm dev

# Expected output:
# ▲ Next.js 16.1.6
# Local:        http://localhost:3000
# 
# ✓ Ready in 2.5s
```

### Access the Application

Open your browser and go to:
- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Investigations**: http://localhost:3000/investigations
- **Query Builder**: http://localhost:3000/query-builder
- **RCA Analysis**: http://localhost:3000/rca-analysis

---

## Step 5: First Time Use

### 1. View the Landing Page
```
http://localhost:3000
```
You'll see the NAIAS hero section with key features.

### 2. Visit the Dashboard
```
http://localhost:3000/dashboard
```
You'll see:
- KPI cards (showing 0 initially - this is normal)
- Recent investigations list (empty - create your first one)
- Quick start buttons to all features

### 3. Create a Demo Investigation
```
Dashboard → "New Investigation" button → Fill form
```

Example:
- Title: "Payment Processing Timeout"
- Type: "Incident"
- Severity: "High"
- Description: "API response slow for payment endpoints at 2024-02-21 14:30 UTC"
- Time Window: Select last 2 hours

### 4. View Investigation Details
Click on the investigation you created to see:
- Investigation details
- Linked queries
- Results and logs
- RCA findings (once executed)

---

## Common Issues & Fixes

### Issue: "DATABASE_URL is not set"

**Cause:** Environment variable not configured

**Fix:**
```bash
# Option 1: Create .env.local with DATABASE_URL
echo 'DATABASE_URL=postgresql://...' >> .env.local

# Option 2: Skip database for demo
# Remove the DATABASE_URL line if not needed for initial testing
```

### Issue: "Port 3000 already in use"

**Cause:** Another app is running on port 3000

**Fix:**
```bash
# Use a different port
pnpm dev -- -p 3001

# Then access at http://localhost:3001
```

### Issue: "Module not found" errors

**Cause:** Dependencies not fully installed

**Fix:**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "TypeScript compilation errors"

**Cause:** Type definitions missing

**Fix:**
```bash
# Rebuild TypeScript
pnpm dev

# Wait for compilation to complete
# Most errors resolve after initial build
```

### Issue: AWS credentials not working

**Cause:** Invalid or missing AWS credentials

**Fix:**
```bash
# Verify credentials in .env.local
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1

# Test AWS connectivity
# Go to /api/aws/health endpoint (if created)
```

---

## Alternative: Run with Docker

```bash
# Build Docker image
docker build -t naias .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e AWS_ACCESS_KEY_ID="..." \
  -e AWS_SECRET_ACCESS_KEY="..." \
  naias

# Access at http://localhost:3000
```

---

## Alternative: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# ✓ Link to existing project or create new
# ✓ Configure environment variables
# ✓ Deploy
```

---

## Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Application runs at http://localhost:3000
```

---

## Verification Checklist

After setup, verify:

- [ ] Node.js 18+ installed: `node --version`
- [ ] pnpm installed: `pnpm --version`
- [ ] Dependencies installed: `ls node_modules | wc -l` (should be 150+)
- [ ] .env.local created with environment variables
- [ ] Dev server running: `pnpm dev` (no errors)
- [ ] Home page loads: http://localhost:3000
- [ ] Dashboard loads: http://localhost:3000/dashboard
- [ ] Navigation works: Click links in dashboard

---

## Testing Features

### Test 1: Create Investigation
```
Dashboard → "New Investigation" → Fill form → Submit
Expected: Investigation appears in list
```

### Test 2: View Query Builder
```
Dashboard → "Query Builder" button
Expected: Query builder page loads with sample queries
```

### Test 3: Navigate Sections
```
Try each sidebar link:
- Investigations
- RCA Analysis
- Network Topology
- Compliance
- Transaction Tracer
- Admin Settings
```

---

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| DATABASE_URL | No* | postgresql://user:pass@host/db |
| AWS_REGION | No* | us-east-1 |
| AWS_ACCESS_KEY_ID | No* | AKIA... |
| AWS_SECRET_ACCESS_KEY | No* | wJalrXUtnF... |
| AWS_BEDROCK_MODEL_ID | No* | anthropic.claude-3-5-sonnet... |
| AWS_ATHENA_OUTPUT_LOCATION | No* | s3://bucket/path/ |

*Optional for demo - only required when actually using those features

---

## Getting Help

If issues persist:

1. Check error message carefully
2. Review this guide's "Common Issues" section
3. Check DEPLOYMENT.md for production guidance
4. Review QUICK_START.md for feature usage
5. Check DEVELOPER_GUIDE.md for code patterns

---

## Next Steps

After successful setup:

1. **Explore Dashboard**: http://localhost:3000/dashboard
2. **Create Test Investigation**: Try creating an investigation
3. **Visit Query Builder**: http://localhost:3000/query-builder
4. **Check Documentation**: Read FEATURES.md for all capabilities
5. **Configure AWS**: Add real AWS credentials for full functionality
6. **Deploy**: Follow DEPLOYMENT.md to go live

---

## Quick Command Reference

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Install specific package
pnpm add package-name

# Remove package
pnpm remove package-name
```

---

**You're all set! Start with `pnpm install` and then `pnpm dev`.**
