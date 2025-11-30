# ESLint Error Patterns, UI Consistency Issues, and Auto-Fixes

This file documents all common ESLint error patterns and UI consistency issues in the Numonic codebase with their auto-fix solutions. Based on analysis of actual commits: 725ecd52, f0fa8ae4, b2d31c44, c7cf6553, 118911b4, cffdf269, d94b4815, 18850bc4, 74188b25, 418e8418.

## Pattern Index

**ESLint Errors**:
1. [React Hook Violations](#react-hook-violations)
2. [Console Statements](#console-statements)
3. [Unused Variables](#unused-variables)
4. [JSX Quote Escaping](#jsx-quote-escaping)
5. [require() Import Errors](#require-import-errors)
6. [Type Errors (no-explicit-any)](#type-errors-no-explicit-any)
7. [Import Organization](#import-organization)
8. [Missing Dependencies](#missing-dependencies)
9. [Deprecated Patterns](#deprecated-patterns)

**UI Consistency** (NEW v0.2.0):
10. [Tailwind Class Ordering](#tailwind-class-ordering)
11. [Hardcoded Colors (Light/Dark Mode)](#hardcoded-colors-lightdark-mode)
12. [Unused CSS Classes](#unused-css-classes)
13. [Responsive Design Patterns](#responsive-design-patterns)

---

## React Hook Violations

### Error Pattern

**ESLint Rule**: `react-hooks/rules-of-hooks`

**Error Message**:
```
React Hook "useTypedSelector" is called in function "columns" that is neither
a React function component nor a custom React Hook function
react-hooks/rules-of-hooks
```

**Common Locations**:
- Table column definitions with inline cell renderers
- Render prop functions
- Utility functions that use Hooks

**Example from Codebase** (commit 725ecd52):
```typescript
// ❌ ERROR - Hook in non-component function
const columns = [
  {
    id: 'tenant_id',
    header: 'Tenant ID',
    cell: ({ row }) => {
      // This is NOT a component, just a function
      const tenantId = useTypedSelector((state) =>
        selectTenantById(state, row.original.tenant_id)
      ); // ❌ Error: Hook called in non-component
      return <div>{tenantId}</div>;
    }
  }
];
```

### Auto-Fix Solution

**Step 1**: Extract the cell renderer as a proper React component

```typescript
// ✅ FIXED - Extracted as proper component
function TenantIdCell({ row }: { row: Row<TenantRow> }) {
  // Now this IS a React component, Hooks allowed
  const tenantId = useTypedSelector((state) =>
    selectTenantById(state, row.original.tenant_id)
  );
  return <div>{tenantId}</div>;
}

const columns = [
  {
    id: 'tenant_id',
    header: 'Tenant ID',
    cell: ({ row }) => <TenantIdCell row={row} />
  }
];
```

**Step 2**: Add proper TypeScript types

```typescript
import { Row } from '@tanstack/react-table';

interface TenantRow {
  tenant_id: string;
  name: string;
  // ... other fields
}

function TenantIdCell({ row }: { row: Row<TenantRow> }) {
  const tenantId = useTypedSelector((state) =>
    selectTenantById(state, row.original.tenant_id)
  );
  return <div className="font-mono text-sm">{tenantId}</div>;
}
```

### Checklist

- [ ] Extract inline function as separate component above column definition
- [ ] Name component with pattern: `{DataType}Cell` (e.g., TenantIdCell, StatusCell)
- [ ] Add TypeScript prop types: `{ row: Row<T> }`
- [ ] Import `Row` type from `@tanstack/react-table`
- [ ] Replace inline function with component reference: `<TenantIdCell row={row} />`
- [ ] Verify component has access to needed context/providers
- [ ] Test rendering works correctly

### Related Files

- `apps/web/features/admin/components/tenants/TenantManagementTable.tsx` (commit 725ecd52)

---

## Console Statements

### Error Pattern

**ESLint Rule**: `no-console`

**Error Message**:
```
Unexpected console statement  no-console
```

**Common Locations**:
- API routes (debug logging)
- CLI tools (legitimate output)
- React components (debug logging)
- Node.js scripts

### Auto-Fix Solution A: CLI Tools (Suppress)

**Context**: CLI tools legitimately need console output for user-facing messages

**Example** (commit 725ecd52):
```typescript
// File: apps/desktop-sync/src/main.ts

// ❌ ERROR - Console statement warning
console.log('Starting desktop sync...');
console.log('Configuration loaded from:', configPath);
console.log('Syncing files...');
```

**Fix**: Add targeted eslint-disable comments

```typescript
// ✅ FIXED - Suppressed for CLI tool
/* eslint-disable no-console */
console.log('Starting desktop sync...');
console.log('Configuration loaded from:', configPath);
console.log('Syncing files...');
/* eslint-enable no-console */
```

**Alternative**: Suppress for entire file if it's a CLI entry point

```typescript
// At top of file
/* eslint-disable no-console */

// Now all console statements allowed
console.log('Starting desktop sync...');
// ... rest of CLI code
```

### Auto-Fix Solution B: Debug Logs (Remove)

**Context**: Debug logs in API routes, components, services should use logger instead

**Example** (commit f0fa8ae4):
```typescript
// File: apps/web/app/api/v1/assets/process-midjourney-zip/route.ts

// ❌ ERROR - 27 debug console statements
console.log('Processing file:', file);
console.log('Metadata:', metadata);
console.log('Extracted prompt:', prompt);
console.log('Image dimensions:', width, height);
console.log('File size:', size);
// ... 22 more console.log statements
```

**Fix**: Remove all debug console statements

```typescript
// ✅ FIXED - Removed debug logs, use logger instead
import { logger } from '@/lib/logger';

logger.debug({ file }, 'Processing file');
logger.debug({ metadata }, 'Metadata extracted');
logger.debug({ prompt }, 'Extracted prompt');
logger.debug({ width, height }, 'Image dimensions');
logger.debug({ size }, 'File size');
```

**Benefits of logger.debug()**:
- Structured data (JSON format)
- Automatic timestamps
- Log levels (debug, info, warn, error)
- Production-safe (debug level)
- No ESLint errors

### Decision Matrix

| File Type | Location | Action | Reason |
|-----------|----------|--------|--------|
| CLI entry point | `apps/*/src/main.ts` | Suppress | Legitimate console usage |
| CLI script | `scripts/**/*.js` | Suppress | Node.js scripts need console |
| API route | `app/api/**/*.ts` | Remove | Use logger instead |
| React component | `components/**/*.tsx` | Remove | Use logger instead |
| Service/lib | `lib/**/*.ts` | Remove | Use logger instead |
| Test file | `**/*.test.ts` | Suppress | Test output acceptable |

### Checklist

**For CLI Tools (Suppress)**:
- [ ] Confirm file is CLI entry point or Node.js script
- [ ] Add `/* eslint-disable no-console */` before console statements
- [ ] Add `/* eslint-enable no-console */` after (or at file level)
- [ ] Verify console output is intentional user-facing messages

**For Debug Logs (Remove)**:
- [ ] Import logger: `import { logger } from '@/lib/logger';`
- [ ] Replace `console.log()` with `logger.debug()`
- [ ] Convert to structured logging: `logger.debug({ data }, 'message')`
- [ ] Remove all console.log lines
- [ ] Verify `pnpm lint` passes

### Related Files

- `apps/desktop-sync/src/main.ts` (suppress - commit 725ecd52)
- `apps/web/app/api/v1/assets/process-midjourney-zip/route.ts` (remove - commit f0fa8ae4)

---

## Unused Variables

### Error Pattern

**ESLint Rule**: `@typescript-eslint/no-unused-vars`

**Error Message**:
```
'monitorStatus' is assigned a value but never used  @typescript-eslint/no-unused-vars
```

**Common Locations**:
- Variables needed for type safety but not used
- Function parameters required by interface but not needed
- Side-effect-only function calls

### Auto-Fix Solution A: Intentionally Unused (Prefix)

**Context**: Variable needed for type safety, side effects, or interface compliance but not used

**Example** (commit 725ecd52):
```typescript
// ❌ ERROR - Variable assigned but never used
const monitorStatus = await getMonitorStatus();
// Variable never referenced below
```

**Fix**: Prefix with underscore to signal intentional

```typescript
// ✅ FIXED - Underscore signals intentionally unused
const _monitorStatus = await getMonitorStatus();
// Side effect matters, not the return value
```

### Auto-Fix Solution B: Truly Unnecessary (Remove)

**Context**: Variable not needed at all

```typescript
// ❌ ERROR - Variable not needed
const result = await operation();
// Never used

// ✅ FIXED - Just call for side effects
await operation();
```

### Auto-Fix Solution C: Function Parameters (Prefix)

**Context**: Parameter required by interface but not used in implementation

```typescript
// ❌ ERROR - Parameter never used
function handler(req: Request, res: Response, next: NextFunction) {
  // Only use req, not res or next
  console.log(req.url);
}

// ✅ FIXED - Prefix unused parameters
function handler(req: Request, _res: Response, _next: NextFunction) {
  console.log(req.url);
}
```

### Decision Matrix

| Scenario | Action | Example |
|----------|--------|---------|
| Side effect needed | Prefix with `_` | `const _result = await sideEffect()` |
| Type safety | Prefix with `_` | `const _type: Type = value` |
| Interface requirement | Prefix with `_` | `function f(x, _y, _z)` |
| Truly unnecessary | Remove | Delete line entirely |
| Destructuring | Prefix | `const { used, _unused } = obj` |

### Checklist

- [ ] Determine if variable truly needed (side effect, type safety, interface)
- [ ] If needed: Prefix with underscore `_variableName`
- [ ] If not needed: Remove variable declaration entirely
- [ ] For function params: Prefix unused params with `_`
- [ ] Verify code still works after change
- [ ] Verify `pnpm lint` passes

### Related Files

- `apps/desktop-sync/src/main.ts:565` (commit 725ecd52)

---

## JSX Quote Escaping

### Error Pattern

**ESLint Rule**: `react/no-unescaped-entities`

**Error Message**:
```
`'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
`"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
```

**Common Locations**:
- JSX text content with apostrophes
- JSX attributes with quotes
- User-facing messages in components

### Auto-Fix Solution

**Example** (commit 725ecd52):
```tsx
// ❌ ERROR - Unescaped quotes and apostrophes
<div>
  <p>The user's data won't load.</p>
  <button title="Click "here" to continue">Submit</button>
  <span>It's important to check.</span>
</div>
```

**Fix**: Replace with HTML entities

```tsx
// ✅ FIXED - HTML entities
<div>
  <p>The user&apos;s data won&apos;t load.</p>
  <button title="Click &quot;here&quot; to continue">Submit</button>
  <span>It&apos;s important to check.</span>
</div>
```

### Entity Reference

| Character | Entity Options | Recommended |
|-----------|---------------|-------------|
| `'` (apostrophe) | `&apos;` `&#39;` `&lsquo;` `&rsquo;` | `&apos;` |
| `"` (quote) | `&quot;` `&#34;` `&ldquo;` `&rdquo;` | `&quot;` |

**Why `&apos;` and `&quot;`?**
- Most readable
- Shortest (better for diffs)
- Universally supported
- Matches Prettier conventions

### Search Pattern

Find all instances:
```bash
# Search for unescaped quotes in JSX files
grep -r "react/no-unescaped-entities" --include="*.tsx" --include="*.jsx"

# Or use ESLint
pnpm lint | grep "react/no-unescaped-entities"
```

### Mass Replace

For files with many instances:

```bash
# Replace all apostrophes in JSX content
sed -i "s/>\([^<]*\)'/>\1\&apos;/g" file.tsx

# Replace all quotes
sed -i 's/"\([^"]*\)"/\&quot;\1\&quot;/g' file.tsx
```

**Note**: Manual review recommended after mass replace to avoid breaking JSX syntax.

### Checklist

- [ ] Find all unescaped quotes/apostrophes in JSX content
- [ ] Replace `'` with `&apos;` in text content
- [ ] Replace `"` with `&quot;` in attributes and text
- [ ] Verify JSX still renders correctly
- [ ] Check for any broken JSX syntax
- [ ] Run `pnpm lint` to verify fixed
- [ ] Test component renders as expected

### Related Files

- `apps/web/features/admin/desktop-sync-e2e-testing/page.tsx:197,219,286,345` (commit 725ecd52)

---

## require() Import Errors

### Error Pattern

**ESLint Rule**: `import/no-commonjs`

**Error Message**:
```
Expected 'import' or 'export' statement, found 'require()'  import/no-commonjs
```

**Common Locations**:
- Node.js scripts in `scripts/` directory
- Build configuration files
- Legacy code not yet converted to ES6

### Auto-Fix Solution A: Node.js Scripts (Suppress)

**Context**: Node.js scripts where require() is legitimate

**Example** (commit 725ecd52):
```javascript
// File: scripts/fix-logger-conditionals.js

// ❌ ERROR - require() flagged
const fs = require('fs');
const path = require('path');
```

**Fix**: Add eslint-disable for CommonJS

```javascript
// ✅ FIXED - Suppressed for Node.js script
/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');
/* eslint-enable import/no-commonjs */
```

### Auto-Fix Solution B: TypeScript Files (Convert)

**Context**: TypeScript files should use ES6 imports

```typescript
// ❌ ERROR - require() in TypeScript
const fs = require('fs');
const path = require('path');

// ✅ FIXED - ES6 imports
import fs from 'fs';
import path from 'path';
```

### Decision Matrix

| File Type | Extension | Action | Reason |
|-----------|-----------|--------|--------|
| Node.js script | `.js` in `scripts/` | Suppress | CommonJS expected |
| Build config | `*.config.js` | Suppress | Node.js environment |
| TypeScript | `.ts`, `.tsx` | Convert | ES6 modules |
| Module | `.mjs` | Convert | ES6 modules |
| Legacy | `.js` in `src/` | Convert | Modernize to ES6 |

### Checklist

**For Node.js Scripts (Suppress)**:
- [ ] Confirm file is Node.js script (not TypeScript)
- [ ] Add `/* eslint-disable import/no-commonjs */` at top
- [ ] Verify script still runs: `node script.js`

**For TypeScript Files (Convert)**:
- [ ] Replace `const x = require('y')` with `import x from 'y'`
- [ ] Update named imports: `import { x, y } from 'z'`
- [ ] Update export: `module.exports = x` → `export default x`
- [ ] Verify type checking: `pnpm typecheck`
- [ ] Verify build: `pnpm build`

### Related Files

- `apps/desktop-sync/scripts/fix-logger-conditionals.js:7-8` (commit 725ecd52)

---

## Type Errors (no-explicit-any)

### Error Pattern

**ESLint Rule**: `@typescript-eslint/no-explicit-any`

**Error Message**:
```
Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

**Common Locations**:
- Function parameters with unknown structure
- JSON parsing results
- Third-party library integration
- Legacy code not yet typed

### Auto-Fix Solution A: Known Structure

**Example** (commit f0fa8ae4):
```typescript
// ❌ ERROR - any type
function detectPackage(pkg: any) {
  return pkg?.name;
}

// ✅ FIXED - Specific type
function detectPackage(pkg: { name?: string }) {
  return pkg?.name;
}

// Or with interface
interface Package {
  name?: string;
  version?: string;
}

function detectPackage(pkg: Package) {
  return pkg.name;
}
```

### Auto-Fix Solution B: Unknown Structure

**Use `unknown` type with type guards**

```typescript
// ❌ ERROR - any type
function processData(data: any) {
  return data.field;
}

// ✅ FIXED - unknown with type guard
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'field' in data) {
    return (data as { field: unknown }).field;
  }
  return undefined;
}
```

### Auto-Fix Solution C: Generic Types

**For functions that work with any type**

```typescript
// ❌ ERROR - any type
function identity(value: any) {
  return value;
}

// ✅ FIXED - Generic type
function identity<T>(value: T): T {
  return value;
}
```

### Type Replacement Guide

| Scenario | Replace any with | Example |
|----------|-----------------|---------|
| Known structure | Interface/type | `{ name: string }` |
| Unknown structure | `unknown` | `unknown` + type guards |
| JSON parse | `unknown` | Cast after validation |
| Generic function | Generic type `<T>` | `<T>(val: T): T` |
| External library | Import types | `import { Type } from 'lib'` |
| Partial structure | Partial type | `{ field?: unknown }` |

### Checklist

- [ ] Identify what type is expected
- [ ] If known: Create interface or type alias
- [ ] If unknown: Use `unknown` with type guards
- [ ] If generic: Use generic type parameter `<T>`
- [ ] Add validation for `unknown` types
- [ ] Verify type checking: `pnpm typecheck`
- [ ] Test runtime behavior unchanged

### Related Files

- `apps/autovault/src/lib/logger.ts` (commit f0fa8ae4)
- `packages/extractors/src/lib/logger.ts` (commit f0fa8ae4)

---

## Import Organization

### Error Pattern

**ESLint Rules**: Various import-related rules
- `import/order` - Import statements must be sorted
- `import/newline-after-import` - Missing newline after imports
- `import/no-duplicates` - Duplicate imports from same module

**Common Locations**:
- All TypeScript/JavaScript files with imports

### Auto-Fix Solution

**Most import errors are auto-fixable**:

```bash
# Auto-fix all import issues
pnpm lint --fix

# Or for specific package
pnpm --filter @numonic/web lint --fix
```

### Import Order Convention

ESLint enforces this order:

1. Built-in Node.js modules (`fs`, `path`)
2. External packages (`react`, `next`)
3. Internal packages (`@numonic/*`)
4. Parent imports (`../`)
5. Sibling imports (`./`)
6. Type imports (if separated)

**Example**:
```typescript
// ✅ Correct import order
import fs from 'fs'; // Built-in
import path from 'path';

import React from 'react'; // External
import { useRouter } from 'next/router';

import { logger } from '@numonic/logger'; // Internal

import { helper } from '../utils'; // Parent

import { Component } from './Component'; // Sibling

import type { User } from './types'; // Types
```

### Checklist

- [ ] Run `pnpm lint --fix` to auto-organize imports
- [ ] Verify import order: built-in → external → internal → relative
- [ ] Remove duplicate imports
- [ ] Add newline after import block
- [ ] Run `pnpm lint` to verify

---

## Missing Dependencies

### Error Pattern

**ESLint Rule**: `react-hooks/exhaustive-deps`

**Error Message**:
```
React Hook useEffect has a missing dependency: 'someVar'. Either include it
or remove the dependency array  react-hooks/exhaustive-deps
```

**Common Locations**:
- useEffect hooks
- useCallback hooks
- useMemo hooks

### Auto-Fix Solution

**Add missing dependencies to array**:

```typescript
// ❌ ERROR - Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId not in dependency array

// ✅ FIXED - Added dependency
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

**Or use exhaustive-deps disable if intentional**:

```typescript
// ✅ FIXED - Intentionally excluding dependency
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Only run on mount
```

---

## Deprecated Patterns

### Common Deprecated Patterns

**Pattern**: Default exports in component files

```typescript
// ❌ Discouraged
export default function Component() { }

// ✅ Preferred
export function Component() { }
```

**Pattern**: Implicit any in function params

```typescript
// ❌ Error with strict mode
function handler(data) { }

// ✅ Fixed
function handler(data: unknown) { }
```

---

## Quick Reference

### Most Common Errors (by frequency)

1. **Console statements** (27 in one commit) - Remove or suppress
2. **React Hook violations** (table components) - Extract component
3. **JSX quotes** (4 per file average) - Use &quot; and &apos;
4. **Unused variables** (2-3 per commit) - Prefix with _
5. **Type errors** (2 per commit) - Replace any with unknown

### Quick Fix Commands

```bash
# 1. Run linter
pnpm lint

# 2. Auto-fix what's possible
pnpm lint --fix

# 3. Format with Prettier
pnpm format

# 4. Verify all clean
pnpm lint && pnpm format
```

### Verification Workflow

1. Fix errors manually (React Hooks, console, types)
2. Run `pnpm lint --fix` (imports, spacing)
3. Run `pnpm format` (Prettier)
4. Run `pnpm typecheck` (verify types)
5. Run `pnpm lint` (verify zero errors)
6. Test pre-commit: `git commit --dry-run`

---

## Tailwind Class Ordering

### Issue Pattern

**Problem**: Inconsistent Tailwind class ordering across components makes code harder to read and diff

**Symptom**: Classes appear in different orders in different files:
```tsx
// File A
<div className="text-sm bg-white p-4 rounded-lg flex items-center">

// File B (same pattern, different order)
<div className="flex items-center p-4 rounded-lg bg-white text-sm">
```

**Common Locations**:
- All React components using Tailwind (`className` attributes)
- Especially problematic in admin tables, feature management, dashboard components

### Auto-Fix Solution

**Step 1**: Install prettier-plugin-tailwindcss

```bash
# Add to dev dependencies
pnpm add -D prettier-plugin-tailwindcss

# Plugin auto-detected by Prettier (no config needed)
```

**Step 2**: Apply consistent ordering

```bash
# Format all files with Tailwind ordering
pnpm format
```

**Example** (from commits d94b4815, 18850bc4):
```tsx
// ❌ BEFORE (Inconsistent ordering)
<div className="text-sm bg-white p-4 rounded-lg flex items-center shadow-md">
<button className="rounded px-4 bg-blue-500 hover:bg-blue-600 text-white py-2">
<span className="font-bold text-gray-900 text-lg">

// ✅ AFTER (Consistent ordering: layout → spacing → sizing → colors → typography → effects)
<div className="flex items-center p-4 rounded-lg bg-white text-sm shadow-md">
<button className="rounded px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
<span className="text-lg font-bold text-gray-900">
```

**Tailwind Class Order Convention** (Prettier plugin default):
1. **Layout**: `flex`, `grid`, `block`, `inline`, `hidden`
2. **Positioning**: `relative`, `absolute`, `sticky`, `fixed`, `inset-*`
3. **Spacing**: `p-*`, `m-*`, `gap-*`, `space-*`
4. **Sizing**: `w-*`, `h-*`, `min-*`, `max-*`
5. **Colors**: `bg-*`, `text-*`, `border-*`
6. **Typography**: `text-*`, `font-*`, `leading-*`, `tracking-*`
7. **Borders**: `border`, `border-*`, `rounded-*`
8. **Effects**: `shadow-*`, `opacity-*`, `transition-*`
9. **Pseudo-classes**: `hover:*`, `focus:*`, `active:*`, `dark:*`

### Checklist

- [ ] Verify prettier-plugin-tailwindcss installed: `pnpm list prettier-plugin-tailwindcss`
- [ ] Run `pnpm format` to apply ordering
- [ ] Verify classes follow convention (layout → spacing → colors → effects)
- [ ] Check git diff shows only reordering (no functional changes)
- [ ] Test components render identically

### Related Files

- `apps/web/features/admin/components/features/FeatureManagementClient.tsx` (commit d94b4815)
- `apps/web/features/admin/components/tenants/TenantManagementTable.tsx` (commit 18850bc4)
- `apps/web/features/dashboard/components/DashboardClient.tsx` (commit 74188b25)

---

## Hardcoded Colors (Light/Dark Mode)

### Issue Pattern

**Problem**: Hardcoded Tailwind colors (`bg-white`, `text-black`, `bg-gray-*`) break dark mode

**Error Messages** (indirect):
- No ESLint error, but visual bug report: "Admin page unreadable in light mode"
- GitHub issue: "Light mode styling issues in admin tables"

**Common Locations**:
- Admin components (`features/admin/components/`)
- Dashboard widgets
- Feature management tables
- Custom non-shadcn components

### Auto-Fix Solution

**Step 1**: Identify hardcoded colors

```bash
# Search for hardcoded Tailwind colors
grep -r "className.*\(bg-white\|bg-gray-\|text-black\|text-gray-\)" apps/web/components/ apps/web/features/ --exclude-dir=ui

# Example output:
# features/admin/components/tables/DatabaseTableView.tsx:45:  className="bg-white border-gray-300"
# features/admin/components/features/FeatureManagementClient.tsx:78:  className="text-gray-600"
```

**Step 2**: Replace with CSS variables

**Example** (from commits d94b4815, 18850bc4, 74188b25, 418e8418):
```tsx
// ❌ BEFORE (Hardcoded colors - breaks dark mode)
<div className="bg-white text-black border-gray-300">
  <h2 className="text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
  <div className="bg-gray-50 border-gray-200">
    <span className="text-gray-500">Muted text</span>
  </div>
</div>

// ✅ AFTER (CSS variables - supports dark mode)
<div className="bg-background text-foreground border-border">
  <h2 className="text-foreground">Title</h2>
  <p className="text-muted-foreground">Description</p>
  <div className="bg-muted border-input">
    <span className="text-muted-foreground">Muted text</span>
  </div>
</div>
```

**CSS Variable Reference** (from `apps/web/app/globals.css`):

| Hardcoded Tailwind | CSS Variable | Usage |
|-------------------|--------------|-------|
| `bg-white` | `bg-background` | Main background (page level) |
| `bg-white` | `bg-card` | Panel/card background |
| `bg-gray-50` | `bg-muted` | Subtle background (hover states) |
| `bg-gray-100` | `bg-accent` | Highlighted elements |
| `text-black` | `text-foreground` | Primary text |
| `text-gray-900` | `text-foreground` | Primary text (dark variant) |
| `text-gray-600` | `text-muted-foreground` | Secondary/helper text |
| `text-gray-500` | `text-muted-foreground` | Muted text |
| `border-gray-300` | `border-border` | Standard borders |
| `border-gray-200` | `border-input` | Input field borders |
| `bg-blue-500` | `bg-primary` | Primary action buttons |
| `text-white` (on primary) | `text-primary-foreground` | Text on primary buttons |

**Step 3**: Verify dark mode compatibility

```bash
# Test in browser
# 1. Open DevTools
# 2. Toggle dark mode (theme switcher component)
# 3. Verify all text readable, backgrounds appropriate
# 4. Check for any remaining white/black areas
```

### Checklist

- [ ] Search for hardcoded colors: `bg-white`, `bg-gray-*`, `text-black`, `text-gray-*`
- [ ] Replace with CSS variables per table above
- [ ] Exclude `components/ui/` directory (shadcn handles theming)
- [ ] Test both light and dark modes in browser
- [ ] Verify no visual regressions
- [ ] Check contrast ratios meet WCAG AA (accessibility)

### Related Files

- `apps/web/features/admin/components/features/FeatureManagementClient.tsx:78` (commit d94b4815)
- `apps/web/features/admin/components/tenants/TenantManagementTable.tsx:122` (commit 18850bc4)
- `apps/web/features/dashboard/components/DashboardClient.tsx:45` (commit 74188b25)
- `apps/web/features/admin/components/tables/DatabaseTableView.tsx:67` (commit 418e8418)

---

## Unused CSS Classes

### Issue Pattern

**Problem**: Custom Tailwind classes defined in `globals.css` but never used in components

**Symptom**: Bloated CSS bundle, confusion about which classes are "canonical"

**Common Locations**:
- `apps/web/app/globals.css` - `@layer components` and `@layer utilities`
- Custom button styles: `.btn-*`
- Custom layout utilities: `.container-*`

### Auto-Fix Solution

**Step 1**: List custom classes

```bash
# Find all custom Tailwind classes
grep -E "^\s+\." apps/web/app/globals.css | grep -E "@apply|{" | awk '{print $1}' | tr -d '.'

# Example output:
# btn-primary
# btn-secondary
# btn-old-style
# container-narrow
```

**Step 2**: Check usage for each class

```bash
# For each class, search codebase
grep -r "className.*btn-old-style" apps/web/

# If no results → Unused, can remove
# If results found → Keep
```

**Step 3**: Remove unused classes

```css
/* ❌ BEFORE - Unused custom class */
@layer components {
  .btn-old-style {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
  /* Zero usages in codebase */
}

/* ✅ AFTER - Removed */
/* Class deleted from globals.css */
```

**Decision Matrix**:

| Usage Count | Action | Reason |
|-------------|--------|--------|
| 0 usages | Remove | Dead code |
| 1-2 usages | Inline | Not worth abstracting |
| 3+ usages | Keep | Reusable utility |

### Checklist

- [ ] List all custom classes in globals.css
- [ ] Search each class usage: `grep -r "className.*custom-class" apps/web/`
- [ ] Remove classes with 0 usages
- [ ] Consider inlining classes with 1-2 usages
- [ ] Keep classes with 3+ usages (truly reusable)
- [ ] Document remaining classes (purpose, usage)

### Related Files

- `apps/web/app/globals.css` - Custom Tailwind classes

---

## Responsive Design Patterns

### Issue Pattern

**Problem**: Inconsistent responsive breakpoint usage, desktop-first CSS, missing mobile views

**Symptom**: Components look broken on mobile, inconsistent spacing across breakpoints

**Common Locations**:
- Admin tables (often desktop-only)
- Dashboard widgets
- Forms and modals

### Auto-Fix Solution

**Pattern**: Always use mobile-first approach (base → sm → md → lg)

**Tailwind Breakpoints**:
- Base (no prefix): 0px - 639px (mobile)
- `sm:`: 640px and up (large mobile, small tablet)
- `md:`: 768px and up (tablet)
- `lg:`: 1024px and up (desktop)
- `xl:`: 1280px and up (large desktop)
- `2xl:`: 1536px and up (extra large)

**Example**:
```tsx
// ❌ BEFORE (Desktop-first, hard to maintain)
<div className="flex-row lg:flex-col md:flex-row sm:flex-col">
  <div className="w-1/2 lg:w-full md:w-1/2">Content</div>
</div>

// ✅ AFTER (Mobile-first, clear progression)
<div className="flex-col sm:flex-row md:flex-col lg:flex-row">
  <div className="w-full md:w-1/2">Content</div>
</div>
```

**Mobile-First Pattern**:
1. **Base styles** (mobile, 0-639px): Stack vertically, full width, larger touch targets
2. **sm:** (640px+): Maybe 2-column, tighter spacing
3. **md:** (768px+): Multi-column layouts emerge
4. **lg:** (1024px+): Desktop-optimized, compact

### Search for Issues

```bash
# Find components without mobile considerations
grep -r "className" apps/web/components/ apps/web/features/ | grep -v "sm:" | grep -v "md:" | head -20

# Find desktop-first patterns (antipattern)
grep -r "lg:flex-col" apps/web/  # Base should be flex-col, not lg:
```

### Checklist

- [ ] Start with base styles (mobile)
- [ ] Add breakpoints progressively (sm → md → lg)
- [ ] Test in browser DevTools mobile view
- [ ] Verify touch targets ≥44x44px on mobile
- [ ] Check horizontal scrolling (should be none)
- [ ] Test all breakpoints: 375px, 768px, 1024px, 1440px

### Related Patterns

**Common Responsive Patterns**:
```tsx
// Spacing: Tighter on mobile, looser on desktop
<div className="p-4 md:p-6 lg:p-8">

// Typography: Smaller on mobile
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Grid: Stack on mobile, multi-column on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Visibility: Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop-only sidebar</div>
```

---

**Last Updated**: 2025-10-27
**Source Commits**: 725ecd52, f0fa8ae4, b2d31c44, c7cf6553, 118911b4, cffdf269, d94b4815, 18850bc4, 74188b25, 418e8418
**Maintainer**: Numonic Team
