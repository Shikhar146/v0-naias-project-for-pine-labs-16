# START HERE - Run NAIAS in 60 Seconds

## The 3-Line Version

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

Done! NAIAS is running.

---

## Step by Step

### 1. Open Terminal

**Mac/Linux:** Open Applications → Terminal  
**Windows:** Open Start → cmd or PowerShell

### 2. Go to Project Folder

```bash
cd /path/to/naias
```

### 3. Install Dependencies

```bash
pnpm install
```

Wait for completion (takes 1-5 minutes first time).

### 4. Start Dev Server

```bash
pnpm dev
```

Wait until you see:
```
✓ Ready in X.Xs
```

### 5. Open Browser

Go to: **http://localhost:3000**

You're running NAIAS!

---

## Where to Go Next

| URL | What You'll See |
|-----|-----------------|
| http://localhost:3000 | Home page with features |
| http://localhost:3000/dashboard | Main dashboard |
| http://localhost:3000/investigations | Investigation list |
| http://localhost:3000/investigations/new | Create new investigation |
| http://localhost:3000/query-builder | Query builder |
| http://localhost:3000/rca-analysis | RCA analysis |
| http://localhost:3000/network-topology | Network visualization |
| http://localhost:3000/transaction-tracer | Payment transaction tracing |
| http://localhost:3000/compliance | Compliance audit |
| http://localhost:3000/admin | Admin settings |

---

## Common Problems

| Problem | Solution |
|---------|----------|
| `pnpm: command not found` | Run: `npm install -g pnpm` |
| Port 3000 in use | Run: `pnpm dev -- -p 3001` then go to http://localhost:3001 |
| Module not found | Run: `rm -rf node_modules && pnpm install && pnpm dev` |
| DATABASE warning | OK for demo, ignore it |
| Page blank on first load | Wait 30 seconds, refresh browser |
| Too many errors | Kill dev server (CTRL+C), wait, run `pnpm dev` again |

---

## Stop the Server

Press **CTRL+C** (or **CMD+C** on Mac) in the terminal.

---

## More Help

- **How to Run**: See `HOW_TO_RUN.md`
- **Setup Help**: See `SETUP_INSTRUCTIONS.md`
- **Features**: See `FEATURES.md`
- **Deployment**: See `DEPLOYMENT.md`

---

## That's It!

Your NAIAS instance is running. Explore the dashboard and create investigations.

Have fun! 🚀
