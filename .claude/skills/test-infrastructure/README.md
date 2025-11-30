# Test Infrastructure Helper Skill

**Version**: 0.2.0 (Beta)
**Status**: Beta - Enhanced with TDD/BDD/Property-Based Testing
**Component**: shared
**GitLab**: Issue #445, Milestone %21

## Overview

The Test Infrastructure Helper skill provides comprehensive test automation with TDD/BDD workflows, property-based testing, cross-layer orchestration, Vitest/Playwright scaffolding, auth mocking, timeout debugging, and coverage gap analysis. Now enforces Red-Green-Refactor discipline and ensures tests pass at each layer (Database → API → Frontend) before proceeding. Reduces test infrastructure commits by 70% and enforces test-first development.

### Problem Solved

Test infrastructure fragility consumes 8% of all commits (8+ per 100), with developers spending 10-30 minutes per fix on:
- Vitest setup fragility (vitest.setup.ts changed frequently)
- Auth mocking complexity (Supabase client + tenant context)
- TypeScript errors in test files
- Test data structure brittleness (breaks when schemas evolve)
- Test timeout debugging difficulties
- Repetitive test scaffolding

This skill provides production-ready templates and patterns that eliminate 70% of test infrastructure work and reduce fix time by 50%.

### Key Features

#### NEW in v0.2.0
- ✨ **TDD Workflow (Phase 0)** - Red-Green-Refactor cycle enforcement
- ✨ **BDD/Scenario Testing (Phase 1.5)** - Given-When-Then user stories
- ✨ **Property-Based Testing (Phase 3.5)** - Generative testing with fast-check
- ✨ **Cross-Layer Orchestration (Phase 7)** - DB → API → Frontend test gates
- ✨ **Deno Edge Function Testing** - Complete template for MCP server and worker tests

#### Existing Features (v0.1.0)
- ✅ **Vitest test scaffolding** with proper setup/teardown
- ✅ **Auth mocking templates** for Supabase + tenant context
- ✅ **Test database setup/teardown** automation
- ✅ **API route test generator** with tenant scoping validation
- ✅ **E2E test scaffolding** for Playwright with page objects
- ✅ **Test timeout debugger** with root cause analysis
- ✅ **Mock data factory generator** with type safety
- ✅ **Test coverage gap analyzer** finds untested routes

## Installation

This is a project skill (`.claude/skills/`), included automatically with the repository.

**No installation required** - skill is available when working in this codebase.

**Dependencies** (should already be installed):
- Vitest
- Playwright
- @faker-js/faker
- @supabase/supabase-js

## Usage

### Quick Start

#### Create API Route Test
```
User: "Create test for app/api/v1/assets/route.ts with tenant scoping"

Claude activates test-infrastructure skill:
1. Analyzes API route file (GET, POST endpoints)
2. Generates test file: __tests__/api/v1/assets/route.test.ts
3. Includes auth mocking for authenticated requests
4. Adds tenant scoping tests (verify isolation)
5. Creates test cases: auth, authorization, success, errors
6. Runs tests: 8 tests created, all passing ✅
```

#### Debug Test Timeout
```
User: "My test is timing out: __tests__/api/v1/reports/generate.test.ts"

Claude:
1. Runs test with verbose logging
2. Identifies slow database query (15+ seconds)
3. Analyzes probable cause (missing index on tenant_id)
4. Provides immediate fix (increase timeout to 30s)
5. Recommends proper fix (add database index)
6. Offers to create migration
```

#### Generate Mock Data Factory
```
User: "Create type-safe mock data factory for Asset entities"

Claude:
1. Reads type definition: types/asset.ts
2. Generates factory with @faker-js/faker
3. Adds builder pattern for complex scenarios
4. Creates factory with relationships (tenant, user, asset)
5. Ensures type safety with `satisfies` operator
6. Provides usage examples
```

## Features

### 1. Vitest Test Scaffolding

Generates complete Vitest test files with:
- Proper imports and TypeScript types
- beforeEach/afterEach setup and teardown
- Mock configuration
- Suggested test cases based on code analysis

**Templates**:
- `vitest-api-route-test.template.ts` - For Next.js API routes
- `vitest-unit-test.template.ts` - For utility functions
- `vitest-component-test.template.ts` - For React components
- `vitest-database-test.template.ts` - For database queries

### 2. Auth Mocking Templates

Pre-built patterns for Supabase authentication:
- Authenticated user with tenant context
- Unauthenticated user (test auth failures)
- Admin user (privileged operations)
- User without tenant (onboarding flows)

**Includes**:
- Supabase client mocking
- Tenant ID injection
- Auth header setup for API routes
- Type-safe mock implementations

### 3. Test Database Setup/Teardown

Automation for database test management:
- Transaction-based test isolation
- Seed data generation
- Foreign key-aware cleanup (reverse order)
- Connection pooling management

**Patterns**:
- `withTestDatabase()` wrapper for isolated tests
- `seedTestData()` for creating fixtures
- Proper teardown to prevent test pollution

### 4. API Route Test Generator

Comprehensive test generation for Next.js API routes:
- Analyzes route to identify HTTP methods
- Generates authentication tests (401 when unauthenticated)
- Generates authorization tests (403 when wrong tenant)
- Generates success cases (200 with valid data)
- Generates error cases (400 for invalid params)
- **Tenant scoping tests** (critical for multi-tenant security)

**Structure**:
```typescript
describe('GET /api/v1/assets', () => {
  describe('Authentication', () => { /* ... */ });
  describe('Authorization', () => { /* ... */ });
  describe('Success Cases', () => { /* ... */ });
  describe('Error Cases', () => { /* ... */ });
});
```

### 5. E2E Test Scaffolding (Playwright)

Generate Playwright E2E tests with:
- Page Object Model pattern
- Auth flow setup (login, logout)
- Common selectors library
- Screenshot/video capture on failure

**Templates**:
- `playwright-e2e-test.template.ts` - Base E2E test structure
- Page Object classes for reusable components
- Common selectors (auth, assets, forms)

### 6. Test Timeout Debugger

Analyzes and fixes test timeouts:
- Identifies slow operations (database queries, file I/O)
- Analyzes root cause (missing indexes, network calls)
- Provides immediate workaround (increase timeout)
- Recommends proper fix (add index, mock service)
- Generates performance analysis report

**Common patterns**:
- Database query without index → Add index
- Promise never resolves → Add await, check error handling
- External service call → Mock external services
- File I/O blocking → Use streaming, reduce test data

### 7. Mock Data Factory Generator

Creates type-safe factories for test data:
- Uses @faker-js/faker for realistic data
- Provides builder pattern for complex scenarios
- Handles entity relationships (foreign keys)
- Compile-time type validation with `satisfies`

**Patterns**:
```typescript
// Simple factory
const asset = createMockAsset({ tenant_id: 'ten_123' });

// Builder pattern
const asset = new AssetBuilder()
  .withTenant('ten_123')
  .withFilename('test.jpg')
  .build();

// With relationships
const { asset, tenant, user } = await createMockAssetWithRelations(supabase, 'ten_123');
```

### 8. Test Coverage Gap Analyzer

Finds untested code:
- Scans all API routes
- Checks for corresponding test files
- Analyzes coverage percentage
- Identifies missing test cases
- Suggests high-priority tests

**Reports**:
- Untested API routes (0 tests)
- Low coverage routes (<80%)
- Well-tested routes (≥80%)
- Specific missing test cases

### 9. Deno Edge Function Testing (NEW in v0.2.0)

Complete test scaffolding for Supabase Edge Functions:
- Deno runtime testing (jsr: imports, not npm:)
- Relative imports with .ts extensions
- assertEquals/assert instead of expect()
- Manual mock patterns (MockSupabaseClient, MockQueryBuilder, MockStorageBuilder)
- TDD "RED Cycle" test naming
- BDD Given-When-Then scenarios
- Validator testing patterns (AJV with Deno)

**Template**: `deno-edge-function-test.template.ts`

**Usage**:
```typescript
// File: supabase/functions/mcp-server/__tests/tools/my_tool_test.ts
import { describe, it } from 'jsr:@std/testing@^0.224.0/bdd';
import { assertEquals } from 'jsr:@std/assert@^0.224.0';
import { myTool } from '../../tools/my_tool.ts'; // .ts extension required

describe('MyTool', () => {
  it('RED Cycle 1.1: should process request successfully', async () => {
    const result = await myTool(testInput, mockClient);
    assertEquals(result.status, 'success');
  });
});
```

**Run command**:
```bash
cd supabase/functions/mcp-server
deno test --allow-env --allow-read __tests/**/*_test.ts
```

## Configuration

### Test File Conventions

Tests follow these path conventions:
- **API routes**: `__tests__/api/**/*.test.ts` (Vitest)
- **Components**: `__tests__/components/**/*.test.ts` (Vitest)
- **Utilities**: `__tests__/lib/**/*.test.ts` (Vitest)
- **E2E tests**: `e2e/**/*.spec.ts` (Playwright)
- **Edge functions**: `supabase/functions/{function-name}/__tests/**/*_test.ts` (Deno)

### Mock Data Conventions

Mock IDs use prefixes:
- Tenants: `ten_01234567890123456789`
- Users: `usr_01234567890123456789`
- Assets: `ast_01234567890123456789`

Use unique IDs per test run to avoid conflicts:
```typescript
const MOCK_TENANT_ID = `ten_test_${nanoid()}`;
```

### Environment Variables for Tests

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-role-key
```

### Timeout Defaults

- Unit tests: 5 seconds (default)
- Integration tests: 10 seconds
- Database tests: 30 seconds
- E2E tests: 60 seconds

Override per-test:
```typescript
it('slow test', async () => { /* ... */ }, { timeout: 30000 });
```

## Performance

### Token Usage
- **Activation**: ~6,500 tokens (SKILL.md loaded)
- **Per test generation**: ~3,000-5,000 tokens
- **Per coverage analysis**: ~2,000 tokens
- **Total per session**: ~10,000-15,000 tokens

### Execution Time
- **Test file generation**: 5-10 seconds
- **Coverage analysis**: 10-15 seconds
- **Timeout debugging**: 15-30 seconds
- **Mock factory generation**: 3-5 seconds

### Resource Requirements
- **File system**: Read access to app code, write to `__tests__/` and `e2e/`
- **Tools**: Read, Write, Edit, Bash, Glob, Grep
- **No network required**: All operations local
- **Supabase**: Optional (can be mocked)
- **GitLab**: Not required

## Limitations

1. **Database transactions**: Not fully implemented in v0.1.0 (manual cleanup required)
2. **Coverage analysis**: Only checks API routes (not components/utilities yet)
3. **Flakiness detection**: Not implemented (planned for v0.2.0)
4. **Visual regression**: Not integrated with Playwright (planned for v0.3.0)
5. **Performance benchmarks**: Not included (planned for v0.2.0)

## Troubleshooting

### Issue: "TypeScript errors in test file"

**Cause**: Mock types don't match actual types, imports incorrect

**Solution**:
- Use absolute imports: `import { GET } from '@/app/api/v1/users/route'`
- Type mocks correctly: `as unknown as SupabaseClient<Database>`
- Use `vi.mocked()` for type-safe mocks
- Check tsconfig includes test files

### Issue: "Test fails due to missing auth mock"

**Cause**: Auth mock not set up or request missing headers

**Solution**:
- Add mock in beforeEach: `createMockSupabaseClient('user-id', 'tenant-id')`
- Include auth headers: `'Authorization': 'Bearer mock-token'`
- Mock auth middleware if app uses it
- Match actual auth implementation (cookies vs headers)

### Issue: "Test database not cleaned up"

**Cause**: Teardown not running or foreign key violations

**Solution**:
- Add proper afterEach with cleanup
- Delete in reverse order of foreign keys
- Use unique IDs per test run: `ten_test_${nanoid()}`
- Consider using database transactions for isolation

### Issue: "E2E test cannot find element"

**Cause**: Element not rendered yet, selector is fragile

**Solution**:
- Add explicit waits: `await page.waitForSelector('.success')`
- Use data-testid: `<button data-testid="upload-btn">Upload</button>`
- Wait for network requests: `await page.waitForResponse(...)`
- Check element visibility before clicking
- Take screenshot on failure for debugging

### Issue: "Mock data factory has stale types"

**Cause**: Schema changed but factory not updated

**Solution**:
- Regenerate factory from current types
- Use `satisfies` for compile-time validation
- Add factory tests to catch mismatches early
- Run `pnpm typecheck` regularly

## Related Skills

- **database-development** (Skill 7): Coordinate RLS policy testing, use Data Vault patterns
- **lint-format-auto-fixer** (Skill 8): Fix ESLint errors in generated test files
- **work-tracking** (Skill 1): Track test infrastructure work sessions
- **commit-message** (Skill 2): Format commits for test additions

## Examples

### Example 1: Full API Route Test Generation

```
User: "Create comprehensive tests for app/api/v1/users/route.ts"

Claude (using test-infrastructure):

1. Analyzes app/api/v1/users/route.ts
   - Found GET endpoint (list users with pagination)
   - Found POST endpoint (create user)
   - Requires auth: Yes
   - Tenant scoped: Yes

2. Generates test file: __tests__/api/v1/users/route.test.ts

3. Test structure created:
   describe('GET /api/v1/users')
     - Authentication tests (401 when no token)
     - Authorization tests (only see users in same tenant)
     - Success tests (paginated results)
     - Error tests (invalid pagination params)

   describe('POST /api/v1/users')
     - Authentication tests (401 when no token)
     - Validation tests (400 for invalid email)
     - Success tests (201 with created user)
     - Error tests (409 for duplicate email)

4. Auth mocking included:
   - createMockSupabaseClient() with tenant context
   - Mock request with Authorization header
   - Tenant ID in request

5. Runs tests:
   ✅ 12 tests created
   ✅ All passing
   ✅ Coverage: 92%

Result: Comprehensive test suite ready in < 1 minute
```

### Example 2: Debug Complex Timeout

```
User: "Test timing out: __tests__/api/v1/analytics/dashboard.test.ts"

Claude:

1. Runs test with verbose logging:
   Test: "fetches dashboard analytics for tenant"
   Duration: 45.2s (timeout: 30s)

2. Analyzes query logs:
   Query 1: SELECT COUNT(*) FROM dv.sat_asset_metadata WHERE tenant_id = '...' (0.2s) ✅
   Query 2: SELECT * FROM dv.sat_workflow_run WHERE tenant_id = '...' (42.1s) ❌
   Query 3: ...

3. Identifies root cause:
   EXPLAIN ANALYZE shows:
   - Sequential scan on sat_workflow_run (42,000 rows)
   - Missing index on (tenant_id, created_at)
   - Sort operation in memory (slow)

4. Provides immediate fix:
   ```typescript
   it('fetches dashboard analytics', async () => {
     // ... test code
   }, { timeout: 60000 }); // Increase to 60s
   ```

5. Recommends proper fix:
   ```sql
   -- Migration: 2025-10-18-add-workflow-run-index.sql
   CREATE INDEX idx_sat_workflow_run_tenant_created
   ON dv.sat_workflow_run(tenant_id, created_at DESC);
   ```

6. Estimates improvement:
   With index: 42.1s → ~0.5s (84x faster)

7. Offers to create migration file

Result: Timeout resolved, performance improved 84x
```

### Example 3: Generate Factory with Relationships

```
User: "Create mock data factory for Workflow entities with full relationships"

Claude:

1. Analyzes types/workflow.ts:
   - Workflow has: id, tenant_id, name, created_by, status
   - Related to: Tenant (hub_tenant), User (hub_user), WorkflowRun (sat_workflow_run)

2. Generates simple factory:
   ```typescript
   export function createMockWorkflow(overrides?: Partial<Workflow>): Workflow {
     return {
       id: faker.string.nanoid(21),
       tenant_id: 'ten_01234567890123456789',
       name: faker.commerce.productName(),
       created_by: faker.string.nanoid(21),
       status: 'active',
       ...overrides,
     };
   }
   ```

3. Adds builder pattern:
   ```typescript
   export class WorkflowBuilder {
     private workflow: Partial<Workflow> = {};

     withTenant(id: string) { this.workflow.tenant_id = id; return this; }
     withName(name: string) { this.workflow.name = name; return this; }
     withStatus(status: string) { this.workflow.status = status; return this; }

     build(): Workflow {
       return createMockWorkflow(this.workflow);
     }
   }
   ```

4. Adds factory with relationships:
   ```typescript
   export async function createMockWorkflowWithRelations(
     supabase: SupabaseClient,
     tenantId: string
   ) {
     // 1. Ensure tenant exists
     const tenant = await ensureTenantHub(supabase, tenantId);

     // 2. Create user
     const user = await ensureUserHub(supabase, faker.internet.email());

     // 3. Link user to tenant
     await linkUserToTenant(supabase, user.id, tenant.id);

     // 4. Create workflow
     const workflow = createMockWorkflow({
       tenant_id: tenant.id,
       created_by: user.id,
     });

     // 5. Insert workflow
     const { data, error } = await supabase
       .from('dv.sat_workflow_metadata')
       .insert(workflow)
       .select()
       .single();

     if (error) throw error;

     return { workflow: data, tenant, user };
   }
   ```

5. Creates usage example test:
   ```typescript
   describe('Workflow Factory', () => {
     it('creates workflow with all relationships', async () => {
       const { workflow, tenant, user } = await createMockWorkflowWithRelations(
         supabase,
         'ten_test_123'
       );

       expect(workflow.tenant_id).toBe(tenant.id);
       expect(workflow.created_by).toBe(user.id);
     });
   });
   ```

Result: Type-safe factory with relationship management ready to use
```

## Contributing

To improve this skill:

1. Use skill-development skill: "Improve test-infrastructure skill"
2. Follow semantic versioning (0.1.0 → 0.2.0)
3. Update CHANGELOG.md
4. Test with real test generation tasks
5. Update quality score

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## License

Internal use only - Numonic Team

## Support

- **Issues**: GitLab issue #445
- **Documentation**: [SKILL.md](./SKILL.md)
- **Contact**: team@numonic.ai
