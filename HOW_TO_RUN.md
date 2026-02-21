# How to Run NAIAS - Complete Guide

## TL;DR (60 seconds)

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
pnpm dev

# 3. Open browser
# Go to: http://localhost:3000
```

Done! You're now running NAIAS.

---

## Full Step-by-Step Guide

### Step 1: Install Node.js (if needed)

Check if you already have it:
```bash
node --version
# Should show v18 or higher
```

If not, install from: https://nodejs.org/en/

### Step 2: Install pnpm (if needed)

```bash
# Check if installed
pnpm --version

# If not, install globally
npm install -g pnpm

# Verify
pnpm --version
# Should show v8 or higher
```

### Step 3: Navigate to Project Directory

```bash
# If you downloaded/cloned the project
cd /path/to/naias

# Or if it's in your Downloads
cd ~/Downloads/naias
```

### Step 4: Install Dependencies

This downloads all 150+ packages needed to run NAIAS.

```bash
pnpm install
```

**Expected output:**
```
 WARN  deprecated bson@1.1.6: ...
✓ Packages in lockfile are up to date
✓ 300+ packages installed
```

Wait for it to finish (may take 2-5 minutes first time).

### Step 5: Create Environment File (Optional but Recommended)

Copy the example env file:

```bash
# Copy the example
cp .env.local.example .env.local
```

This file already has placeholder values. For demo purposes, you can leave it as-is.

**For AWS integration later**, edit `.env.local` and add your AWS credentials:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### Step 6: Start Development Server

```bash
pnpm dev
```

**Expected output:**
```
▲ Next.js 16.1.6
   Local:        http://localhost:3000
   Environments: .env.local

✓ Ready in 1.8s
```

### Step 7: Open in Browser

Click or copy-paste this URL:
```
http://localhost:3000
```

You should see the NAIAS landing page with:
- Hero section
- Feature overview
- Call-to-action buttons

---

## Where to Go After Startup

### 1. View Dashboard
```
http://localhost:3000/dashboard
```
See KPIs and recent investigations.

### 2. Create First Investigation
```
Dashboard → "New Investigation" button
```

### 3. Explore Features
Click the quick-start buttons:
- Query Builder
- RCA Analysis
- Network Topology
- Compliance
- Transaction Tracer
- Admin Settings

---

## Running for Different Purposes

### For Local Development

```bash
pnpm dev
# App runs at http://localhost:3000
# Auto-reloads on file changes
```

### For Testing Production Build

```bash
# Build first
pnpm build

# Then run it
pnpm start
# App runs at http://localhost:3000
```

### For Linting Code

```bash
pnpm lint
```

### On Different Port (if 3000 is taken)

```bash
pnpm dev -- -p 3001
# App runs at http://localhost:3001
```

---

## Stopping the Server

To stop the dev server:

```bash
# Press CTRL+C in the terminal
# Or CMD+C on Mac
```

---

## Common Startup Issues & Fixes

### ❌ "pnpm: command not found"

**Fix:**
```bash
npm install -g pnpm
```

### ❌ "Error: Port 3000 already in use"

**Fix - Option 1:** Stop the other app using port 3000

**Fix - Option 2:** Use different port
```bash
pnpm dev -- -p 3001
```

### ❌ "Cannot find module" errors

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### ❌ "DATABASE_URL is not set" warning

**This is OK for demo!** You can ignore this warning. The app still works without a database for testing.

To fully configure:
1. Get database URL from Neon.tech (free tier available)
2. Add to `.env.local`: `DATABASE_URL=postgresql://...`
3. Restart with `pnpm dev`

### ❌ TypeScript errors on startup

**Fix:** Wait for initial build to complete. Most errors resolve automatically.

If they persist:
```bash
pnpm dev
# Wait 30 seconds
# Errors should resolve
```

### ❌ "Cannot find components" errors

**Fix:**
```bash
# Make sure all files exist in /components/ui/
ls components/ui/

# If empty, reinstall
pnpm install
```

---

## Verification Checklist

After starting `pnpm dev`, verify:

- [ ] No error messages in terminal
- [ ] Terminal shows "Ready in X.Xs"
- [ ] Can access http://localhost:3000
- [ ] Page loads (not blank)
- [ ] Can see "NAIAS" branding
- [ ] Sidebar/navigation visible
- [ ] Can click navigation links

---

## File Structure (Where Code Is)

```
/vercel/share/v0-project/
├── app/                    # Pages and API routes
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard
│   ├── investigations/    # Investigations
│   ├── query-builder/     # Query builder
│   ├── rca-analysis/      # RCA analysis
│   ├── network-topology/  # Network view
│   ├── compliance/        # Compliance
│   ├── transaction-tracer/# Transaction tracer
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # UI components
├── lib/                   # Business logic
│   ├── db/               # Database
│   ├── services/         # Services
│   └── types/            # TypeScript types
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
├── next.config.mjs       # Next.js config
└── README.md             # Project README
```

---

## What's Running

When you do `pnpm dev`, here's what starts:

1. **Next.js Dev Server** - Compiles and serves your app
2. **Fast Refresh** - Auto-reloads when you edit files
3. **TypeScript Compiler** - Checks types in background
4. **Webpack Bundler** - Bundles JavaScript/CSS

All together = your app at http://localhost:3000

---

## Next Steps After Running

1. **Explore Dashboard**: Visit http://localhost:3000/dashboard
2. **Create Test Investigation**: Click "New Investigation"
3. **Try Query Builder**: Go to Query Builder page
4. **Check Documentation**: Read FEATURES.md for all capabilities
5. **Configure AWS** (optional): Add credentials to .env.local for full functionality

---

## Need Help?

If something doesn't work:

1. **Check this guide** - Search for your error
2. **Read SETUP_INSTRUCTIONS.md** - Detailed setup help
3. **Check terminal output** - Error messages are usually helpful
4. **Check DEPLOYMENT.md** - For production issues
5. **Check DEVELOPER_GUIDE.md** - For code/feature questions

---

## Quick Reference Commands

```bash
# Install all dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint

# Add a new package
pnpm add package-name

# Remove a package
pnpm remove package-name

# Update all packages
pnpm update

# Clear cache and reinstall
pnpm install --force
```

---

## Success!

Once you see "Ready in X.Xs" in the terminal and can access http://localhost:3000, you're successfully running NAIAS!

Start exploring the dashboard and creating investigations. Have fun!
