# Test: Basic Usage

This test verifies that the lint-format-auto-fixer skill correctly handles common error patterns and applies fixes.

## Test Objective

Confirm that the skill can detect, categorize, and fix the most common linting errors in the codebase.

## Test Setup

Create a test file with intentional errors:

```typescript
// test-file.tsx
import React from 'react';
import { useTypedSelector } from '@/hooks';

interface TestRow {
  id: string;
  name: string;
}

// ERROR 1: React Hook in non-component
const columns = [
  {
    cell: ({ row }) => {
      const data = useTypedSelector(state => state.data); // Hook violation
      return <div>{data}</div>;
    }
  }
];

// ERROR 2: Console statement
console.log('Debug message');

// ERROR 3: Unused variable
const unusedVar = 'test';

// ERROR 4: JSX quote not escaped
const Component = () => (
  <div>
    <p>User's data</p>
    <button title="Click "here"">Submit</button>
  </div>
);

// ERROR 5: any type
function handler(data: any) {
  return data.field;
}
```

## Test Case 1: Error Detection

**Input**: "Fix ESLint errors in test-file.tsx"

**Expected Behavior**:
1. Runs `pnpm lint` or analyzes file
2. Identifies 5+ errors:
   - React Hook violation (line ~12)
   - Console statement (line ~18)
   - Unused variable (line ~21)
   - JSX quotes (lines ~25, ~26)
   - Type error (line ~31)

**Success Criteria**:
- [ ] All errors detected
- [ ] Errors categorized by type
- [ ] Line numbers identified
- [ ] Error messages clear

**Expected Output**:
```markdown
Found 5 errors in test-file.tsx:

1. React Hook violation (line 12)
   - Hook called in non-component function
2. Console statement (line 18)
   - Unexpected console statement
3. Unused variable (line 21)
   - 'unusedVar' assigned but never used
4. JSX quotes (lines 25, 26)
   - Unescaped quotes/apostrophes
5. Type error (line 31)
   - Unexpected any type
```

---

## Test Case 2: React Hook Violation Fix

**Input**: "Fix the React Hook error"

**Expected Behavior**:
1. Identifies Hook violation in cell renderer
2. Extracts cell as proper component
3. Adds TypeScript types
4. Updates column definition

**Expected Fix**:
```typescript
// Extracted component
function DataCell({ row }: { row: Row<TestRow> }) {
  const data = useTypedSelector(state => state.data);
  return <div>{data}</div>;
}

const columns = [
  {
    cell: ({ row }) => <DataCell row={row} />
  }
];
```

**Success Criteria**:
- [ ] Component extracted with proper name
- [ ] TypeScript types added
- [ ] Original code updated
- [ ] ESLint error resolved

---

## Test Case 3: Console Statement Fix

**Input**: "Fix console statement"

**Expected Behavior**:
1. Analyzes file type (test file)
2. Determines context (not CLI tool)
3. Recommends removing debug log

**Expected Fix**:
```typescript
// Removed: console.log('Debug message');

// Or if needed, use logger:
import { logger } from '@/lib/logger';
logger.debug('Debug message');
```

**Success Criteria**:
- [ ] Console statement removed or replaced with logger
- [ ] No ESLint error
- [ ] Explanation provided for fix choice

---

## Test Case 4: Unused Variable Fix

**Input**: "Fix unused variable error"

**Expected Behavior**:
1. Identifies unused variable
2. Recommends prefix with underscore
3. Applies fix

**Expected Fix**:
```typescript
const _unusedVar = 'test'; // Prefixed to signal intentional
```

**Success Criteria**:
- [ ] Variable prefixed with underscore
- [ ] ESLint error resolved
- [ ] Comment added explaining why

---

## Test Case 5: JSX Quote Escaping

**Input**: "Fix JSX quote errors"

**Expected Behavior**:
1. Finds all unescaped quotes
2. Replaces with HTML entities
3. Applies to all instances

**Expected Fix**:
```tsx
const Component = () => (
  <div>
    <p>User&apos;s data</p>
    <button title="Click &quot;here&quot;">Submit</button>
  </div>
);
```

**Success Criteria**:
- [ ] All quotes/apostrophes escaped
- [ ] Used &apos; and &quot; entities
- [ ] ESLint errors resolved
- [ ] Component still renders correctly

---

## Test Case 6: Type Error Fix

**Input**: "Fix the any type error"

**Expected Behavior**:
1. Identifies any type usage
2. Determines proper type (unknown or specific)
3. Adds type annotation

**Expected Fix**:
```typescript
// Option 1: Specific type if known
interface DataType {
  field: string;
}

function handler(data: DataType) {
  return data.field;
}

// Option 2: unknown if structure uncertain
function handler(data: unknown) {
  if (typeof data === 'object' && data !== null && 'field' in data) {
    return (data as { field: unknown }).field;
  }
  return undefined;
}
```

**Success Criteria**:
- [ ] any type replaced
- [ ] Type safety improved
- [ ] ESLint error resolved
- [ ] Type guards added if using unknown

---

## Test Case 7: Full Auto-Fix Workflow

**Input**: "Fix all ESLint errors in test-file.tsx"

**Expected Behavior**:
1. Detects all errors
2. Categorizes by type
3. Applies fixes in order:
   - Manual fixes (React Hook, console, types)
   - Auto-fix (imports)
   - Prettier formatting
4. Verifies all errors resolved

**Expected Process**:
```markdown
Step 1: Error Detection ✅
  Found: 5 errors

Step 2: Apply Fixes
  - React Hook: Extracted DataCell component
  - Console: Removed debug log
  - Unused var: Prefixed with _
  - JSX quotes: Replaced with entities
  - Type error: Added interface

Step 3: Auto-Fix ✅
  Ran: pnpm lint --fix

Step 4: Format ✅
  Ran: pnpm format

Step 5: Verify ✅
  Ran: pnpm lint
  Result: 0 errors
```

**Success Criteria**:
- [ ] All errors fixed
- [ ] No errors remaining
- [ ] File properly formatted
- [ ] Code still works correctly
- [ ] Types still valid

---

## Test Case 8: Pre-Commit Validation

**Input**: "Test pre-commit hook with fixed file"

**Expected Behavior**:
1. Stages fixed file
2. Runs pre-commit hook (dry run)
3. Verifies hook passes

**Expected Commands**:
```bash
git add test-file.tsx
git commit --dry-run
# Hook should pass ✅
```

**Success Criteria**:
- [ ] Pre-commit hook passes
- [ ] No lint errors
- [ ] No format errors
- [ ] Ready to commit

---

## Test Case 9: CI/CD Simulation

**Input**: "Verify file would pass CI/CD"

**Expected Behavior**:
1. Runs full lint suite
2. Runs type checking
3. Runs format check
4. All pass

**Expected Commands**:
```bash
pnpm lint         # Should pass ✅
pnpm typecheck    # Should pass ✅
pnpm format       # Should pass ✅
```

**Success Criteria**:
- [ ] All checks pass
- [ ] No warnings
- [ ] File ready for CI/CD
- [ ] No pipeline blockage

---

## Performance Test

**Input**: Multiple files with errors

**Expected Behavior**:
1. Batch processes similar errors
2. Completes in reasonable time
3. Reports progress

**Success Criteria**:
- [ ] Fixes applied in <5 minutes for 10 files
- [ ] Progress shown to user
- [ ] No manual intervention needed
- [ ] All files fixed correctly

---

## Integration Test

**Input**: "Fix linting errors and create commit"

**Expected Behavior**:
1. Fixes all errors
2. Stages files
3. Suggests using commit-message skill
4. Creates proper commit

**Success Criteria**:
- [ ] All errors fixed
- [ ] Files staged
- [ ] Commit message follows CLAUDE.md format
- [ ] Commit completes successfully

---

## Overall Success Criteria

- [ ] All 9 test cases pass
- [ ] No false positives (incorrect fixes)
- [ ] No false negatives (missed errors)
- [ ] No regressions (broken code after fixes)
- [ ] Performance acceptable (<5 min for typical use)
- [ ] Documentation accurate
- [ ] User experience smooth

## Notes

- Test with actual codebase files for realism
- Verify fixes match actual commit patterns (725ecd52, f0fa8ae4)
- Compare to manual fix time (should be 90% faster)
- Check integration with other skills (commit-message, work-tracking)
