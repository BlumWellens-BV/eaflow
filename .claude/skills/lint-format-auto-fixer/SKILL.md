---
name: lint-format-auto-fixer
description: Automatically fixes common ESLint errors, Prettier formatting issues, and UI consistency problems. Handles React Hook violations, console statements, unused variables, JSX quote escaping, Tailwind class ordering, and type errors. Use when ESLint blocks CI/CD, pre-commit fails, Prettier conflicts occur, or UI styling inconsistencies arise.
version: 1.0.0
status: production

# Integration
component: shared
work-type: INFRASTRUCTURE

# Capabilities
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]

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

# Lint & Format Auto-Fixer

## Purpose

Eliminates repetitive linting, formatting, and UI consistency commits. This skill automatically detects and fixes common ESLint violations (React Hook rules, console statements, unused variables, JSX escaping, type errors), Prettier formatting conflicts, and UI consistency issues (Tailwind class ordering) that block CI/CD pipelines.

**Problem Solved**: Eliminate 95% of linting/formatting commits, saving developer time and preventing CI/CD pipeline blockages.

## When to Use

Activate this skill when you encounter:

- **ESLint errors blocking CI/CD**: "Fix ESLint errors in my code"
- **Pre-commit hook failures**: "Pre-commit failed with lint errors"
- **Prettier formatting conflicts**: "Fix Prettier formatting issues"
- **React Hook violations**: "React Hook called in non-component function"
- **Console statement warnings**: "Remove console statements"
- **Unused variable errors**: "Fix unused variable errors"
- **Type errors**: "Fix no-explicit-any errors"
- **Tailwind class ordering**: "Order Tailwind classes consistently"

**Trigger keywords**: fix lint, fix eslint, fix prettier, auto-fix formatting, pre-commit failed, CI lint errors, unused variable, console statement, react hook error, jsx quote, type error, tailwind classes

## Instructions

### Phase 1: Error Detection & Analysis

1. **Run ESLint to Identify Errors**
   ```bash
   pnpm lint
   ```
   Common patterns:
   - `React Hook "X" is called in function "Y" that is neither a React function component nor a custom React Hook`
   - `Unexpected console statement (no-console)`
   - `'X' is assigned a value but never used (@typescript-eslint/no-unused-vars)`
   - `"X" can be escaped with "&quot;" (react/no-unescaped-entities)`
   - `Unexpected any. Specify a different type (@typescript-eslint/no-explicit-any)`

2. **Categorize Errors by Fix Strategy**
   - **React Hook violations**: Extract proper component
   - **Console statements**: Remove for production code
   - **Unused variables**: Prefix with underscore `_`
   - **JSX quotes**: Replace with HTML entities
   - **Type errors**: Replace `any` with specific types or `unknown`

3. **Check Prettier Conflicts**
   ```bash
   pnpm format
   ```

### Phase 2: Auto-Fix Common Errors

4. **Fix React Hook Violations**
   ```typescript
   // ❌ BEFORE (Error)
   const columns = [
     {
       id: 'element',
       cell: ({ row }) => {
         const selected = useStore(state => state.selected);
         return <div>{selected}</div>;
       }
     }
   ];

   // ✅ AFTER (Fixed)
   function ElementCell({ row }: { row: Row<ElementRow> }) {
     const selected = useStore(state => state.selected);
     return <div>{selected}</div>;
   }

   const columns = [
     {
       id: 'element',
       cell: ({ row }) => <ElementCell row={row} />
     }
   ];
   ```

5. **Fix Console Statement Warnings**
   ```typescript
   // ❌ BEFORE (Debug statement)
   console.log('Processing element:', element);

   // ✅ AFTER (Removed or use proper logging)
   // Remove debug logs entirely for production
   ```

6. **Fix Unused Variable Errors**
   ```typescript
   // ❌ BEFORE (Error)
   const result = await processElement();
   // Variable never used

   // ✅ AFTER (Fixed)
   const _result = await processElement();
   // Underscore prefix signals intentionally unused
   ```

7. **Fix JSX Quote Escaping**
   ```tsx
   // ❌ BEFORE (Error)
   <p>The element's data won't load.</p>

   // ✅ AFTER (Fixed)
   <p>The element&apos;s data won&apos;t load.</p>
   ```

8. **Fix Type Errors (no-explicit-any)**
   ```typescript
   // ❌ BEFORE (Error)
   function processElement(element: any) {
     return element?.name;
   }

   // ✅ AFTER (Fixed)
   function processElement(element: unknown) {
     if (typeof element === 'object' && element !== null && 'name' in element) {
       return (element as { name?: string }).name;
     }
     return undefined;
   }
   ```

9. **Run Auto-Fix for Import Organization**
   ```bash
   pnpm lint --fix
   ```

### Phase 3: Tailwind & Formatting

10. **Apply Tailwind Class Ordering**
    ```bash
    pnpm format
    ```

    **Tailwind Class Order Convention**:
    1. Layout (flex, grid, block)
    2. Positioning (relative, absolute)
    3. Spacing (p-, m-, gap-)
    4. Sizing (w-, h-, min-, max-)
    5. Colors (bg-, text-, border-)
    6. Typography (text-, font-)
    7. Borders (border, rounded)
    8. Effects (shadow, opacity, hover:, focus:)

11. **Apply Prettier Formatting**
    ```bash
    pnpm format
    ```

### Phase 4: Validation

12. **Run Full Lint Suite**
    ```bash
    pnpm lint
    pnpm format
    ```

13. **Test Pre-Commit Hook**
    ```bash
    git add .
    git commit --dry-run
    ```

### Phase 5: Reporting

14. **Document Fixes Applied**
    ```markdown
    ## Lint & Format Fixes Applied

    ### ESLint Errors Fixed (X total)
    - React Hook violations: Y files
    - Console statements: Z files
    - Unused variables: N files
    - JSX quote escaping: M files
    - Type errors: P files

    ### Prettier Formatting
    - Files formatted: U

    ### Verification
    - ✅ `pnpm lint` passes
    - ✅ `pnpm format` passes
    - ✅ Pre-commit hook passes
    ```

## Examples

**Example 1: CI/CD Pipeline Blocked by ESLint Errors**

```
User: "CI/CD is failing with ESLint errors. Can you fix them?"

Claude (using lint-format-auto-fixer):
1. Runs `pnpm lint` to identify all errors
   - Found 5 errors across 4 files

2. Categorizes errors:
   - React Hook violation: ElementPanel.tsx:135
   - Console statements: canvas.ts (debug logs)
   - Unused variable: model-store.ts:565

3. Applies auto-fixes:
   - Extracts ElementCell component
   - Removes debug console.log statements
   - Prefixes unused variable with underscore

4. Runs `pnpm lint --fix` for import organization

5. Applies Prettier formatting

6. Verifies: `pnpm lint` → Zero errors

Result: All ESLint errors fixed, CI/CD pipeline unblocked
```

**Example 2: Pre-Commit Hook Failing**

```
User: "Pre-commit hook failed with prettier formatting issues"

Claude (using lint-format-auto-fixer):
1. Identifies issue: Pre-commit runs format checking

2. Runs `pnpm format` to apply Prettier formatting
   - 12 files reformatted

3. Verifies formatting passes

4. Tests pre-commit hook:
   - `git commit --dry-run`
   - Hook passes ✅

Result: All files properly formatted, pre-commit hook passes
```

## Quality Gates

- [ ] `pnpm lint` returns zero errors
- [ ] `pnpm format` completes without changes
- [ ] Pre-commit hook passes
- [ ] All React Hook violations resolved
- [ ] Console statements removed
- [ ] All unused variables prefixed with `_` or removed
- [ ] All JSX quotes properly escaped

## Error Handling

### Error: ESLint --fix Conflicts with Prettier

**Solution**: Always run in this order:
1. `pnpm lint --fix` (ESLint auto-fixes)
2. `pnpm format` (Prettier overrides)

### Error: Type Replacement Causes Runtime Errors

**Solution**: Use `unknown` instead of specific type if structure uncertain, then add type guards.

## Performance Considerations

### Token Usage
- **Activation**: ~2000 tokens
- **Per fix session**: ~5000-8000 tokens

### Execution Time
- **Error detection**: 15-30 seconds
- **Auto-fix application**: 30-90 seconds
- **Total typical session**: 2-4 minutes

## Related Skills

### Composes Well With
- **commit-message**: Create lint fix commits with proper format
- **test-infrastructure**: Ensure tests pass after fixes
- **typescript-type-safety-enforcer**: Fix type issues comprehensively

## Best Practices

1. **Fix errors before commits**: Run `pnpm lint && pnpm format` before every commit
2. **Extract components early**: When using Hooks in render functions, extract as component immediately
3. **Prefix intentionally unused**: Use `_variable` prefix when variable needed but not used
4. **Escape quotes in JSX**: Always use HTML entities for quotes in JSX content
5. **Auto-fix first**: Run `pnpm lint --fix` before manual fixes
6. **Format after lint**: Always run Prettier AFTER ESLint

## Maintenance

### Updating This Skill
1. Add new error patterns as they emerge
2. Update fix templates based on project patterns
3. Increment version following semver

### Known Issues
- **Version 1.0.0**: Initial release for EAFlow
