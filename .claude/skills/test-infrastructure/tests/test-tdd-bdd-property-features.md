# Test Cases for TDD/BDD/Property-Based/Cross-Layer Features (v0.2.0)

## Test Activation

### Test 1: TDD Workflow Activation
**Input**: "Use test-driven development for new feature"
**Expected**: Skill activates Phase 0 (TDD Workflow)
**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 2: BDD/Scenario Activation
**Input**: "Create Given-When-Then test for user story"
**Expected**: Skill activates Phase 1.5 (BDD/Scenario Testing)
**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 3: Property-Based Testing Activation
**Input**: "Test with random inputs using fast-check"
**Expected**: Skill activates Phase 3.5 (Property-Based Testing)
**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 4: Cross-Layer Orchestration Activation
**Input**: "Ensure DB tests pass before API tests"
**Expected**: Skill activates Phase 7 (Cross-Layer Test Orchestration)
**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 5: Multiple Keywords Activation
**Input**: "Red-Green-Refactor cycle for new API route"
**Expected**: Skill activates with TDD workflow
**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Test TDD Workflow (Phase 0)

### Test 6: RED Phase - Generate Failing Test
**Scenario**: User requests "Write test-first for slugify function"
**Expected Behavior**:
1. Asks user for expected behavior, inputs/outputs, module path
2. Generates failing test with Arrange-Act-Assert structure
3. Provides command to run test: `pnpm test {TEST_FILE}`
4. Confirms test fails for right reason (not syntax error)

**Validation**:
- [ ] Test file created at correct path
- [ ] Test has proper describe/it structure
- [ ] Test imports function that doesn't exist yet
- [ ] Checkpoint: User confirms test fails

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 7: GREEN Phase - Minimal Implementation
**Scenario**: After RED phase, implement minimal code
**Expected Behavior**:
1. Creates minimal implementation file
2. Function passes the failing test
3. Provides command to verify: `pnpm test {TEST_FILE}`
4. Confirms test passes

**Validation**:
- [ ] Implementation file created
- [ ] Function exported correctly
- [ ] Test passes (GREEN)
- [ ] Checkpoint: User confirms test passes

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 8: REFACTOR Phase - Improve Code Quality
**Scenario**: After GREEN phase, refactor implementation
**Expected Behavior**:
1. Provides refactoring checklist
2. Suggests improvements (extract constants, helpers, etc.)
3. Runs tests after each refactoring step
4. Confirms tests still pass

**Validation**:
- [ ] Refactoring checklist presented
- [ ] Suggests specific improvements
- [ ] Tests verified to still pass
- [ ] Checkpoint: Code cleaner, tests still green

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 9: TDD Commit Points
**Scenario**: User completes TDD cycle
**Expected Behavior**:
1. Recommends commit after RED: `test: add failing test for {FEATURE}`
2. Recommends commit after GREEN: `feat: implement {FEATURE}`
3. Recommends commit after REFACTOR: `refactor: improve {ASPECT} in {MODULE}`

**Validation**:
- [ ] Three distinct commit recommendations
- [ ] Proper conventional commit format
- [ ] Descriptive commit messages

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 10: Multi-Test TDD Pattern
**Scenario**: Complex feature with 5 test cases
**Expected Behavior**:
1. Guides user through ONE test at a time
2. RED → GREEN → REFACTOR for test 1
3. Then moves to test 2 (not all tests at once)
4. Suggests test order: happy path → edge case → error → auth → tenant

**Validation**:
- [ ] Sequential test guidance (one at a time)
- [ ] Proper test ordering suggested
- [ ] Warns against writing all tests at once

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 11: TDD Anti-Pattern Detection
**Scenario**: User tries to write implementation before test
**Expected Behavior**:
1. Warns user: "❌ Write implementation before test"
2. Suggests writing test first
3. Explains TDD benefits

**Validation**:
- [ ] Detects anti-pattern
- [ ] Provides warning
- [ ] Suggests correct approach

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Test BDD/Scenario Testing (Phase 1.5)

### Test 12: User Story Identification
**Scenario**: User requests "BDD test for asset upload"
**Expected Behavior**:
1. Asks: Who is the user? (role)
2. Asks: What do they want to do? (action)
3. Asks: Why do they want to do it? (benefit)
4. Formats as: "As a {ROLE} I want to {ACTION} So that {BENEFIT}"

**Validation**:
- [ ] Three questions asked
- [ ] User story formatted correctly
- [ ] Clear and descriptive

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 13: Given-When-Then Structure
**Scenario**: Generate BDD test from user story
**Expected Behavior**:
1. Creates test with Given-When-Then structure
2. Uses domain language (not technical jargon)
3. Focuses on behavior, not implementation

**Example**:
```typescript
it('Scenario: User uploads valid image', async () => {
  // Given: I am authenticated with a tenant
  // When: I upload the image through the API
  // Then: The upload should succeed
});
```

**Validation**:
- [ ] Given section: Initial context setup
- [ ] When section: Action performed
- [ ] Then section: Expected outcome assertions
- [ ] Domain language used (no technical jargon)

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 14: Multiple Scenarios
**Scenario**: Comprehensive BDD test coverage
**Expected Behavior**:
1. Generates multiple scenarios:
   - Happy path (success)
   - Error path (failure)
   - Security (unauthorized)
   - Edge case (boundary)
   - Multi-tenant (isolation)

**Validation**:
- [ ] At least 3 scenarios generated
- [ ] Covers happy path and error cases
- [ ] Includes security/tenant scenarios (if applicable)

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 15: BDD Language Guidelines
**Scenario**: Ensure proper BDD language
**Expected Behavior**:
1. Uses user perspective language
2. ✅ "User uploads an image" (not "POST /api/v1/assets")
3. ✅ "I am authenticated as user A" (not "mockAuth returns true")
4. ✅ "Asset visible in gallery" (not "database has 1 row")

**Validation**:
- [ ] Domain language (not technical)
- [ ] User perspective (not system perspective)
- [ ] Behavior focus (not implementation)

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Test Property-Based Testing (Phase 3.5)

### Test 16: Property Identification
**Scenario**: User requests "Property-based test for slugify"
**Expected Behavior**:
1. Asks which type of property:
   - Mathematical (idempotence, inverse, commutativity)
   - Invariant (length preserved, never negative)
   - Domain constraint (valid/invalid inputs)
   - Oracle (matches reference)
2. User selects "Idempotence"
3. Generates test: slugify(slugify(x)) == slugify(x)

**Validation**:
- [ ] Four property types presented
- [ ] Clear explanation of each type
- [ ] Generates correct property test

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 17: Fast-Check Generator Selection
**Scenario**: Generate property test with appropriate generator
**Expected Behavior**:
1. Identifies input type (string, integer, object, etc.)
2. Suggests appropriate generator:
   - `fc.string()` for strings
   - `fc.integer()` for integers
   - `fc.emailAddress()` for emails
   - Custom generators for domain types
3. Generates test with proper generator

**Validation**:
- [ ] Correct generator suggested
- [ ] Custom generators for domain types (tenant_id, asset, etc.)
- [ ] Test uses proper generator

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 18: Test Run Configuration
**Scenario**: Configure test runs based on criticality
**Expected Behavior**:
1. Asks function criticality:
   - Standard: 100 runs
   - Security-critical: 1000 runs
   - Performance-sensitive: 50 runs
2. Configures `fc.assert()` with appropriate `numRuns`
3. Adds seed for reproducibility (optional)

**Validation**:
- [ ] Appropriate numRuns based on criticality
- [ ] Seed configuration available
- [ ] Verbose mode for debugging

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 19: When to Use Property-Based Testing
**Scenario**: User unsure if property-based testing is appropriate
**Expected Behavior**:
1. Provides guidance:
   - ✅ Use when: Mathematical properties, invariants, domain constraints
   - ❌ Don't use when: No clear property, random behavior, external side effects
2. Suggests example-based + property-based combination

**Validation**:
- [ ] Clear use case guidance
- [ ] Anti-patterns identified
- [ ] Suggests combining both approaches

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 20: Property Test Failure Debugging
**Scenario**: Property test fails, need counterexample
**Expected Behavior**:
1. fast-check shows counterexample (input that broke property)
2. Skill helps debug:
   - Shows failing input
   - Explains why property failed
   - Suggests fix (implementation or property definition)

**Validation**:
- [ ] Counterexample displayed
- [ ] Failure explanation provided
- [ ] Fix suggestions offered

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Test Cross-Layer Orchestration (Phase 7)

### Test 21: Layer Dependency Identification
**Scenario**: User implementing feature across multiple layers
**Expected Behavior**:
1. Identifies 4 layers:
   - Layer 1: Database (PostgreSQL)
   - Layer 2: Business Logic
   - Layer 3: API Routes (Next.js)
   - Layer 4: Frontend (React/UI)
2. Explains bottom-up testing order (Layer 1 → 2 → 3 → 4)
3. Rationale: Upper layers depend on lower layers

**Validation**:
- [ ] All 4 layers identified
- [ ] Bottom-up order explained
- [ ] Dependency rationale clear

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 22: Layer 1 (Database) Test Gate
**Scenario**: User starts with database layer
**Expected Behavior**:
1. Creates pgTAP tests:
   - Schema tests (tables, columns, indexes)
   - Function tests (ensure_*_hub)
   - RLS policy tests (tenant isolation)
2. Runs: `pnpm supabase test db`
3. **GATE**: Must pass before Layer 2
4. Warns if user tries to proceed without passing

**Validation**:
- [ ] pgTAP test examples provided
- [ ] Test command given
- [ ] Gate enforcement (cannot proceed if tests fail)

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 23: Layer 2 (Business Logic) Test Gate
**Scenario**: Database tests pass, move to business logic
**Expected Behavior**:
1. Creates unit tests for core logic:
   - Pure functions (no I/O)
   - Validation logic
   - Edge cases
2. Runs: `pnpm test __tests__/lib`
3. **GATE**: Must pass before Layer 3

**Validation**:
- [ ] Unit test examples provided
- [ ] No database dependencies enforced
- [ ] Gate enforcement

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 24: Layer 3 (API) Test Gate
**Scenario**: Business logic tests pass, move to API
**Expected Behavior**:
1. Creates integration tests:
   - Auth tests (401)
   - Authorization tests (403)
   - Tenant scoping tests
   - Success tests (200/201)
   - Error tests (400/404/500)
2. Runs: `pnpm test __tests__/api`
3. **GATE**: Must pass before Layer 4

**Validation**:
- [ ] Integration test examples provided
- [ ] All test categories covered
- [ ] ≥80% coverage requirement
- [ ] Gate enforcement

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 25: Layer 4 (Frontend) E2E Tests
**Scenario**: API tests pass, move to frontend
**Expected Behavior**:
1. Creates E2E tests:
   - Full stack integration (Layer 4 → 3 → 2 → 1)
   - User workflows
   - Tenant isolation in UI
2. Runs: `pnpm test:e2e`
3. **FEATURE COMPLETE** ✅

**Validation**:
- [ ] E2E test examples provided
- [ ] Full stack integration tested
- [ ] Feature completion confirmed

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 26: Failure Recovery - Layer 1 Fails
**Scenario**: Database tests fail
**Expected Behavior**:
1. **STOP**: Do not proceed to Layers 2, 3, or 4
2. Provides failure recovery steps:
   - Check migration syntax
   - Verify RLS policies
   - Check function definitions
3. Re-run: `pnpm supabase test db`

**Validation**:
- [ ] Blocks progression to upper layers
- [ ] Recovery steps provided
- [ ] Re-run command given

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 27: Failure Recovery - Layer 4 (E2E) Fails
**Scenario**: E2E test fails
**Expected Behavior**:
1. Diagnoses which layer caused failure:
   - Check browser console (Layer 4 issue)
   - Check network tab (Layer 3 issue)
   - Check API logs (Layer 1 or 2 issue)
2. Suggests fixing the failing layer
3. Re-run lower layer tests to verify they still pass

**Validation**:
- [ ] Diagnosis workflow provided
- [ ] Layer-specific debugging steps
- [ ] Lower layer re-validation suggested

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 28: TDD + Cross-Layer Combined Strategy
**Scenario**: User wants TDD across all layers
**Expected Behavior**:
1. Combines TDD (Red-Green-Refactor) with cross-layer orchestration
2. Layer 1: Write pgTAP test (RED) → Migration (GREEN) → Refactor → Gate ✅
3. Layer 2: Write unit test (RED) → Implement (GREEN) → Refactor → Gate ✅
4. Layer 3: Write integration test (RED) → Implement (GREEN) → Refactor → Gate ✅
5. Layer 4: Write E2E test (RED) → Implement (GREEN) → Refactor → Gate ✅

**Validation**:
- [ ] TDD applied at each layer
- [ ] Gates enforced between layers
- [ ] Feature complete with all tests passing

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Test Cross-Feature Integration

### Test 29: TDD + BDD Combined
**Scenario**: User wants "TDD with Given-When-Then scenarios"
**Expected Behavior**:
1. Combines Phase 0 (TDD) with Phase 1.5 (BDD)
2. RED: Write BDD scenario test (fails)
3. GREEN: Implement to pass scenario
4. REFACTOR: Clean up code

**Validation**:
- [ ] BDD scenario structure in TDD workflow
- [ ] RED-GREEN-REFACTOR cycle maintained
- [ ] User story documented

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 30: Property-Based + Cross-Layer
**Scenario**: User wants "Property tests across all layers"
**Expected Behavior**:
1. Layer 2 (Business Logic): Property-based unit tests
2. Layer 3 (API): Property-based integration tests (random valid/invalid inputs)
3. Gates enforced between layers

**Validation**:
- [ ] Property tests at appropriate layers
- [ ] Cross-layer orchestration maintained
- [ ] Gates enforced

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Test Template Quality

### Test 31: TDD Workflow Template Completeness
**File**: `templates/tdd-workflow.template.md`
**Expected Content**:
- [ ] RED-GREEN-REFACTOR phases clearly defined
- [ ] Code examples for each phase
- [ ] Multi-test TDD pattern
- [ ] API route TDD example
- [ ] Common pitfalls section
- [ ] TDD benefits section

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 32: BDD Scenario Template Completeness
**File**: `templates/bdd-scenario-test.template.ts`
**Expected Content**:
- [ ] Given-When-Then structure
- [ ] Multiple scenario examples (happy path, error, security, edge)
- [ ] BDD helper function
- [ ] Asset upload feature example
- [ ] Tenant isolation scenario
- [ ] BDD best practices

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 33: Property-Based Template Completeness
**File**: `templates/property-based-test.template.ts`
**Expected Content**:
- [ ] fast-check integration examples
- [ ] All property types (idempotence, inverse, commutativity, invariant)
- [ ] Custom arbitrary generators
- [ ] Configuration examples (numRuns, seed, verbose)
- [ ] When to use / not use guidance
- [ ] Common fast-check generators reference

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

### Test 34: Cross-Layer Template Completeness
**File**: `templates/cross-layer-test-orchestration.template.md`
**Expected Content**:
- [ ] 4-layer architecture diagram
- [ ] Layer-by-layer test strategies
- [ ] Test gates and checkpoints
- [ ] Failure recovery workflows
- [ ] TDD + Cross-Layer combined example
- [ ] Full feature implementation example

**Result**: ⬜ Not tested | ✅ Pass | ❌ Fail

---

## Summary

**Total Test Cases**: 34

**Coverage**:
- TDD Workflow (Phase 0): 6 tests
- BDD/Scenario Testing (Phase 1.5): 4 tests
- Property-Based Testing (Phase 3.5): 5 tests
- Cross-Layer Orchestration (Phase 7): 8 tests
- Cross-Feature Integration: 2 tests
- Activation: 5 tests
- Template Quality: 4 tests

**Test Status**:
- ⬜ Not tested: 34
- ✅ Pass: 0
- ❌ Fail: 0

**Next Steps**:
1. Execute tests during real usage
2. Mark tests as ✅ or ❌ based on results
3. Fix any failures
4. Add new tests as edge cases discovered
