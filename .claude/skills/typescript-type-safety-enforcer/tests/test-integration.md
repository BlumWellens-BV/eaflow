# Integration Tests - TypeScript Type Safety Enforcer

## Purpose
Test the skill against real codebase scenarios to ensure all 8 features work together.

## Test Scenario 1: Analyze src/lib/asset-processing Service

### Scenario Description
Analyze the asset processing service for type safety issues across all 8 feature categories.

### Test Case 1.1 - Complex Any Type with Database Interaction
```typescript
// File: src/lib/asset-processing/index.ts (hypothetical)

export function processAsset(assetData: any, userId: any) {
  const processed = {
    assetId: assetData.id,
    ownerId: userId,
    status: 'processing'
  }

  return processAssetPhase1(processed, assetData)
}

// Expected Detections:
// 1. Parameter 'assetData' type is `any` (unsafe)
//    - Confidence: High
//    - Suggestion: Should be AssetData interface
//    - Database sync: Check asset_hub table structure
//
// 2. Parameter 'userId' type is `any` (unsafe)
//    - Confidence: High
//    - Suggestion: Should be string (UUID)
//    - Database sync: Check user_hub table structure
//
// 3. Function missing return type annotation
//    - Confidence: High
//    - Suggestion: Promise<ProcessedAsset>
//    - Inferred from processAssetPhase1 call
//
// 4. Object literal needs explicit type
//    - Confidence: High
//    - Suggestion: const processed: ProcessedAsset = { ... }

### Generated Fixes:
✅ Add types to parameters
✅ Add return type annotation
✅ Add type to object literal
✅ Sync with database schema
✅ No breaking changes
```

### Test Case 1.2 - Zod Schema Integration
```typescript
// File: src/lib/validation/asset.ts

export const AssetInputSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['image', 'video', 'document']),
  size: z.number().int().positive(),
  tags: z.array(z.string()).optional(),
})

// Untyped type definition
export type AssetInput = ???

// Expected Detection:
// 1. Type definition missing for AssetInputSchema
//    - Suggestion: export type AssetInput = z.infer<typeof AssetInputSchema>
//
// 2. Schema has optional field
//    - Confidence: High
//    - Suggestion: tags?: string[] in type definition

### Generated Fixes:
✅ Generate type from Zod schema
✅ Keep in sync with schema changes
✅ Handle optional fields correctly
```

**Test Results - Scenario 1**
- [ ] All 8 features detected issues
- [ ] No false positives
- [ ] Fixes generated successfully
- [ ] Database types synchronized
- [ ] Zod schemas linked to types

---

## Test Scenario 2: Fix Union Type Issues in API Routes

### Scenario Description
Test union type narrowing and type guard generation in API response handling.

### Test Case 2.1 - Discriminated Union Response Type
```typescript
// File: src/api/routes/upload.ts

type UploadResult =
  | { success: true; fileId: string; url: string }
  | { success: false; error: string; code: string }

export async function handleUpload(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = response.json()  // Missing type annotation

    // Unsafe union access - needs narrowing
    return {
      success: data.success,
      fileId: data.fileId,  // May be undefined
      error: data.error,     // May be undefined
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,    // Any type on err
    }
  }
}

// Expected Detections:
// 1. Variable 'data' missing type annotation
//    - Confidence: Medium
//    - Suggestion: const data: unknown = response.json()
//
// 2. Unsafe union type access
//    - fileId accessed on possibly-error result
//    - error accessed on possibly-success result
//    - Confidence: High
//    - Suggestion: Use type guard
//
// 3. Variable 'err' has implicit `any` type
//    - Confidence: High
//    - Suggestion: (err: Error | unknown)
//    - Suggest type guard for Error
//
// 4. Return statement not matching union type
//    - fileId could be undefined
//    - Confidence: High
//    - Suggestion: Add type checks

### Generated Fixes:

function isSuccessResult(result: unknown): result is { success: true; fileId: string; url: string } {
  return result && typeof result === 'object' && 'success' in result && result.success === true
}

function isErrorResult(result: unknown): result is { success: false; error: string; code: string } {
  return result && typeof result === 'object' && 'success' in result && result.success === false
}

export async function handleUpload(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json() as unknown

    if (isErrorResult(data)) {
      return data  // Properly narrowed
    }

    if (isSuccessResult(data)) {
      return data  // Properly narrowed
    }

    return {
      success: false,
      error: 'Invalid response format',
      code: 'INVALID_RESPONSE',
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return {
      success: false,
      error: error.message,
      code: 'UPLOAD_ERROR',
    }
  }
}
```

**Test Results - Scenario 2**
- [ ] Union types detected as needing narrowing
- [ ] Type guards generated correctly
- [ ] Catch error handling improved
- [ ] Return type validation added
- [ ] No `any` types remaining

---

## Test Scenario 3: Database Schema Synchronization

### Scenario Description
Test database type synchronization with recent migration changes.

### Test Case 3.1 - New Migration Type Generation
```sql
-- Recent Migration
CREATE TABLE asset_processing_history (
  asset_processing_history_key UUID PRIMARY KEY,
  asset_hub_key UUID NOT NULL REFERENCES asset_hub(asset_hub_key),
  phase_num INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  error_message TEXT
);
```

```typescript
// Before: types file doesn't have this table
// src/lib/types/database.ts

// Expected Detections:
// 1. New table in migrations not in types
//    - Table: asset_processing_history
//    - Confidence: High
//    - Suggestion: Generate new interface
//
// 2. Foreign key relationship detected
//    - References asset_hub
//    - Suggestion: Add to navigation types
//
// 3. Nullable column detected
//    - completed_at, error_message can be null
//    - Suggestion: completed_at?: Date, error_message?: string

### Generated Type:
export interface AssetProcessingHistory {
  asset_processing_history_key: string
  asset_hub_key: string
  phase_num: number
  status: string
  started_at: Date
  completed_at?: Date
  error_message?: string | null
}

// With relationships:
export type AssetProcessingHistoryWithAsset = AssetProcessingHistory & {
  asset_hub?: AssetHub
}
```

**Test Results - Scenario 3**
- [ ] New table detected in migrations
- [ ] Type generated correctly
- [ ] Nullable columns handled
- [ ] Foreign keys recognized
- [ ] Types file updated

---

## Test Scenario 4: Generic Type Constraint Improvements

### Scenario Description
Fix generic type constraints in utility functions.

### Test Case 4.1 - Repository Pattern Generic
```typescript
// File: src/lib/database/repository.ts

export class Repository<T> {  // Constraint missing
  async get(key: string): Promise<T> {
    const result = await db.query('SELECT * FROM ???')  // Unknown table
    return result as T  // Unsafe cast
  }

  async list(): Promise<T[]> {
    const results = await db.query('SELECT * FROM ???')
    return results as T[]
  }
}

// Expected Detections:
// 1. Generic T has no constraints
//    - Confidence: High
//    - Suggestion: T extends { id: string }
//    - Or: T extends DatabaseEntity
//
// 2. Unsafe type cast (as T)
//    - Confidence: High
//    - Suggestion: Proper type checking/assertion
//
// 3. Generic not helping type safety
//    - Confidence: Medium
//    - Suggestion: Make table name generic parameter

### Generated Fixes:
export interface DatabaseEntity {
  [key: string]: unknown
}

export class Repository<T extends DatabaseEntity> {
  constructor(private tableName: string) {}

  async get(key: string): Promise<T | undefined> {
    const result = await db.query<T>(`SELECT * FROM ${this.tableName} WHERE id = $1`, [key])
    return result[0]
  }

  async list(): Promise<T[]> {
    const results = await db.query<T>(`SELECT * FROM ${this.tableName}`)
    return results
  }
}
```

**Test Results - Scenario 4**
- [ ] Generic constraints identified
- [ ] Proper constraints suggested
- [ ] Unsafe casts removed
- [ ] Generic patterns improved

---

## Test Scenario 5: Return Type Inference for Complex Functions

### Scenario Description
Test return type generation for functions with complex control flow.

### Test Case 5.1 - Conditional Return Type
```typescript
// File: src/lib/asset-processing/phase1.ts

export function validateAsset(asset, options) {  // Missing all types
  const errors = []

  if (!asset.name) {
    errors.push('Name is required')
  }

  if (!asset.type || !['image', 'video'].includes(asset.type)) {
    errors.push('Invalid type')
  }

  if (options?.strict && asset.size > 100_000_000) {
    errors.push('File too large')
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true }
}

// Expected Detections:
// 1. Parameters missing types
//    - asset: unknown or Asset type
//    - options: unknown or ValidationOptions type
//
// 2. Return type missing
//    - Confidence: High
//    - Multiple return types: union of two objects
//    - Suggestion: { valid: false; errors: string[] } | { valid: true }
//
// 3. Array push to untyped array
//    - Confidence: Medium
//    - Suggestion: errors: string[]

### Generated Fixes:
interface ValidationOptions {
  strict?: boolean
}

interface Asset {
  name: string
  type: string
  size: number
}

type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] }

export function validateAsset(asset: Asset, options?: ValidationOptions): ValidationResult {
  const errors: string[] = []

  if (!asset.name) {
    errors.push('Name is required')
  }

  if (!asset.type || !['image', 'video'].includes(asset.type)) {
    errors.push('Invalid type')
  }

  if (options?.strict && asset.size > 100_000_000) {
    errors.push('File too large')
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true }
}
```

**Test Results - Scenario 5**
- [ ] Union return type detected
- [ ] Conditional returns handled
- [ ] Parameter types inferred
- [ ] Array types determined

---

## Test Scenario 6: Multiple Features in One File

### Scenario Description
Full service file with issues from all 8 feature categories.

### File: src/services/asset-service.ts

```typescript
export class AssetService {
  // Issue: Parameter has `any` type
  async uploadAsset(file: any, userId: any) {
    // Issue: No return type annotation
    const processed = await this.processFile(file)

    // Issue: Union type not narrowed properly
    const validation = this.validateAsset(processed)

    if (!validation.valid) {
      return validation.error  // Error: error not on invalid result
    }

    // Issue: Missing type annotation
    const saved = await db.query(
      'INSERT INTO asset_hub ...',
      [processed.id, userId, processed.hash]
    )

    // Issue: Generic type not constrained
    const cached = this.cache.set(saved.id, processed)

    return cached
  }

  // Issue: No return type, complex control flow
  private validateAsset(asset) {
    if (!asset.name) {
      return { valid: false, error: 'Missing name' }
    }
    if (asset.size > 500_000_000) {
      return { valid: false, error: 'File too large' }
    }
    return { valid: true }
  }
}
```

**Expected Issues Found**: 15+
**Expected Fixes**: 14+
**Confidence**: >95%

**Test Results - Scenario 6**
- [ ] All 8 feature categories detected issues
- [ ] No false positives
- [ ] Fixes are non-breaking
- [ ] Code compiles after fixes
- [ ] No `any` types remain

---

## Summary

| Scenario | Features Tested | Issues Found | Fixes Applied | Pass |
|----------|---|---|---|---|
| 1. Asset Processing | 5/8 | 4 | 4 | [ ] |
| 2. Union Types | 4/8 | 6 | 6 | [ ] |
| 3. Database Sync | 2/8 | 3 | 3 | [ ] |
| 4. Generics | 3/8 | 4 | 4 | [ ] |
| 5. Return Types | 2/8 | 5 | 5 | [ ] |
| 6. Multiple Features | 8/8 | 15+ | 14+ | [ ] |
| **TOTAL** | **All 8** | **37+** | **36+** | **[ ]** |

## Quality Metrics

- [ ] **Accuracy**: 99%+ (minimal false positives)
- [ ] **Fix Quality**: 98%+ (fixes compile successfully)
- [ ] **Type Inference**: 95%+ accurate for all categories
- [ ] **Performance**: <5 seconds for 500K LOC
- [ ] **Integration**: Works with database, Zod, existing types

**Test Date**: ____________________
**Tester**: ____________________
**Version**: v0.1.0 Beta
**Overall Result**: PASS/FAIL