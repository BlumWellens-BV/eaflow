# Cross-Layer Test Orchestration Template

## Purpose

When implementing features that span multiple layers (Database → API → Frontend), ensure tests pass at each layer before proceeding to the next. This prevents cascading failures and ensures solid foundations.

---

## Layer Testing Strategy

### Architecture Layers (Bottom to Top)

```
┌─────────────────────────────────┐
│  Layer 4: Frontend (React/UI)  │ ← E2E Tests (Playwright)
├─────────────────────────────────┤
│  Layer 3: API Routes (Next.js) │ ← Integration Tests (Vitest)
├─────────────────────────────────┤
│  Layer 2: Business Logic       │ ← Unit Tests (Vitest)
├─────────────────────────────────┤
│  Layer 1: Database (PostgreSQL)│ ← Database Tests (pgTAP)
└─────────────────────────────────┘
```

**Testing Order**: Bottom-up (Layer 1 → Layer 2 → Layer 3 → Layer 4)

**Rationale**: Upper layers depend on lower layers. If database tests fail, API tests will also fail. Fix foundation first.

---

## Cross-Layer Testing Workflow

### Phase 1: Database Layer (Foundation)

**Goal**: Ensure database schema, functions, and RLS policies work correctly

#### 1.1 Database Schema Tests

```sql
-- File: supabase/tests/database/test_{feature}_schema.sql

BEGIN;
SELECT plan({N}); -- Number of tests

-- Test 1: Table exists
SELECT has_table('dv', 'sat_{entity}_metadata', 'Table sat_{entity}_metadata should exist');

-- Test 2: Columns exist
SELECT has_column('dv', 'sat_{entity}_metadata', '{column_name}', 'Column {column_name} should exist');

-- Test 3: Indexes exist (performance)
SELECT has_index('dv', 'sat_{entity}_metadata', 'idx_{entity}_{column}', 'Index for {column} should exist');

-- Test 4: Foreign keys enforce referential integrity
SELECT has_fk('dv', 'sat_{entity}_metadata', 'Foreign key to hub_{entity} should exist');

SELECT * FROM finish();
ROLLBACK;
```

#### 1.2 Database Function Tests

```sql
-- Test ensure_*_hub functions work

BEGIN;
SELECT plan(5);

-- Test: Function exists
SELECT has_function('dv', 'ensure_{entity}_hub', 'Function ensure_{entity}_hub should exist');

-- Test: Function creates hub if not exists
SELECT lives_ok(
  $$ SELECT dv.ensure_{entity}_hub('{entity_id}') $$,
  'Function should create hub without errors'
);

-- Test: Function returns existing hub
SELECT is(
  (SELECT dv.ensure_{entity}_hub('{entity_id}')),
  '{entity_id}',
  'Function should return existing hub ID'
);

-- Test: Function is idempotent
SELECT results_eq(
  $$ SELECT dv.ensure_{entity}_hub('{entity_id}') $$,
  $$ SELECT dv.ensure_{entity}_hub('{entity_id}') $$,
  'Function should be idempotent'
);

SELECT * FROM finish();
ROLLBACK;
```

#### 1.3 RLS Policy Tests

```sql
-- Test Row-Level Security enforces tenant isolation

BEGIN;
SELECT plan(4);

-- Test: Policy exists
SELECT has_policy('dv', 'sat_{entity}_metadata', '{policy_name}', 'RLS policy should exist');

-- Test: User can read own tenant's data
SET request.jwt.claims.tenant_id = '{tenant_a_id}';
SELECT results_eq(
  $$ SELECT tenant_id FROM dv.sat_{entity}_metadata $$,
  $$ VALUES ('{tenant_a_id}'::text) $$,
  'User should only see own tenant data'
);

-- Test: User CANNOT read other tenant's data
SET request.jwt.claims.tenant_id = '{tenant_b_id}';
SELECT is(
  (SELECT COUNT(*) FROM dv.sat_{entity}_metadata WHERE tenant_id = '{tenant_a_id}'),
  0::bigint,
  'User should not see other tenant data'
);

SELECT * FROM finish();
ROLLBACK;
```

#### 1.4 Run Database Tests

```bash
# Run all database tests
pnpm supabase test db

# Expected output:
# ✅ All tests passed (X/X)
```

**Gate**: ✅ All database tests MUST pass before proceeding to API layer

---

### Phase 2: Business Logic Layer (Domain)

**Goal**: Ensure core business logic works independently of HTTP/database

#### 2.1 Unit Tests for Business Logic

```typescript
// File: __tests__/lib/{domain}/{feature}.test.ts

import { describe, it, expect } from 'vitest';
import { {businessFunction} } from '@/lib/{domain}/{feature}';

describe('{BusinessFunction}', () => {
  // Test: Pure business logic (no I/O)
  it('calculates {result} correctly', () => {
    const input = {INPUT};
    const result = {businessFunction}(input);
    expect(result).toBe({EXPECTED});
  });

  // Test: Validation logic
  it('validates {constraint}', () => {
    const invalidInput = {INVALID_INPUT};
    expect(() => {businessFunction}(invalidInput)).toThrow();
  });

  // Test: Edge cases
  it('handles edge case: {EDGE_CASE}', () => {
    const edgeInput = {EDGE_INPUT};
    const result = {businessFunction}(edgeInput);
    expect(result).toBe({EXPECTED_EDGE_RESULT});
  });
});
```

#### 2.2 Run Business Logic Tests

```bash
# Run unit tests
pnpm test __tests__/lib/{domain}

# Expected output:
# ✅ All unit tests passed
```

**Gate**: ✅ All business logic tests MUST pass before proceeding to API layer

---

### Phase 3: API Layer (Integration)

**Goal**: Ensure API routes correctly integrate database + business logic

#### 3.1 API Route Integration Tests

```typescript
// File: __tests__/api/v1/{resource}/route.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET, POST } from '@/app/api/v1/{resource}/route';
import { createMockSupabaseClient } from '@/__tests__/helpers/supabase';

describe('API: /api/v1/{resource}', () => {
  const TENANT_ID = 'ten_test_123';
  const USER_ID = 'usr_test_456';
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient(USER_ID, TENANT_ID);
  });

  // Layer 1 dependency: Database operations work
  it('Layer 3 → Layer 1: successfully queries database', async () => {
    // This test verifies API route can talk to database
    const request = createAuthenticatedRequest('GET', `/api/v1/{resource}`);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockSupabase.from).toHaveBeenCalledWith('dv.sat_{entity}_metadata');
  });

  // Layer 2 dependency: Business logic is applied
  it('Layer 3 → Layer 2: applies business logic correctly', async () => {
    const request = createAuthenticatedRequest('POST', `/api/v1/{resource}`, {
      body: {INPUT_DATA},
    });

    const response = await POST(request);
    const data = await response.json();

    // Verify business logic was applied (e.g., computed field)
    expect(data.{computedField}).toBe({EXPECTED_VALUE});
  });

  // Tenant isolation (depends on RLS policies from Layer 1)
  it('Layer 3 → Layer 1 RLS: enforces tenant isolation', async () => {
    // Create data for Tenant A
    await seedData(mockSupabase, { tenant_id: TENANT_ID, ...DATA });

    // Try to access as Tenant B user
    const tenantBClient = createMockSupabaseClient('usr_other', 'ten_other');
    const request = createAuthenticatedRequest('GET', `/api/v1/{resource}`, {
      supabase: tenantBClient,
    });

    const response = await GET(request);
    const data = await response.json();

    // Should NOT see Tenant A's data
    expect(data.items).toHaveLength(0);
  });
});
```

#### 3.2 Run API Tests

```bash
# Run API integration tests
pnpm test __tests__/api/v1/{resource}

# Expected output:
# ✅ All API tests passed
# ✅ Coverage: ≥80%
```

**Gate**: ✅ All API tests MUST pass before proceeding to Frontend layer

---

### Phase 4: Frontend Layer (User Interface)

**Goal**: Ensure UI correctly uses API and displays data

#### 4.1 E2E Tests (Playwright)

```typescript
// File: e2e/{feature}.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Feature: {FeatureName}', () => {
  // Layer 4 → Layer 3 → Layer 2 → Layer 1 full stack test

  test('User can {action}', async ({ page }) => {
    // Setup: Login (depends on auth API - Layer 3)
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    // Navigate to feature page
    await page.goto('/{feature-route}');

    // Action: User performs action
    await page.click('[data-testid="{action-button}"]');

    // Verify: Check data was saved (depends on API - Layer 3)
    // API depends on database (Layer 1) and business logic (Layer 2)
    await page.waitForSelector('[data-testid="{success-indicator}"]');

    // Verify: Data is displayed correctly
    const displayedData = await page.textContent('[data-testid="{data-field}"]');
    expect(displayedData).toBe('{expected-value}');

    // Verify: Tenant isolation in UI (depends on RLS - Layer 1)
    // User should only see their tenant's data
    const items = await page.locator('[data-testid="item"]').count();
    expect(items).toBeGreaterThan(0); // Own data visible

    // Login as different tenant user
    await page.click('[data-testid="logout-button"]');
    await page.fill('[data-testid="email"]', 'other-user@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    await page.goto('/{feature-route}');

    // Should NOT see first tenant's data
    const otherTenantItems = await page.locator('[data-testid="item"]').count();
    expect(otherTenantItems).toBe(0); // Other tenant data not visible
  });
});
```

#### 4.2 Run E2E Tests

```bash
# Start dev server first
pnpm dev &

# Run E2E tests
pnpm test:e2e

# Expected output:
# ✅ All E2E tests passed
```

**Gate**: ✅ All E2E tests MUST pass - feature is complete!

---

## Cross-Layer Test Checklist

Use this checklist for each new feature:

### Layer 1: Database
- [ ] Schema tests pass (tables, columns, indexes exist)
- [ ] Function tests pass (ensure_*_hub, business functions)
- [ ] RLS policy tests pass (tenant isolation enforced)
- [ ] Migration runs without errors (`pnpm supabase db reset`)
- [ ] **GATE: `pnpm supabase test db` passes** ✅

### Layer 2: Business Logic
- [ ] Unit tests pass for core logic
- [ ] Validation tests pass
- [ ] Edge case tests pass
- [ ] No database dependencies in unit tests
- [ ] **GATE: `pnpm test __tests__/lib` passes** ✅

### Layer 3: API Routes
- [ ] Authentication tests pass (401 when unauthenticated)
- [ ] Authorization tests pass (403 when unauthorized)
- [ ] Tenant scoping tests pass (RLS enforced)
- [ ] Success tests pass (200/201 with correct data)
- [ ] Error tests pass (400/404/500 handled)
- [ ] Integration with Layer 1 (database) works
- [ ] Integration with Layer 2 (business logic) works
- [ ] **GATE: `pnpm test __tests__/api` passes** ✅

### Layer 4: Frontend
- [ ] E2E tests pass for happy path
- [ ] E2E tests pass for error cases
- [ ] Tenant isolation visible in UI
- [ ] Full stack integration works (Layer 4 → 3 → 2 → 1)
- [ ] **GATE: `pnpm test:e2e` passes** ✅

---

## Test Execution Strategy

### Development Workflow (TDD)

For each layer, follow Red-Green-Refactor:

```
┌─────────────────────────────────────────┐
│ LAYER 1: DATABASE                       │
├─────────────────────────────────────────┤
│ 1. Write pgTAP test (RED)              │
│ 2. Write migration (GREEN)             │
│ 3. Refactor migration (REFACTOR)       │
│ 4. Run: pnpm supabase test db          │
│    ✅ All database tests pass           │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ LAYER 2: BUSINESS LOGIC                 │
├─────────────────────────────────────────┤
│ 1. Write unit test (RED)               │
│ 2. Implement function (GREEN)          │
│ 3. Refactor code (REFACTOR)            │
│ 4. Run: pnpm test __tests__/lib        │
│    ✅ All unit tests pass               │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ LAYER 3: API ROUTES                     │
├─────────────────────────────────────────┤
│ 1. Write integration test (RED)        │
│ 2. Implement API route (GREEN)         │
│ 3. Refactor route (REFACTOR)           │
│ 4. Run: pnpm test __tests__/api        │
│    ✅ All API tests pass                │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ LAYER 4: FRONTEND                       │
├─────────────────────────────────────────┤
│ 1. Write E2E test (RED)                │
│ 2. Implement UI component (GREEN)      │
│ 3. Refactor component (REFACTOR)       │
│ 4. Run: pnpm test:e2e                  │
│    ✅ All E2E tests pass                │
└─────────────────────────────────────────┘
                   ↓
              FEATURE COMPLETE ✅
```

### CI/CD Pipeline (Automated)

```yaml
# .github/workflows/test.yml (example structure)

jobs:
  test-database:
    runs-on: ubuntu-latest
    steps:
      - name: Start Supabase
        run: pnpm supabase start
      - name: Run database tests
        run: pnpm supabase test db
      # GATE: Must pass to proceed

  test-unit:
    needs: test-database # Depends on database layer
    runs-on: ubuntu-latest
    steps:
      - name: Run unit tests
        run: pnpm test __tests__/lib
      # GATE: Must pass to proceed

  test-api:
    needs: [test-database, test-unit] # Depends on both layers
    runs-on: ubuntu-latest
    steps:
      - name: Run API tests
        run: pnpm test __tests__/api
      # GATE: Must pass to proceed

  test-e2e:
    needs: [test-database, test-unit, test-api] # Depends on all layers
    runs-on: ubuntu-latest
    steps:
      - name: Start dev server
        run: pnpm dev &
      - name: Run E2E tests
        run: pnpm test:e2e
      # GATE: Must pass to deploy

  deploy:
    needs: [test-database, test-unit, test-api, test-e2e]
    # Only deploys if ALL layers pass
```

---

## Failure Recovery

### When Layer 1 (Database) Tests Fail

**DO NOT proceed to Layer 2, 3, or 4.**

Fix database issues first:
1. Check migration syntax
2. Verify RLS policies
3. Check function definitions
4. Re-run: `pnpm supabase test db`

### When Layer 2 (Business Logic) Tests Fail

**DO NOT proceed to Layer 3 or 4.**

Fix business logic:
1. Review unit test expectations
2. Fix business logic implementation
3. Ensure no database dependencies in Layer 2
4. Re-run: `pnpm test __tests__/lib`

### When Layer 3 (API) Tests Fail

**DO NOT proceed to Layer 4.**

Fix API integration:
1. Verify Layer 1 and 2 are working (re-run those tests)
2. Check API route implementation
3. Verify request/response handling
4. Check auth mocking
5. Re-run: `pnpm test __tests__/api`

### When Layer 4 (E2E) Tests Fail

Diagnose the layer causing the failure:
1. Check browser console for errors (Layer 4 issue)
2. Check network tab for API failures (Layer 3 issue)
3. Check API logs for database errors (Layer 1 issue)
4. Check business logic in API response (Layer 2 issue)

**Fixing Strategy**:
- If Layer 4 (UI) issue: Fix component code
- If Layer 3 (API) issue: Fix API route, re-run Layer 3 tests first
- If Layer 1 (DB) issue: Fix database, re-run ALL layers (1 → 2 → 3 → 4)

---

## Example: Full Cross-Layer Feature Implementation

### Feature: "User uploads asset"

#### Step 1: Database Layer

```sql
-- Test first (RED)
BEGIN;
SELECT plan(3);
SELECT has_table('dv', 'sat_asset_metadata', 'Asset table should exist');
SELECT has_policy('dv', 'sat_asset_metadata', 'tenant_isolation', 'RLS policy should exist');
SELECT * FROM finish();
ROLLBACK;

-- Migration (GREEN)
CREATE TABLE dv.sat_asset_metadata (...);
CREATE POLICY tenant_isolation ON dv.sat_asset_metadata USING (tenant_id = current_setting('request.jwt.claims.tenant_id'));

-- Run tests
pnpm supabase test db
# ✅ PASS
```

#### Step 2: Business Logic Layer

```typescript
// Test first (RED)
it('generates storage path with tenant ID', () => {
  const path = generateStoragePath('ten_123', 'file.jpg');
  expect(path).toBe('ten_123/assets/file.jpg');
});

// Implementation (GREEN)
export function generateStoragePath(tenantId: string, filename: string) {
  return `${tenantId}/assets/${filename}`;
}

// Run tests
pnpm test __tests__/lib/assets
# ✅ PASS
```

#### Step 3: API Layer

```typescript
// Test first (RED)
it('POST /api/v1/assets creates asset', async () => {
  const response = await POST(createRequest({ filename: 'test.jpg' }));
  expect(response.status).toBe(201);
});

// Implementation (GREEN)
export async function POST(request: NextRequest) {
  const { filename } = await request.json();
  const path = generateStoragePath(tenantId, filename); // Layer 2
  const { data } = await supabase.from('dv.sat_asset_metadata').insert({ path }); // Layer 1
  return NextResponse.json(data, { status: 201 });
}

// Run tests
pnpm test __tests__/api/v1/assets
# ✅ PASS
```

#### Step 4: Frontend Layer

```typescript
// Test first (RED)
test('user uploads asset', async ({ page }) => {
  await page.setInputFiles('[data-testid="file-input"]', 'test.jpg');
  await page.click('[data-testid="upload-button"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});

// Implementation (GREEN)
function AssetUpload() {
  const handleUpload = async (file) => {
    await fetch('/api/v1/assets', { method: 'POST', body: JSON.stringify({ filename: file.name }) });
  };
  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}

// Run tests
pnpm test:e2e e2e/assets.spec.ts
# ✅ PASS
```

**Result**: Feature complete across all 4 layers, all tests passing!

---

## Benefits of Cross-Layer Testing

✅ **Early Issue Detection**: Catch database issues before building API
✅ **Clear Failure Location**: Know exactly which layer has the problem
✅ **Faster Debugging**: Don't debug UI when database is broken
✅ **Confidence**: Each layer proven to work independently
✅ **Refactoring Safety**: Can refactor Layer 2 without touching Layer 1
✅ **Parallel Development**: Team can work on different layers simultaneously (once contracts are defined)
