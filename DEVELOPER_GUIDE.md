# NAIAS Developer Guide

## Overview

This guide is for developers contributing to or extending the NAIAS platform. It covers development setup, architecture patterns, best practices, and how to add new features.

---

## Development Environment Setup

### Prerequisites
- Node.js 18.17+ (use `node --version` to check)
- pnpm 8+ (npm install -g pnpm)
- PostgreSQL 14+ (or Neon account)
- AWS Account with development credentials

### Initial Setup

```bash
# 1. Clone repository
git clone <your-repo>
cd naias

# 2. Install dependencies
pnpm install

# 3. Create .env.local
cp .env.example .env.local

# 4. Fill in environment variables
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# DATABASE_URL=postgresql://...

# 5. Setup database
pnpm db:push

# 6. Start development server
pnpm dev

# 7. Open browser
# Navigate to http://localhost:3000
```

---

## Project Structure Deep Dive

### /app - Routes and Pages

```
app/
├── (public)/                  # Public pages (no layout)
├── (authenticated)/           # Protected pages
├── api/                       # API routes
├── dashboard/                 # Dashboard page
├── investigations/            # Investigation hub
├── rca-analysis/             # RCA viewer
├── layout.tsx                # Root layout
└── page.tsx                  # Landing page
```

**Key Pattern**: Each folder is a route segment. Use `(group)` for layout grouping.

### /lib - Business Logic

```
lib/
├── services/                 # Business logic services
│   ├── query-generator.ts   # AI query generation
│   ├── agent-orchestrator.ts # Multi-agent workflow
│   └── ... (more services)
├── db/                       # Database layer
│   ├── schema.ts            # Drizzle ORM schema
│   └── client.ts            # DB client
├── types/                    # TypeScript types
├── utils/                    # Helper functions
└── constants/               # Constants & templates
```

**Key Pattern**: Keep services independent and focused. Use dependency injection where needed.

### /components - Reusable UI

```
components/
├── ui/                       # shadcn/ui components
├── dashboard/               # Dashboard-specific
├── investigations/          # Investigation-specific
├── query/                   # Query builder components
├── rca/                     # RCA components
└── common/                  # Shared layout
```

**Key Pattern**: Components should be small, focused, and reusable.

---

## Code Patterns & Best Practices

### 1. API Routes

✅ **Good Pattern**:
```typescript
// app/api/investigations/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Validate request
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') ?? '0');
    
    // Business logic
    const investigations = await db
      .select()
      .from(investigationsTable)
      .limit(20)
      .offset(skip);
    
    // Return response
    return NextResponse.json({
      investigations,
      total: investigations.length,
    });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Service Layer

✅ **Good Pattern**:
```typescript
// lib/services/example-service.ts
export class ExampleService {
  async doSomething(input: string): Promise<Result> {
    // Validate input
    if (!input) throw new Error('Input required');
    
    // Perform operation
    const result = await performOperation(input);
    
    // Return result
    return result;
  }
}

// Usage
const service = new ExampleService();
const result = await service.doSomething('test');
```

### 3. React Components

✅ **Good Pattern**:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onAction();
    } catch (error) {
      console.error('[v0] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {title}
    </Button>
  );
}
```

### 4. Type Safety

✅ **Good Pattern**:
```typescript
// Define types for data
interface Investigation {
  id: string;
  title: string;
  type: 'incident' | 'audit' | 'performance';
  status: 'draft' | 'running' | 'completed';
}

// Use in functions
function createInvestigation(data: Omit<Investigation, 'id'>) {
  // Function body
}

// Use in components
<Investigation data={investigation} />
```

### 5. Error Handling

✅ **Good Pattern**:
```typescript
try {
  const result = await riskyOperation();
  return NextResponse.json(result);
} catch (error) {
  // Log with context
  console.error('[v0] Operation failed:', {
    error: error instanceof Error ? error.message : String(error),
    context: 'riskyOperation',
  });
  
  // Return appropriate error
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Adding New Features

### Step 1: Define Types

```typescript
// lib/types/new-feature.ts
export interface NewFeatureData {
  id: string;
  title: string;
  // ... other fields
}
```

### Step 2: Create Service

```typescript
// lib/services/new-feature-service.ts
export class NewFeatureService {
  async getData(): Promise<NewFeatureData[]> {
    // Implementation
  }
}
```

### Step 3: Add API Route

```typescript
// app/api/new-feature/route.ts
export async function GET(request: NextRequest) {
  const service = new NewFeatureService();
  const data = await service.getData();
  return NextResponse.json(data);
}
```

### Step 4: Create Component

```typescript
// components/new-feature/component.tsx
'use client';

export function NewFeatureComponent() {
  const [data, setData] = useState<NewFeatureData[]>([]);

  useEffect(() => {
    fetch('/api/new-feature')
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Step 5: Add Page

```typescript
// app/new-feature/page.tsx
import { LayoutWrapper } from '@/components/layout-wrapper';
import { NewFeatureComponent } from '@/components/new-feature/component';

export default function NewFeaturePage() {
  return (
    <LayoutWrapper>
      <NewFeatureComponent />
    </LayoutWrapper>
  );
}
```

---

## Database Changes

### Adding a New Table

1. **Update schema**:
```typescript
// lib/db/schema.ts
export const newTable = pgTable('new_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

2. **Create migration**:
```sql
-- scripts/add-new-table.sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Run migration**:
```bash
pnpm db:push
```

---

## Testing

### Unit Tests

```typescript
// tests/services/query-generator.test.ts
import { describe, it, expect } from '@jest/globals';
import { QueryGenerator } from '@/lib/services/query-generator';

describe('QueryGenerator', () => {
  it('should generate valid SQL', () => {
    const generator = new QueryGenerator();
    const sql = generator.generateSQL('Show me failed payments');
    expect(sql).toContain('SELECT');
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test query-generator

# Watch mode
pnpm test --watch
```

---

## Debugging

### Enable Debug Logging

Use `console.log('[v0]', ...)` for debug statements:

```typescript
console.log('[v0] Investigation created:', investigation);
```

These will appear in server logs during development.

### Debug in Browser

```typescript
// Use debugger in components
debugger;

// Or conditional breakpoints
if (condition) debugger;
```

### Database Debugging

```bash
# Access database via Neon
psql "your_database_url"

# View tables
\dt

# Query data
SELECT * FROM investigations;
```

---

## Performance Optimization

### 1. Minimize Re-renders

```typescript
// ❌ Bad - creates new object each render
<Component data={{ id: 1, name: 'test' }} />

// ✅ Good - use useMemo
const data = useMemo(() => ({ id: 1, name: 'test' }), []);
<Component data={data} />
```

### 2. Optimize Queries

```typescript
// ❌ Bad - N+1 query problem
const investigations = await db.select().from(investigations);
for (const inv of investigations) {
  const queries = await db.select().from(queries).where(...);
}

// ✅ Good - use join
const data = await db
  .select()
  .from(investigations)
  .leftJoin(queries, eq(queries.investigationId, investigations.id));
```

### 3. Use Server Components

```typescript
// ✅ Good - fetch data server-side
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <Component data={data} />;
}
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Security scan completed
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Code reviewed

---

## Common Issues & Solutions

### Database Connection Error

```
Error: connect ENOENT /var/run/postgresql/.s.PGSQL.5432

Solution:
1. Check DATABASE_URL in .env.local
2. Verify Neon credentials
3. Ensure firewall allows connections
```

### AWS Credential Error

```
Error: InvalidUserID

Solution:
1. Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
2. Check IAM permissions
3. Ensure credentials are current (not expired)
```

### Type Error

```
Error: Type 'X' is not assignable to type 'Y'

Solution:
1. Check type definitions
2. Use TypeScript strict mode
3. Cast if necessary: as Type
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: Add my feature"

# Push changes
git push origin feature/my-feature

# Create Pull Request
# Get review
# Merge to main
```

---

## Code Style

### Formatting

```bash
# Format code (using Prettier)
pnpm format

# Format specific file
pnpm format lib/services/example.ts
```

### Linting

```bash
# Run ESLint
pnpm lint

# Fix issues
pnpm lint --fix
```

### Naming Conventions

- **Files**: kebab-case (my-file.ts)
- **Folders**: kebab-case (my-folder/)
- **Classes**: PascalCase (MyClass)
- **Functions**: camelCase (myFunction)
- **Constants**: UPPER_SNAKE_CASE (MY_CONSTANT)
- **Types/Interfaces**: PascalCase (MyInterface)
- **Props Interface**: ComponentNameProps

---

## Resources & Links

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### AWS
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Athena Documentation](https://docs.aws.amazon.com/athena/)
- [Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [DBeaver](https://dbeaver.io/)
- [Git Documentation](https://git-scm.com/doc)

---

## Support

For questions or issues:

1. Check existing documentation
2. Review similar code patterns
3. Ask team members
4. Open an issue on GitHub

---

**Happy Coding! 🚀**

*Last Updated: February 21, 2026*
