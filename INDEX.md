# 📚 NAIAS Documentation - Complete Index

## Quick Navigation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **START.md** | ⚡ Quickest way to get running | 2 min |
| **SETUP.md** | 📖 Complete setup guide with AWS details | 10 min |
| **README.md** | 📋 Architectural overview & features | 5 min |

---

## 🚀 For New Users

1. **START.md** - Follow the 3-step quick start
2. **SETUP.md** - Learn about AWS services integration
3. **README.md** - Understand the platform

---

## 🗂️ Project Structure

```
NAIAS/
├── START.md                    ⭐ Start here!
├── SETUP.md                    📚 Complete documentation
├── README.md                   📋 Platform overview
├── docker-compose.yml          🐳 MongoDB Docker
├── .env.local                  🔐 Configuration (single file)
├── start-dev.sh                🚀 Startup script
├── package.json
├── tsconfig.json
├── next.config.mjs
│
├── app/
│   ├── api/investigations/     API routes
│   ├── dashboard/              Home page
│   ├── investigations/         Investigation features
│   └── layout.tsx
│
├── lib/
│   ├── db/                     MongoDB integration
│   ├── services/               AWS service clients
│   └── types/                  TypeScript definitions
│
├── components/                 React components
├── public/                     Static assets
└── node_modules/
```

---

## 📄 Files Removed (Cleaned Up)

Removed 14 duplicate/outdated documentation files:
- API_REFERENCE.md
- ARCHITECTURE.md  
- AWS_CREDENTIALS_SETUP.md
- BUILD_SUMMARY.md
- COMPLETION_CHECKLIST.md
- DEPLOYMENT.md
- DEVELOPER_GUIDE.md
- FEATURES.md
- HOW_TO_RUN.md
- IMPLEMENTATION.md
- MANIFEST.md
- QUICK_START.md
- RUNNING_SUMMARY.md
- All old MONGODB_*.md files
- DOCKER_COMMANDS.md
- QUICK_REFERENCE.md
- All old environment files

---

## ✅ What's Left (Clean & Essential)

- ✅ **1 Main Configuration**: `.env.local` (centralized)
- ✅ **3 Documentation Files**: START.md, SETUP.md, README.md
- ✅ **1 Docker Setup**: `docker-compose.yml`
- ✅ **1 Startup Script**: `start-dev.sh`
- ✅ **Clean Codebase**: No trash files

---

## 🎯 Architecture at a Glance

```
User (Browser)
    ↓
Next.js Frontend (React 19 + TypeScript)
    ↓
Next.js API Routes (Node.js Backend)
    ↓
┌─────────────────────────────────────┐
│  MongoDB (Persistent Storage)       │
│  - investigations                    │
│  - queries, timelines, users, orgs   │
└─────────────────────────────────────┘
    ↓
AWS Services (when configured)
    ├─ Athena (SQL queries)
    ├─ CloudWatch (logs)
    ├─ Security Hub (findings)
    ├─ VPC Flow Logs (network)
    └─ Bedrock (AI analysis)
```

---

## 🔐 Single Environment File

All configuration in one place: `.env.local`

```env
# MongoDB
MONGODB_URI=...
MONGODB_DB=naias

# AWS Credentials
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# AWS Services
ATHENA_DATABASE=...
ATHENA_OUTPUT_LOCATION=...
BEDROCK_MODEL_ID=...
```

---

## 🚀 Get Started

```bash
# 1. Start MongoDB
docker-compose up -d

# 2. Configure .env.local (add AWS credentials)
# Edit .env.local with your AWS keys

# 3. Start app
npm run dev

# 4. Visit
open http://localhost:3000
```

---

## 📞 Support

Need help?
1. Check **START.md** for quick troubleshooting
2. Read **SETUP.md** for detailed information
3. Review **README.md** for architecture details

---

**Version**: 1.0.0  
**Last Updated**: February 22, 2026  
**Status**: ✅ Ready for Production
