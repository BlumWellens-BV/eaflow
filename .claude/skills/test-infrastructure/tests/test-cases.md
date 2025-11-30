# Test Infrastructure Helper - Test Cases

This file documents comprehensive test cases for the Test Infrastructure Helper skill.

**Coverage**: All 8 features with activation, basic usage, and edge cases
**Total Test Cases**: 35 scenarios

---

## Skill Activation Tests (3 cases)

### TEST-001: Activate with "create test" trigger
**Input**: "Create test for app/api/v1/assets/route.ts"
**Expected**: Skill activates and identifies API route test type
**Actual**: ✅ Pass
**Notes**: Skill correctly recognizes API route pattern

### TEST-002: Activate with "mock auth" trigger
**Input**: "Generate auth mocking template for multi-tenant test"
**Expected**: Skill activates and provides Supabase auth mock
**Actual**: ✅ Pass
**Notes**: Provides createMockSupabaseClient template

### TEST-003: Activate with "test timeout" trigger
**Input**: "Why is my test timing out in reports.test.ts?"
**Expected**: Skill activates and begins timeout analysis
**Actual**: ✅ Pass
**Notes**: Recognizes timeout debugging request

---

## Feature 1: Vitest Test Scaffolding (5 cases)

### TEST-004: Generate API route test file
**Input**: "Create Vitest test for app/api/v1/users/route.ts"
**Expected**:
- Reads API route file
- Identifies HTTP methods (GET, POST)
- Generates test file at `__tests__/api/v1/users/route.test.ts`
- Includes auth mocking setup
- Creates test structure with describe blocks

**Validation**:
- [ ] Test file exists at correct path
- [ ] All imports are valid
- [ ] Setup/teardown in beforeEach/afterEach
- [ ] Test cases for auth, authorization, success, errors
- [ ] TypeScript compiles without errors

### TEST-005: Generate unit test for utility function
**Input**: "Create test for lib/utils/formatDate.ts"
**Expected**:
- Uses vitest-unit-test.template.ts
- Generates simple test structure
- No auth mocking (not needed for utils)
- Focuses on input/output testing

**Validation**:
- [ ] Test file created
- [ ] No unnecessary mocks
- [ ] Tests cover edge cases (null, undefined, invalid)

### TEST-006: Generate database query test
**Input**: "Create test for lib/queries/getAssetsByTenant.ts"
**Expected**:
- Uses vitest-database-test.template.ts
- Includes database setup/teardown
- Uses withTestDatabase() wrapper
- Tests RLS policy enforcement

**Validation**:
- [ ] Database cleanup in afterEach
- [ ] Tests tenant isolation
- [ ] Proper mock data seeding

### TEST-007: Handle missing file path
**Input**: "Create test for my API route" (no specific path)
**Expected**:
- Asks user: "What is the file path to test?"
- Waits for file path input
- Continues after receiving path

**Validation**:
- [ ] Gracefully prompts for missing info
- [ ] Doesn't proceed without file path

### TEST-008: Handle invalid file path
**Input**: "Create test for nonexistent/route.ts"
**Expected**:
- Checks if file exists
- Reports error: "File not found: nonexistent/route.ts"
- Asks user to verify path

**Validation**:
- [ ] File existence check before generation
- [ ] Clear error message

---

## Feature 2: Auth Mocking Templates (5 cases)

### TEST-009: Generate auth mock for authenticated user with tenant
**Input**: "Create auth mock for authenticated multi-tenant test"
**Expected**:
- Provides createMockSupabaseClient() code
- Includes tenant_id in user_metadata
- Shows usage example

**Validation**:
- [ ] Mock includes auth.getUser()
- [ ] Mock includes auth.getSession()
- [ ] tenant_id in user_metadata
- [ ] Type-safe (SupabaseClient<Database>)

### TEST-010: Generate auth mock for unauthenticated user
**Input**: "Create auth mock for 401 test case"
**Expected**:
- Provides createUnauthenticatedSupabaseClient() code
- Mock returns null user
- Mock returns auth error

**Validation**:
- [ ] user is null
- [ ] error message present
- [ ] Usable for 401 testing

### TEST-011: Generate admin user mock
**Input**: "Create auth mock for admin user"
**Expected**:
- Provides createMockAdminSupabaseClient() code
- Includes admin role in user_metadata
- Shows privileged access patterns

**Validation**:
- [ ] role: 'admin' in metadata
- [ ] Different user_id (admin prefix)

### TEST-012: Generate mock with custom tenant ID
**Input**: "Create auth mock for tenant ten_custom_123"
**Expected**:
- createMockSupabaseClient with tenant parameter
- tenant_id set to 'ten_custom_123'

**Validation**:
- [ ] Custom tenant ID used
- [ ] Shows parameter usage

### TEST-013: Generate RLS policy test mock
**Input**: "Create auth mock to test RLS tenant isolation"
**Expected**:
- Provides mockRLSPolicyBlock() helper
- Shows test pattern for wrong-tenant access
- Expected result: no rows returned

**Validation**:
- [ ] RLS test pattern included
- [ ] Two tenant IDs (A and B)
- [ ] Expects empty result set

---

## Feature 3: Test Database Setup/Teardown (4 cases)

### TEST-014: Generate database test wrapper
**Input**: "Create database test wrapper with cleanup"
**Expected**:
- Provides withTestDatabase() function
- Includes automatic cleanup in finally block
- Shows usage example

**Validation**:
- [ ] Function wraps test execution
- [ ] Cleanup runs even on test failure
- [ ] Type-safe with generics

### TEST-015: Generate seed data function
**Input**: "Create test data seeding for tenant and user"
**Expected**:
- Provides seedTestData() function
- Creates tenant hub + satellite
- Creates user hub + satellite
- Links user to tenant

**Validation**:
- [ ] Correct Data Vault table order
- [ ] All foreign keys satisfied
- [ ] Returns created IDs

### TEST-016: Generate cleanup function
**Input**: "Create database cleanup for test data"
**Expected**:
- Provides cleanupTestData() function
- Deletes in reverse order (children first)
- Handles foreign key constraints

**Validation**:
- [ ] Links deleted before hubs
- [ ] Satellites deleted before hubs
- [ ] No FK violations

### TEST-017: Generate unique test IDs
**Input**: "Generate unique test IDs to avoid conflicts"
**Expected**:
- Provides generateTestIds() function
- Uses nanoid() for uniqueness
- Includes all common entity types

**Validation**:
- [ ] IDs are unique per call
- [ ] Proper prefixes (ten_, usr_, ast_)
- [ ] Suitable for parallel tests

---

## Feature 4: API Route Test Generator (5 cases)

### TEST-018: Generate comprehensive API route tests
**Input**: "Generate tests for app/api/v1/assets/route.ts with full coverage"
**Expected**:
- Analyzes route (GET, POST endpoints)
- Generates 4 test groups:
  - Authentication tests
  - Authorization tests (tenant scoping)
  - Success cases
  - Error cases
- All tests included

**Validation**:
- [ ] ≥8 test cases generated
- [ ] Auth tests (401)
- [ ] Tenant scoping tests (403/404)
- [ ] Success tests (200/201)
- [ ] Error tests (400/500)

### TEST-019: Generate tenant scoping test
**Input**: "Create tenant isolation test for assets API"
**Expected**:
- Test creates data for tenant A
- Authenticates as user from tenant B
- Verifies tenant B cannot access tenant A data
- Expects 404 or 403

**Validation**:
- [ ] Two different tenant IDs
- [ ] RLS policy tested
- [ ] Security validated

### TEST-020: Generate pagination test
**Input**: "Create test for paginated API route"
**Expected**:
- Tests with page/limit parameters
- Verifies pagination metadata in response
- Tests edge cases (page=0, limit=0)

**Validation**:
- [ ] Pagination params in request
- [ ] Response includes pagination object
- [ ] Edge cases covered

### TEST-021: Generate validation test
**Input**: "Create test for request body validation"
**Expected**:
- Tests with missing required fields
- Tests with invalid field types
- Expects 400 responses
- Checks error messages

**Validation**:
- [ ] Multiple validation scenarios
- [ ] 400 status expected
- [ ] Error messages checked

### TEST-022: Handle route with no auth requirement
**Input**: "Create test for public API route"
**Expected**:
- Detects no auth requirement
- Skips auth mocking
- Focuses on functionality tests

**Validation**:
- [ ] No auth tests generated
- [ ] Public access assumed
- [ ] Appropriate test structure

---

## Feature 5: E2E Test Scaffolding (4 cases)

### TEST-023: Generate E2E test with Page Object Model
**Input**: "Create Playwright test for asset upload flow"
**Expected**:
- Creates AssetUploadPage class
- Includes selectors for all elements
- Includes auth helper
- Generates test cases for upload flow

**Validation**:
- [ ] Page Object class created
- [ ] beforeEach includes login
- [ ] Test cases for happy path and errors
- [ ] afterEach includes logout

### TEST-024: Generate auth flow helpers
**Input**: "Create E2E auth helpers for login/logout"
**Expected**:
- Provides AuthHelper class
- login() method with email/password
- logout() method
- isLoggedIn() check method

**Validation**:
- [ ] All auth methods present
- [ ] Waits for navigation
- [ ] Type-safe with Playwright types

### TEST-025: Generate common selectors
**Input**: "Provide common Playwright selectors"
**Expected**:
- Returns common-selectors.json data
- Includes auth, navigation, forms, modals
- Emphasizes data-testid usage

**Validation**:
- [ ] Comprehensive selector library
- [ ] Categorized by feature
- [ ] Best practices noted

### TEST-026: Generate E2E test with file upload
**Input**: "Create E2E test for file upload"
**Expected**:
- Uses page.setInputFiles()
- Waits for upload completion
- Verifies upload success message

**Validation**:
- [ ] File upload code included
- [ ] Wait for API response
- [ ] Success verification

---

## Feature 6: Test Timeout Debugger (4 cases)

### TEST-027: Debug database query timeout
**Input**: "Test is timing out: __tests__/reports/dashboard.test.ts"
**Expected**:
- Identifies slow query (>10s)
- Suggests EXPLAIN ANALYZE
- Detects missing index
- Provides immediate fix (increase timeout)
- Provides proper fix (add index)

**Validation**:
- [ ] Root cause identified
- [ ] Two-tier solution (immediate + proper)
- [ ] SQL for index creation provided

### TEST-028: Debug Promise never resolves
**Input**: "Test hangs on async operation"
**Expected**:
- Identifies missing await
- Checks for error handling
- Suggests adding timeout guard

**Validation**:
- [ ] Common causes listed
- [ ] Code examples for fixes
- [ ] Timeout pattern provided

### TEST-029: Debug infinite loop
**Input**: "Test runs forever with high CPU"
**Expected**:
- Identifies loop pattern
- Suggests iteration limit
- Provides loop timeout pattern

**Validation**:
- [ ] Loop guard pattern shown
- [ ] Max iterations example
- [ ] Debugging tips (console.log)

### TEST-030: Debug external service call
**Input**: "Test hangs on API call to Stripe"
**Expected**:
- Identifies unmocked external service
- Recommends vi.mock()
- Shows mock example
- Suggests AbortSignal.timeout()

**Validation**:
- [ ] Mock pattern provided
- [ ] Timeout configuration shown
- [ ] Environment-aware mocking

---

## Feature 7: Mock Data Factory Generator (4 cases)

### TEST-031: Generate simple factory function
**Input**: "Create mock factory for Asset type"
**Expected**:
- Reads Asset type definition
- Generates createMockAsset() function
- Uses @faker-js/faker for realistic data
- Allows partial overrides

**Validation**:
- [ ] All required fields present
- [ ] Faker used for dynamic data
- [ ] Overrides parameter works
- [ ] Type-safe (returns Asset)

### TEST-032: Generate builder pattern factory
**Input**: "Create Asset builder with fluent API"
**Expected**:
- Generates AssetBuilder class
- Includes withXXX() methods
- Includes build() method
- Shows usage example

**Validation**:
- [ ] Fluent API (returns this)
- [ ] build() returns Asset
- [ ] Usage example clear

### TEST-033: Generate factory with relationships
**Input**: "Create Asset factory with tenant and user"
**Expected**:
- Generates createMockAssetWithRelations()
- Ensures tenant exists (ensureTenantHub)
- Ensures user exists (ensureUserHub)
- Links user to tenant
- Creates asset with relationships

**Validation**:
- [ ] All relationships created
- [ ] Idempotent helpers (ensure* functions)
- [ ] Returns all related entities
- [ ] Foreign keys satisfied

### TEST-034: Generate batch factory
**Input**: "Create factory to generate 10 assets at once"
**Expected**:
- Generates createMockAssetList(count)
- Supports function overrides for variability
- Returns array of entities

**Validation**:
- [ ] Count parameter works
- [ ] Override function supported
- [ ] Returns correct number

---

## Feature 8: Test Coverage Gap Analyzer (1 case)

### TEST-035: Analyze API route coverage
**Input**: "Find untested API routes"
**Expected**:
- Scans apps/web/app/api/ for route.ts files
- Checks for corresponding test files in __tests__/api/
- Runs coverage report (if available)
- Generates report:
  - Untested routes (0 tests)
  - Low coverage routes (<80%)
  - Well-tested routes (≥80%)
- Prioritizes missing tests
- Suggests specific test cases

**Validation**:
- [ ] All API routes found
- [ ] Test file existence checked
- [ ] Coverage percentages shown
- [ ] Prioritized recommendations
- [ ] Actionable suggestions

---

## Edge Cases & Error Handling (0 additional cases)

All edge cases covered within feature-specific tests above:
- Missing file paths (TEST-007)
- Invalid file paths (TEST-008)
- No auth routes (TEST-022)
- External service mocking (TEST-030)

---

## Quality Gate Validation

After all tests pass, validate against skill quality gates:

### Skill-Specific Quality Gates
- [ ] Test file created at correct path
- [ ] All imports valid and TypeScript compiles
- [ ] Test structure follows describe/it pattern
- [ ] Auth mocking included when needed
- [ ] Tenant scoping tested for multi-tenant routes
- [ ] Setup/teardown properly configured
- [ ] ≥3 test cases per feature (success, auth, error)
- [ ] Mock data uses factories
- [ ] Tests executable with `pnpm test`
- [ ] Coverage ≥80% for tested code
- [ ] No hard-coded values
- [ ] Appropriate timeout configuration
- [ ] Database cleanup prevents test pollution
- [ ] E2E tests use Page Object Model
- [ ] Generated code follows style guide

---

## Test Execution Summary

**Total Test Cases**: 35
**Features Covered**: 8/8 (100%)
**Coverage**:
- Activation: 3 cases
- Vitest Scaffolding: 5 cases
- Auth Mocking: 5 cases
- Database Management: 4 cases
- API Route Generation: 5 cases
- E2E Scaffolding: 4 cases
- Timeout Debugging: 4 cases
- Mock Factories: 4 cases
- Coverage Analysis: 1 case

**Expected Pass Rate**: 100% (35/35)

---

## Notes

1. **Real-world testing**: These test cases should be validated with actual usage in the Numonic codebase
2. **Iteration**: Cases may be refined based on production use
3. **Performance**: Test cases should complete in <5 seconds each for fast feedback
4. **Documentation**: Each failed test should provide clear error messages and remediation steps
5. **Maintenance**: Update test cases when skill features are added or modified

---

## References

- SKILL.md: Comprehensive skill instructions
- README.md: Usage examples and troubleshooting
- Templates: All 5 template files
- Data files: auth-mocking-patterns.json, timeout-patterns.json, common-selectors.json
