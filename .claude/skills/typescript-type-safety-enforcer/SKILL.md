---
name: typescript-type-safety-enforcer
description: Prevent TypeScript type issues proactively through automated detection and fixing of `any` types, missing annotations, return types, union narrowing, generic constraints, type guards, and Zod schema sync. Activate with "fix TypeScript types", "improve type safety", "detect any types", "generate return types", or "type safety check".
version: 1.0.0
status: production

# Integration
component: shared
work-type: INFRASTRUCTURE

# Capabilities
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, Task]

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

# TypeScript Type Safety Enforcer

## Purpose

Automates detection and fixing of TypeScript type safety issues: `any` type usage, missing annotations, missing return types, union type narrowing, generic type inference, type guards, and Zod schema synchronization.

**Problem Solved**: TypeScript type safety gaps lead to preventable runtime errors and maintenance burden. Developers must manually run `tsc`, interpret error messages, and fix each issue individually.

## When to Use

Activate this skill when you need to:

- **Fix unsafe `any` types**: "Find and fix all `any` types"
- **Generate return type annotations**: "Add return types to all functions"
- **Narrow union types safely**: "Generate type guards for discriminated unions"
- **Sync Zod schemas to types**: "Keep TypeScript types synchronized with Zod schemas"
- **Enforce strict typing**: "Add missing type annotations"
- **Full type safety audit**: "Run comprehensive type safety check"

**Trigger keywords**: type safety, fix types, any type, return type, union type, type guard, Zod schema, type check, type enforcement, type inference, type annotation

## Instructions

### Phase 1: Type Analysis & Detection

1. **Scan for Type Issues**
   ```bash
   pnpm typecheck
   ```

   Use Grep to find patterns:
   ```bash
   # Find any types
   grep -r ": any" --include="*.ts" --include="*.tsx" src/

   # Find functions without return types
   grep -r "function.*(" --include="*.ts" src/ | grep -v ":"
   ```

2. **Analyze `any` Type Usage**

   For each instance:
   - Examine context to determine if intentional
   - Categorize as: intentional (documented), unsafe (needs fixing)
   - Generate fix suggestions based on context

### Phase 2: `any` Type Detection & Fixing

3. **Find and Categorize `any` Usage**

   ```typescript
   // ❌ BEFORE (unsafe any)
   function processElement(element: any) {
     return element?.name;
   }

   // ✅ AFTER (typed)
   function processElement(element: Element) {
     return element.name;
   }

   // Or with unknown for truly dynamic data
   function processElement(element: unknown): string | undefined {
     if (isElement(element)) {
       return element.name;
     }
     return undefined;
   }
   ```

4. **Generate Type Suggestions**

   For `any` in function parameters: analyze call sites to infer type
   For `any` in variables: analyze assignments to infer type
   For `any` in returns: analyze returned values to infer type

### Phase 3: Return Type Generator

5. **Analyze Function Bodies**

   ```typescript
   // ❌ BEFORE (no return type)
   function createElement(type: string, name: string) {
     return {
       id: generateId(),
       type,
       name,
       documentation: '',
       properties: {},
       tags: [],
     };
   }

   // ✅ AFTER (explicit return type)
   function createElement(type: string, name: string): Element {
     return {
       id: generateId(),
       type,
       name,
       documentation: '',
       properties: {},
       tags: [],
     };
   }
   ```

6. **Handle Complex Return Types**

   ```typescript
   // Union types for conditional returns
   function findElement(id: string): Element | undefined {
     return elements.find(e => e.id === id);
   }

   // Promise types for async
   async function loadModel(path: string): Promise<Model> {
     const data = await readFile(path);
     return parseModel(data);
   }
   ```

### Phase 4: Type Guards

7. **Generate Type Guards**

   ```typescript
   // Type guard for Element
   function isElement(value: unknown): value is Element {
     return (
       typeof value === 'object' &&
       value !== null &&
       'id' in value &&
       'type' in value &&
       'name' in value
     );
   }

   // Type guard for specific element type
   function isBusinessActor(element: Element): element is BusinessActor {
     return element.type === 'archimate:BusinessActor';
   }

   // Discriminated union narrowing
   type ModelNode =
     | { kind: 'element'; data: Element }
     | { kind: 'relationship'; data: Relationship };

   function processNode(node: ModelNode) {
     switch (node.kind) {
       case 'element':
         return processElement(node.data); // data is Element
       case 'relationship':
         return processRelationship(node.data); // data is Relationship
     }
   }
   ```

### Phase 5: Zod Schema Synchronization

8. **Extract Types from Zod Schemas**

   ```typescript
   import { z } from 'zod';

   // Define schema
   const ElementSchema = z.object({
     id: z.string(),
     type: z.string(),
     name: z.string(),
     documentation: z.string().optional(),
     properties: z.record(z.string()).optional(),
     tags: z.array(z.string()).optional(),
   });

   // Derive TypeScript type from schema
   type Element = z.infer<typeof ElementSchema>;

   // Use for validation
   function validateElement(data: unknown): Element {
     return ElementSchema.parse(data);
   }
   ```

9. **Keep Types and Schemas in Sync**

   Pattern: Define schema first, derive type
   ```typescript
   // ✅ GOOD: Single source of truth
   const RelationshipSchema = z.object({
     id: z.string(),
     type: z.string(),
     sourceId: z.string(),
     targetId: z.string(),
     name: z.string().optional(),
   });

   type Relationship = z.infer<typeof RelationshipSchema>;

   // ❌ BAD: Duplicated definitions can drift
   interface Relationship {
     id: string;
     type: string;
     // ... might not match schema
   }
   ```

### Phase 6: Validation & Reporting

10. **Run Full Type Check**
    ```bash
    pnpm typecheck
    ```

11. **Generate Type Safety Report**
    ```markdown
    ## Type Safety Report

    ### `any` Types
    - Total found: X
    - Fixed: Y
    - Intentional (documented): Z

    ### Missing Return Types
    - Functions without return types: A
    - Added return types: B

    ### Type Guards Generated
    - New type guards: C

    ### Zod Schemas
    - Schemas synced: D

    ### Verification
    - ✅ `pnpm typecheck` passes
    - ✅ No unsafe `any` remaining
    ```

## Examples

**Example 1: Fix `any` Types**

```
User: "Find and fix all `any` types in src/lib/"

Claude (using typescript-type-safety-enforcer):
1. Scans src/lib/ for `any` usage
   - Found 8 instances across 3 files

2. Analyzes context:
   - validation.ts:15 - any → Element (high confidence)
   - parser.ts:42 - any → unknown (external data)
   - utils.ts:8 - any → Record<string, unknown> (dynamic keys)

3. Applies fixes with type guards where needed

4. Verifies: `pnpm typecheck` → Zero errors

Result: 8 unsafe `any` types replaced with proper types
```

**Example 2: Generate Return Types**

```
User: "Add return type annotations to functions in src/store/"

Claude (using typescript-type-safety-enforcer):
1. Scans src/store/ for functions without return types
   - Found 15 functions missing return types

2. Analyzes return statements:
   - addElement → void
   - getElementById → Element | undefined
   - getElements → Element[]

3. Generates annotations

4. Verifies compilation

Result: 15 functions now have explicit return types
```

**Example 3: Sync Zod Schema to Type**

```
User: "Sync TypeScript types with Zod schemas in src/schemas/"

Claude (using typescript-type-safety-enforcer):
1. Finds Zod schemas in src/schemas/

2. For each schema:
   - Generates z.infer<typeof Schema> type
   - Exports type alongside schema
   - Updates imports in consuming files

3. Removes duplicate interface definitions

Result: Types derived from schemas, single source of truth
```

## Quality Gates

- [ ] `pnpm typecheck` returns zero errors
- [ ] No unsafe `any` types remaining (or documented)
- [ ] All exported functions have return type annotations
- [ ] Type guards provided for union type narrowing
- [ ] Zod schemas have corresponding inferred types
- [ ] No duplicate type definitions

## Error Handling

### Error: Type Replacement Causes Compilation Errors

**Solution**:
1. Use `unknown` instead of specific type if structure uncertain
2. Add type guards for runtime safety
3. Use generic types if possible

### Error: Zod Schema Doesn't Match Existing Type

**Solution**:
1. Update schema to match desired type
2. Or update type to match schema
3. Choose schema as source of truth going forward

## Performance Considerations

### Token Usage
- **Activation**: ~2500 tokens
- **Per codebase analysis**: ~4000-6000 tokens
- **Per fix generation**: ~2000-3000 tokens

### Execution Time
- **Type analysis**: ~1-2 seconds per 10K LOC
- **Fix generation**: ~0.5 seconds per file
- **Full workflow**: ~30 seconds for typical project

## Related Skills

### Composes Well With
- **lint-format-auto-fixer**: Fix both type and style issues together
- **test-infrastructure**: Generated types used in test fixtures
- **commit-message**: Type safety improvements tracked in commits

## Best Practices

1. **Start with high-confidence fixes**: Replace obvious `any` types first
2. **Use Zod as source of truth**: Derive types from schemas, not vice versa
3. **Document intentional `any`**: Add comments explaining why
4. **Verify after fixes**: Always run `pnpm typecheck` after changes
5. **Use `unknown` over `any`**: Forces proper type narrowing
6. **Prefer type guards**: Over type assertions (`as`)
7. **Keep types DRY**: Use `z.infer` to avoid duplication

## Maintenance

### Updating This Skill
1. Add new type patterns as they emerge
2. Update Zod sync patterns for new schema features
3. Increment version following semver

### Known Issues
- **Version 1.0.0**: Initial release for EAFlow
