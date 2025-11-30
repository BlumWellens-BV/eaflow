---
name: test-infrastructure
description: Comprehensive test automation with TDD/BDD workflows, Vitest unit tests, and Playwright E2E tests. Enforces Red-Green-Refactor discipline. Use for test scaffolding, mock data factories, timeout debugging, and coverage analysis.
version: 1.0.0
status: production

# Integration
component: shared
work-type: INFRASTRUCTURE

# Capabilities
allowed-tools: Read, Write, Edit, Bash, Glob, Grep

# Dependencies
depends-on: []
conflicts-with: []

# Maintenance
author: EAFlow Team
maintainer: eaflow@blumwellens.be
created: 2025-01-15
updated: 2025-01-15
github-issue: "N/A"
---

# Test Infrastructure Helper

## Purpose

Provides production-ready test scaffolding, mock data factories, timeout debugging, and TDD/BDD workflows for EAFlow. Reduces test-related commits by 70% through consistent patterns.

**Problem Solved**: Test infrastructure fragility and repetitive test setup. Developers spend time on Vitest configuration, mock creation, and debugging instead of writing meaningful tests.

## When to Use

Activate this skill when you need to:

- **TDD Workflow**: "Use test-driven development", "Write failing test first", "Red-Green-Refactor"
- **BDD/Scenario Testing**: "Create Given-When-Then test", "Behavior-driven test"
- **Create Vitest test file**: "Create test for element validation"
- **Scaffold E2E test**: "Create Playwright test for canvas interaction"
- **Debug test timeout**: "Why is my test timing out?"
- **Generate mock data**: "Create type-safe factory for Element entities"
- **Find coverage gaps**: "Which modules are untested?"

**Trigger keywords**: TDD, test-driven, Red-Green-Refactor, BDD, Given-When-Then, test scaffolding, create test, vitest test, playwright test, mock data factory, test coverage, E2E test

## Instructions

### Phase 1: TDD Workflow (Red-Green-Refactor)

1. **RED Phase: Write Failing Test**

   ```typescript
   import { describe, it, expect } from 'vitest';
   import { validateElement } from '@/lib/validation';

   describe('validateElement', () => {
     it('rejects element without name', async () => {
       // Arrange
       const element = { type: 'archimate:BusinessActor' };

       // Act
       const result = validateElement(element);

       // Assert
       expect(result.success).toBe(false);
     });
   });
   ```

   Run test to verify it fails:
   ```bash
   pnpm test src/lib/__tests__/validation.test.ts
   # Expected: ❌ FAIL
   ```

2. **GREEN Phase: Implement Minimal Code**

   ```typescript
   export function validateElement(element: unknown): ValidationResult {
     if (!element || typeof element !== 'object') {
       return { success: false, error: 'Invalid element' };
     }
     if (!('name' in element) || !element.name) {
       return { success: false, error: 'Element must have a name' };
     }
     return { success: true };
   }
   ```

   Run test to verify it passes:
   ```bash
   pnpm test src/lib/__tests__/validation.test.ts
   # Expected: ✅ PASS
   ```

3. **REFACTOR Phase: Improve Code Quality**

   Checklist:
   - [ ] Extract magic strings to constants
   - [ ] Add descriptive variable names
   - [ ] Remove duplication
   - [ ] Add type safety

   Run tests after each refactoring step.

4. **TDD Commit Points**
   - RED: `test: add failing test for {feature}`
   - GREEN: `feat: implement {feature}`
   - REFACTOR: `refactor: improve {aspect}`

### Phase 2: Vitest Test Scaffolding

5. **Identify Test Type**

   | Test Type | Location | Purpose |
   |-----------|----------|---------|
   | Unit | `src/**/__tests__/*.test.ts` | Pure functions, utilities |
   | Integration | `src/**/__tests__/*.integration.test.ts` | Store interactions |
   | Component | `src/**/__tests__/*.test.tsx` | React components |

6. **Generate Unit Test Template**

   ```typescript
   import { describe, it, expect, beforeEach, vi } from 'vitest';
   import { functionUnderTest } from '../module';

   describe('functionUnderTest', () => {
     beforeEach(() => {
       vi.clearAllMocks();
     });

     describe('success cases', () => {
       it('handles valid input correctly', () => {
         // Arrange
         const input = { /* valid input */ };

         // Act
         const result = functionUnderTest(input);

         // Assert
         expect(result).toEqual({ /* expected output */ });
       });
     });

     describe('error cases', () => {
       it('throws on invalid input', () => {
         // Arrange
         const input = null;

         // Act & Assert
         expect(() => functionUnderTest(input)).toThrow();
       });
     });

     describe('edge cases', () => {
       it('handles empty input', () => {
         const result = functionUnderTest({});
         expect(result).toBeDefined();
       });
     });
   });
   ```

7. **Generate Zustand Store Test Template**

   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest';
   import { useModelStore } from '@/store/model-store';

   describe('useModelStore', () => {
     beforeEach(() => {
       // Reset store to initial state
       useModelStore.setState(useModelStore.getInitialState());
     });

     it('adds element to repository', () => {
       const element = {
         id: 'elem-123',
         type: 'archimate:BusinessActor',
         name: 'Test Actor',
       };

       useModelStore.getState().addElement(element);

       expect(useModelStore.getState().elements).toContainEqual(element);
     });

     it('removes element from repository', () => {
       // Setup
       useModelStore.setState({
         elements: [{ id: 'elem-123', type: 'archimate:BusinessActor', name: 'Test' }],
       });

       // Act
       useModelStore.getState().removeElement('elem-123');

       // Assert
       expect(useModelStore.getState().elements).toHaveLength(0);
     });
   });
   ```

### Phase 3: BDD Scenario Testing

8. **Create Given-When-Then Structure**

   ```typescript
   describe('Feature: Element Creation', () => {
     /**
      * Scenario: User creates a new business actor
      *
      * As an enterprise architect
      * I want to create a business actor
      * So that I can model organizational roles
      */
     it('Scenario: Create business actor', async () => {
       // Given: An empty model repository
       const store = useModelStore.getState();
       expect(store.elements).toHaveLength(0);

       // When: User creates a business actor
       store.addElement({
         id: 'elem-001',
         type: 'archimate:BusinessActor',
         name: 'Project Manager',
       });

       // Then: The actor appears in the repository
       expect(store.elements).toHaveLength(1);
       expect(store.elements[0].name).toBe('Project Manager');
     });
   });
   ```

### Phase 4: E2E Testing (Playwright)

9. **Create Playwright E2E Test**

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Canvas Interaction', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/');
     });

     test('creates element on canvas drag', async ({ page }) => {
       // Drag element from palette to canvas
       const palette = page.locator('[data-testid="element-palette"]');
       const canvas = page.locator('[data-testid="canvas"]');

       await palette.locator('[data-element="BusinessActor"]').dragTo(canvas);

       // Verify element appears
       await expect(page.locator('[data-testid="canvas-node"]')).toBeVisible();
     });

     test('selects element on click', async ({ page }) => {
       // Setup: Create element first
       // ...

       // Click on element
       await page.locator('[data-testid="canvas-node"]').click();

       // Verify selection
       await expect(page.locator('[data-testid="canvas-node"]')).toHaveClass(/selected/);
     });
   });
   ```

10. **E2E Test Best Practices**

    - Use `data-testid` attributes for stable selectors
    - Wait for elements before interacting
    - Take screenshots on failure
    - Use Page Object Model for complex flows

### Phase 5: Mock Data Factories

11. **Generate Type-Safe Factory**

    ```typescript
    import { faker } from '@faker-js/faker';
    import type { Element, Relationship } from '@/types';

    export function createMockElement(overrides?: Partial<Element>): Element {
      return {
        id: `elem-${faker.string.nanoid(8)}`,
        type: 'archimate:BusinessActor',
        name: faker.person.jobTitle(),
        documentation: faker.lorem.sentence(),
        properties: {},
        tags: [],
        ...overrides,
      };
    }

    export function createMockRelationship(
      sourceId: string,
      targetId: string,
      overrides?: Partial<Relationship>
    ): Relationship {
      return {
        id: `rel-${faker.string.nanoid(8)}`,
        type: 'archimate:Association',
        sourceId,
        targetId,
        name: '',
        ...overrides,
      };
    }

    // Builder pattern for complex scenarios
    export class ElementBuilder {
      private element: Partial<Element> = {};

      withType(type: string) {
        this.element.type = type;
        return this;
      }

      withName(name: string) {
        this.element.name = name;
        return this;
      }

      build(): Element {
        return createMockElement(this.element);
      }
    }
    ```

### Phase 6: Debugging & Coverage

12. **Debug Test Timeouts**

    Common causes:
    | Pattern | Cause | Solution |
    |---------|-------|----------|
    | Promise never resolves | Missing await | Add await |
    | Infinite loop | Logic error | Add timeout guards |
    | External service | Network request | Mock service |

    ```typescript
    // Add timeout to specific test
    it('slow operation', async () => {
      // ... test code
    }, { timeout: 30000 });
    ```

13. **Run Coverage Analysis**

    ```bash
    pnpm test --coverage
    ```

    Coverage report shows:
    - Statements covered
    - Branches covered
    - Functions covered
    - Lines covered

## Examples

**Example 1: TDD for Validation Function**

```
User: "Create test for element name validation using TDD"

Claude (using test-infrastructure):
1. RED: Creates failing test
   - Test expects validation to reject empty names
   - Runs test → FAIL (function doesn't exist)

2. GREEN: Implements minimal validation
   - Creates validateElementName function
   - Returns false for empty strings
   - Runs test → PASS

3. REFACTOR: Improves implementation
   - Extracts error messages to constants
   - Adds TypeScript types
   - Runs test → Still PASS

Result: Clean, tested validation function
```

**Example 2: E2E Test for Canvas**

```
User: "Create Playwright test for canvas element creation"

Claude (using test-infrastructure):
1. Creates e2e/canvas-creation.spec.ts

2. Writes test structure:
   - beforeEach: Navigate to app
   - Test: Drag from palette to canvas
   - Assert: Element visible on canvas

3. Adds Page Object for reuse:
   - CanvasPage class with drag/select helpers

Result: E2E test ready to run with pnpm test:e2e
```

## Quality Gates

- [ ] Test file at correct path
- [ ] All imports valid
- [ ] describe/it pattern used
- [ ] At least 3 test cases: success, error, edge
- [ ] Mock data uses factories
- [ ] Tests can run without errors
- [ ] Coverage ≥80% for tested code

## Error Handling

### Error: Test File Has Type Errors

**Solution**: Check imports and mock types:
```typescript
import type { Element } from '@/types';
const mockElement: Element = createMockElement();
```

### Error: Test Timeout

**Solution**: Add explicit timeout or mock slow operations:
```typescript
it('slow test', async () => { /* ... */ }, { timeout: 10000 });
```

## Performance Considerations

### Token Usage
- **Activation**: ~3000 tokens
- **Per test generation**: ~2000-4000 tokens

### Execution Time
- **Test file generation**: 5-10 seconds
- **Coverage analysis**: 10-15 seconds

## Related Skills

### Composes Well With
- **lint-format-auto-fixer**: Fix ESLint errors in generated tests
- **typescript-type-safety-enforcer**: Ensure type safety in tests
- **commit-message**: Format test commits

## Best Practices

1. **Start with failing test**: Always write test before implementation
2. **Use factories for mock data**: Ensures consistency and type safety
3. **Test error cases first**: Easier to write, reveals API design issues
4. **Keep test data minimal**: Use smallest dataset that validates behavior
5. **Use data-testid in components**: More stable than CSS selectors
6. **Run tests before pushing**: Catch failures early

## Maintenance

### Updating This Skill
1. Add new test patterns as they emerge
2. Update templates based on project conventions
3. Increment version following semver

### Known Issues
- **Version 1.0.0**: Initial release for EAFlow
