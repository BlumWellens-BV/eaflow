# Test: Edge Cases

This test verifies that the lint-format-auto-fixer skill handles edge cases and uncommon scenarios correctly.

## Test Objective

Ensure the skill handles complex, unusual, and error scenarios gracefully without breaking code or causing issues.

## Edge Case 1: Complex React Hook Violations

### Scenario
Multiple Hooks in nested inline functions with complex state

```typescript
const columns = [
  {
    cell: ({ row }) => {
      const data = useTypedSelector(state => state.data);
      const [editing, setEditing] = useState(false);
      const dispatch = useDispatch();

      useEffect(() => {
        dispatch(action());
      }, [dispatch]);

      return editing ? <Input /> : <Display />;
    }
  }
];
```

### Expected Behavior
- Extracts complete component with all Hooks
- Preserves all Hook dependencies
- Maintains component logic

### Success Criteria
- [ ] All Hooks moved to component
- [ ] State and effects work correctly
- [ ] No Hook dependency warnings
- [ ] Component renders correctly

---

## Edge Case 2: Console Statements in Mixed Context

### Scenario
File with both CLI and non-CLI code (e.g., utility used by both)

```typescript
// File: shared-util.ts
function util(debug: boolean) {
  if (debug) {
    console.log('Debug mode'); // Is this CLI or debug?
  }
}

// Used by both CLI and API
```

### Expected Behavior
- Asks user about context
- Offers both options: suppress or replace with logger
- Documents decision

### Success Criteria
- [ ] User prompted for context
- [ ] Both options explained
- [ ] Decision documented in code comment
- [ ] Fix applied correctly

---

## Edge Case 3: Unused Variable in Destructuring

### Scenario
```typescript
const { used, unused, alsoUnused } = object;
console.log(used);
```

### Expected Behavior
- Identifies unused destructured variables
- Prefixes with underscore or removes
- Preserves used variables

### Expected Fix
```typescript
const { used } = object; // Removed unused
// OR
const { used, _unused, _alsoUnused } = object; // Prefixed
```

### Success Criteria
- [ ] Unused variables handled
- [ ] Used variables preserved
- [ ] Destructuring still works
- [ ] No runtime errors

---

## Edge Case 4: JSX with Mixed Quote Styles

### Scenario
```tsx
<div>
  <p>User's "special" data isn't loading</p>
  <button title='Click "here" to see user&apos;s info'>OK</button>
</div>
```

### Expected Behavior
- Handles mixed single and double quotes
- Handles already-escaped entities
- Doesn't double-escape

### Expected Fix
```tsx
<div>
  <p>User&apos;s &quot;special&quot; data isn&apos;t loading</p>
  <button title="Click &quot;here&quot; to see user&apos;s info">OK</button>
</div>
```

### Success Criteria
- [ ] All quotes properly escaped
- [ ] No double-escaping
- [ ] Renders correctly
- [ ] Readable in code

---

## Edge Case 5: Type Error with Complex Generics

### Scenario
```typescript
function complexFunc<T extends object>(
  data: any,
  transformer: (item: any) => any
): any {
  return transformer(data);
}
```

### Expected Behavior
- Replaces all `any` while preserving generics
- Maintains type safety
- Keeps function flexible

### Expected Fix
```typescript
function complexFunc<T extends object, R>(
  data: T,
  transformer: (item: T) => R
): R {
  return transformer(data);
}
```

### Success Criteria
- [ ] All `any` replaced
- [ ] Generics preserved
- [ ] Type inference works
- [ ] Function still flexible

---

## Edge Case 6: File with 100+ Errors

### Scenario
Large file with many repeated errors (like 27 console.logs in commit f0fa8ae4)

### Expected Behavior
- Batches similar fixes
- Shows progress
- Doesn't timeout
- Completes successfully

### Success Criteria
- [ ] All errors fixed
- [ ] Completes in reasonable time (<10 min)
- [ ] Progress shown to user
- [ ] No partial fixes (all or nothing)

---

## Edge Case 7: Conflicting ESLint and Prettier

### Scenario
```typescript
// ESLint wants single quotes
const x = "double quotes";

// Prettier wants double quotes
const y = 'single quotes';
```

### Expected Behavior
- Runs ESLint first
- Then Prettier (overrides)
- Final result matches Prettier config

### Success Criteria
- [ ] No infinite loop of fixes
- [ ] Final output matches Prettier
- [ ] Both tools happy
- [ ] Explains execution order

---

## Edge Case 8: ESLint Cache Issues

### Scenario
Local lint passes but CI fails with same errors

### Expected Behavior
- Detects cache mismatch
- Suggests clearing cache
- Re-runs without cache
- Verifies fix

### Expected Commands
```bash
rm -rf node_modules/.cache
pnpm lint --no-cache
```

### Success Criteria
- [ ] Cache issue detected
- [ ] Clear cache suggested
- [ ] Re-run successful
- [ ] Error explained to user

---

## Edge Case 9: Pre-Commit Hook with Partial Staging

### Scenario
```bash
# Only some files staged
git add file1.ts
# file2.ts has errors but not staged
```

### Expected Behavior
- Only fixes staged files
- Warns about unstaged errors
- Doesn't break partial commits

### Success Criteria
- [ ] Only staged files fixed
- [ ] Unstaged files unchanged
- [ ] Warning shown
- [ ] Commit allowed to proceed

---

## Edge Case 10: Type Error in Third-Party Library

### Scenario
```typescript
import externalLib from 'some-library';

// Library has no types
const result: any = externalLib.doSomething();
```

### Expected Behavior
- Identifies third-party library
- Suggests creating type declaration
- Uses `unknown` with type assertion

### Expected Fix
```typescript
// Create types/some-library.d.ts
declare module 'some-library' {
  export interface Result {
    data: unknown;
  }
  export function doSomething(): Result;
}

// In code
const result = externalLib.doSomething();
```

### Success Criteria
- [ ] Type declaration suggested
- [ ] unknown used appropriately
- [ ] Type checking passes
- [ ] Runtime behavior unchanged

---

## Edge Case 11: React Hook in Conditionally Rendered Component

### Scenario
```typescript
const Component = ({ show }) => {
  if (!show) return null;

  const data = useHook(); // Hook after conditional return

  return <div>{data}</div>;
};
```

### Expected Behavior
- Identifies Hook rules violation
- Suggests moving Hook above conditional
- Explains Hook rules

### Expected Fix
```typescript
const Component = ({ show }) => {
  const data = useHook(); // Hook before conditional

  if (!show) return null;

  return <div>{data}</div>;
};
```

### Success Criteria
- [ ] Hook moved above conditional
- [ ] Hook rules satisfied
- [ ] Component logic preserved
- [ ] Explanation provided

---

## Edge Case 12: Circular Type Dependencies

### Scenario
```typescript
function a(data: any): any {
  return b(data);
}

function b(data: any): any {
  return a(data);
}
```

### Expected Behavior
- Detects circular dependency
- Suggests shared type
- Creates interface

### Expected Fix
```typescript
interface SharedData {
  value: unknown;
}

function a(data: SharedData): SharedData {
  return b(data);
}

function b(data: SharedData): SharedData {
  return a(data);
}
```

### Success Criteria
- [ ] Circular dependency handled
- [ ] Shared type created
- [ ] Both functions typed
- [ ] No infinite type recursion

---

## Edge Case 13: ESLint Config Not Found

### Scenario
Working in directory without .eslintrc

### Expected Behavior
- Detects missing config
- Suggests checking parent directories
- Verifies config location
- Provides path to config

### Success Criteria
- [ ] Missing config detected
- [ ] User informed
- [ ] Correct config path shown
- [ ] Workaround suggested

---

## Edge Case 14: Format After Git Merge Conflict

### Scenario
```typescript
<<<<<<< HEAD
const x = 'version 1';
=======
const x = 'version 2';
>>>>>>> branch
```

### Expected Behavior
- Detects merge conflict markers
- Refuses to auto-fix
- Instructs user to resolve conflict first
- Offers to help after resolution

### Success Criteria
- [ ] Merge conflict detected
- [ ] Auto-fix prevented
- [ ] Clear instructions given
- [ ] No corruption of conflict markers

---

## Edge Case 15: Very Long Lines in JSX

### Scenario
```tsx
<button title="This is a very long title that exceeds 80 characters and Prettier wants to wrap it but it contains quotes that need escaping">Click</button>
```

### Expected Behavior
- Escapes quotes first
- Then applies Prettier wrapping
- Maintains readability

### Expected Fix
```tsx
<button
  title="This is a very long title that exceeds 80 characters and Prettier wants to wrap it but it contains quotes that need escaping"
>
  Click
</button>
```

### Success Criteria
- [ ] Quotes escaped
- [ ] Line wrapped by Prettier
- [ ] Readable result
- [ ] Valid JSX

---

## Error Recovery Tests

### Test: Partial Fix Failure

**Scenario**: Fix succeeds for some errors but fails for others

**Expected**:
- Completes successful fixes
- Reports failed fixes
- Doesn't rollback successful fixes
- Explains what failed and why

### Test: ESLint Crash

**Scenario**: ESLint process crashes during execution

**Expected**:
- Detects crash
- Shows error message
- Suggests troubleshooting steps
- Doesn't leave files in broken state

### Test: Type Check Fails After Fix

**Scenario**: Auto-fix causes type errors

**Expected**:
- Detects type errors after fix
- Offers to rollback
- Explains what went wrong
- Suggests manual fix

---

## Overall Edge Case Success Criteria

- [ ] All 15 edge cases handled correctly
- [ ] No data loss or file corruption
- [ ] Clear error messages for all failures
- [ ] Graceful degradation (partial success > total failure)
- [ ] User always informed of what happened
- [ ] Rollback available when needed
- [ ] Edge cases documented for future reference

## Notes

- Edge cases based on real-world scenarios
- Test with actual codebase complexity
- Verify fixes don't introduce new issues
- Document any new edge cases discovered
- Update skill instructions if patterns emerge
