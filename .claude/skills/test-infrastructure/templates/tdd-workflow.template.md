# TDD Workflow Template

## Test-Driven Development (Red-Green-Refactor)

### Phase 1: RED - Write Failing Test

**Goal**: Define expected behavior through a failing test

```typescript
import { describe, it, expect } from 'vitest';
import { {FUNCTION_NAME} } from '@/{MODULE_PATH}';

describe('{FEATURE_NAME}', () => {
  it('{BEHAVIOR_DESCRIPTION}', async () => {
    // Arrange: Set up test data and context
    const {INPUT_VARIABLE} = {TEST_INPUT};

    // Act: Execute the function under test
    const result = await {FUNCTION_NAME}({INPUT_VARIABLE});

    // Assert: Verify expected behavior
    expect(result).{ASSERTION};
  });
});
```

**Expected Result**: ❌ Test fails because implementation doesn't exist yet

**Verification**:
```bash
pnpm test {TEST_FILE_PATH}
# Expected: FAIL - Cannot find module or function not implemented
```

---

### Phase 2: GREEN - Implement Minimal Code

**Goal**: Make the test pass with simplest possible implementation

```typescript
// {MODULE_PATH}/{FILE_NAME}.ts

export async function {FUNCTION_NAME}({PARAMETERS}): Promise<{RETURN_TYPE}> {
  // Minimal implementation to pass the test
  {MINIMAL_IMPLEMENTATION}
}
```

**Expected Result**: ✅ Test passes

**Verification**:
```bash
pnpm test {TEST_FILE_PATH}
# Expected: PASS - All tests passing
```

---

### Phase 3: REFACTOR - Improve Code Quality

**Goal**: Improve implementation while keeping tests green

**Refactoring Checklist**:
- [ ] Extract magic numbers/strings to constants
- [ ] Extract complex logic to helper functions
- [ ] Add descriptive variable names
- [ ] Remove duplication
- [ ] Add type safety improvements
- [ ] Add documentation/comments
- [ ] Optimize performance (if needed)

```typescript
// {MODULE_PATH}/{FILE_NAME}.ts

// After refactoring
const {CONSTANT_NAME} = {CONSTANT_VALUE};

export async function {FUNCTION_NAME}({PARAMETERS}): Promise<{RETURN_TYPE}> {
  // Refactored implementation
  {REFACTORED_IMPLEMENTATION}
}

// Helper function extracted
async function {HELPER_NAME}({HELPER_PARAMS}): Promise<{HELPER_RETURN}> {
  {HELPER_IMPLEMENTATION}
}
```

**Expected Result**: ✅ Tests still pass, code is cleaner

**Verification**:
```bash
pnpm test {TEST_FILE_PATH}
# Expected: PASS - All tests still passing
pnpm typecheck
# Expected: No type errors
pnpm lint
# Expected: No lint errors
```

---

## TDD Cycle Checklist

For each new feature/behavior:

### 1. RED Phase
- [ ] Write test describing expected behavior
- [ ] Ensure test fails for the right reason (not a syntax error)
- [ ] Verify error message makes sense
- [ ] Run test: `pnpm test {TEST_FILE}`
- [ ] Commit: `test: add failing test for {FEATURE}`

### 2. GREEN Phase
- [ ] Implement minimal code to pass test
- [ ] Run test to verify it passes
- [ ] Verify no other tests broke
- [ ] Run full test suite: `pnpm test`
- [ ] Commit: `feat: implement {FEATURE}`

### 3. REFACTOR Phase
- [ ] Improve code quality without changing behavior
- [ ] Run tests after each refactoring step
- [ ] Ensure all tests still pass
- [ ] Run type checking and linting
- [ ] Commit: `refactor: improve {ASPECT} in {MODULE}`

---

## Multi-Test TDD Pattern

When implementing complex features:

```typescript
describe('{FEATURE_NAME}', () => {
  // Test 1: Happy path
  it('succeeds with valid input', async () => {
    // RED → GREEN → REFACTOR
  });

  // Test 2: Edge case
  it('handles empty input', async () => {
    // RED → GREEN → REFACTOR
  });

  // Test 3: Error case
  it('throws error for invalid input', async () => {
    // RED → GREEN → REFACTOR
  });

  // Test 4: Security/authorization
  it('requires authentication', async () => {
    // RED → GREEN → REFACTOR
  });

  // Test 5: Tenant scoping (multi-tenant apps)
  it('only accesses data from same tenant', async () => {
    // RED → GREEN → REFACTOR
  });
});
```

**Pattern**: Write ONE test → Make it pass → Refactor → Next test

**Anti-pattern**: Write ALL tests at once (makes it hard to know which code fixes which test)

---

## TDD for API Routes

Example: Building a new API endpoint with TDD

```typescript
// Step 1: RED - Auth test
describe('POST /api/v1/assets', () => {
  it('returns 401 when unauthenticated', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/assets', {
      method: 'POST',
      body: JSON.stringify({ filename: 'test.jpg' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});

// Step 2: GREEN - Implement auth check
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // TODO: Implement rest of logic
}

// Step 3: REFACTOR - Extract auth middleware
// Move auth logic to reusable middleware

// Step 4: RED - Validation test
it('returns 400 when filename is missing', async () => {
  // ... auth setup
  const request = new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify({}), // Missing filename
  });

  const response = await POST(request);
  expect(response.status).toBe(400);
});

// Step 5: GREEN - Add validation
// Step 6: REFACTOR - Extract validation to Zod schema
// ... continue cycle
```

---

## TDD Benefits Achieved

✅ **Confidence**: Every line of code has a test proving it works
✅ **Design**: Writing tests first leads to better API design
✅ **Regression protection**: Tests prevent future breakage
✅ **Documentation**: Tests serve as usage examples
✅ **Faster debugging**: When test fails, you know exactly what broke
✅ **Refactoring safety**: Can improve code without fear

---

## Common TDD Pitfalls to Avoid

❌ **Writing implementation before test**: Defeats the purpose of TDD
❌ **Writing too many tests at once**: Makes it hard to track progress
❌ **Not running tests frequently**: Breaks the feedback loop
❌ **Testing implementation details**: Tests become brittle, hard to refactor
❌ **Skipping refactor phase**: Code becomes messy, hard to maintain
❌ **Not committing at each phase**: Lose ability to revert if needed

---

## TDD Time Estimates

- **RED phase**: 2-5 minutes (write test, verify it fails)
- **GREEN phase**: 5-15 minutes (minimal implementation)
- **REFACTOR phase**: 3-10 minutes (clean up code)
- **Total per test**: 10-30 minutes
- **First test takes longest**: Subsequent tests in same module are faster

**Productivity note**: TDD seems slower initially but saves 2-3× time in debugging, rework, and bug fixes later.
