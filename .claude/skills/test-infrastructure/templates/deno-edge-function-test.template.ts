/**
 * Deno Edge Function Test Template
 *
 * Purpose: Scaffolding for testing Supabase Edge Functions (Deno runtime)
 * Use when: Testing MCP server tools, worker functions, or other Edge Functions
 *
 * Key Differences from Vitest/Node Tests:
 * - Uses Deno runtime (jsr: imports, not npm:)
 * - Relative imports require .ts extension
 * - Uses assertEquals/assert instead of expect()
 * - Deno test command: `deno test --allow-env --allow-read {FILE}`
 * - Uses describe/it from jsr:@std/testing (NOT Vitest)
 * - No vi.mock() - use manual mocks and interfaces
 *
 * File Naming Convention:
 * - Unit tests: {feature}_test.ts (e.g., index_test.ts, utils_test.ts)
 * - Integration tests: {feature}_integration_test.ts
 * - Property-based tests: {feature}_property_based_test.ts
 *
 * Location: supabase/functions/{function-name}/__tests/{feature}_test.ts
 *
 * Copyright © 2025 BlumWellens BV All Rights Reserved
 */

/// <reference lib="deno.ns" />

/* ==================== */
/* FILE: supabase/functions/{FUNCTION_NAME}/__tests/{FEATURE_NAME}_test.ts */
/* ==================== */

/**
 * @fileoverview {DESCRIPTION_OF_WHAT_IS_BEING_TESTED}
 *
 * To run the tests:
 * ```bash
 * cd supabase/functions/{FUNCTION_NAME}
 * deno test --allow-env --allow-read __tests/{FEATURE_NAME}_test.ts
 * ```
 */

// ============================================================
// IMPORTS - Deno Test Framework (jsr: imports)
// ============================================================
import { describe, it, beforeEach, afterEach } from 'jsr:@std/testing@^0.224.0/bdd';
import {
  assertEquals,
  assert,
  assertExists,
  assertRejects,
  assertThrows
} from 'jsr:@std/assert@^0.224.0';

// ============================================================
// IMPORTS - Code Under Test (relative with .ts extension)
// ============================================================
import {
  {FUNCTION_NAME},
  type {TYPE_NAME},
} from '../{FILE_NAME}.ts'; // ⚠️ NOTE: .ts extension required

// ============================================================
// TEST SETUP - Mock Interfaces
// ============================================================

// Deno doesn't have vi.mock() - create manual mocks using interfaces

/**
 * Mock Supabase Client Interface
 * Avoids Symbol.dispose issues with real SupabaseClient
 */
interface MockSupabaseClient {
  rpc: (fnName: string, params?: Record<string, unknown>) => { error: unknown | null };
  from: (table: string) => MockQueryBuilder;
  storage: {
    from: (bucket: string) => MockStorageBuilder;
  };
  // Test inspection helpers
  _rpcCalls: unknown[][];
  _queryBuilders: Record<string, MockQueryBuilder>;
  _storageBuilders: Record<string, MockStorageBuilder>;
}

interface MockQueryBuilder {
  select: (columns: string) => MockQueryBuilder;
  insert: (data: Record<string, unknown>) => MockQueryBuilder;
  update: (data: Record<string, unknown>) => MockQueryBuilder;
  eq: (column: string, value: unknown) => MockQueryBuilder;
  is: (column: string, value: unknown) => MockQueryBuilder;
  data: unknown;
  error: unknown | null;
  // Test inspection
  _calls: Record<string, unknown[][]>;
  _setResponse: (data: unknown, error: unknown | null) => void;
}

interface MockStorageBuilder {
  download: (path: string) => Promise<{ data: Blob | null; error: unknown | null }>;
  upload: (path: string, file: Blob) => Promise<{ data: { path: string } | null; error: unknown | null }>;
  list: (path: string) => Promise<{ data: unknown[] | null; error: unknown | null }>;
  remove: (paths: string[]) => Promise<{ data: unknown[] | null; error: unknown | null }>;
  // Test inspection
  _calls: Record<string, unknown[][]>;
  _setResponse: (method: string, data: unknown, error: unknown | null) => void;
}

// ============================================================
// HELPER FUNCTIONS - Mock Builders
// ============================================================

/**
 * Create a mock query builder for database operations
 */
function createMockQueryBuilder(): MockQueryBuilder {
  const calls: Record<string, unknown[][]> = {
    select: [],
    insert: [],
    update: [],
    eq: [],
    is: [],
  };

  let mockData: unknown = null;
  let mockError: unknown = null;

  const builder: MockQueryBuilder = {
    select: columns => {
      calls.select.push([columns]);
      return builder;
    },
    insert: data => {
      calls.insert.push([data]);
      return builder;
    },
    update: data => {
      calls.update.push([data]);
      return builder;
    },
    eq: (column, value) => {
      calls.eq.push([column, value]);
      return builder;
    },
    is: (column, value) => {
      calls.is.push([column, value]);
      return builder;
    },
    get data() {
      return mockData;
    },
    get error() {
      return mockError;
    },
    _calls: calls,
    _setResponse: (data: unknown, error: unknown | null) => {
      mockData = data;
      mockError = error;
    },
  };

  return builder;
}

/**
 * Create a mock storage builder for Supabase Storage operations
 */
function createMockStorageBuilder(): MockStorageBuilder {
  const calls: Record<string, unknown[][]> = {
    download: [],
    list: [],
    upload: [],
    remove: [],
  };

  const responses: Record<string, unknown> = {
    download: { data: new Blob(['mock file content']), error: null },
    list: { data: [], error: null },
    upload: { data: { path: 'mock/path' }, error: null },
    remove: { data: [{ name: 'deleted' }], error: null },
  };

  const builder: MockStorageBuilder = {
    download: path => {
      calls.download.push([path]);
      return Promise.resolve(
        responses.download as { data: Blob | null; error: unknown | null }
      );
    },
    upload: (path, file) => {
      calls.upload.push([path, file]);
      return Promise.resolve(
        responses.upload as { data: { path: string } | null; error: unknown | null }
      );
    },
    list: path => {
      calls.list.push([path]);
      return Promise.resolve(
        responses.list as { data: unknown[] | null; error: unknown | null }
      );
    },
    remove: paths => {
      calls.remove.push([paths]);
      return Promise.resolve(
        responses.remove as { data: unknown[] | null; error: unknown | null }
      );
    },
    _calls: calls,
    _setResponse: (method: string, data: unknown, error: unknown | null) => {
      responses[method] = { data, error };
    },
  };

  return builder;
}

/**
 * Create a complete mock Supabase client
 */
function createMockSupabaseClient(): MockSupabaseClient {
  const rpcCalls: unknown[][] = [];
  const queryBuilders: Record<string, MockQueryBuilder> = {};
  const storageBuilders: Record<string, MockStorageBuilder> = {};

  return {
    rpc: (fnName: string, params?: Record<string, unknown>) => {
      rpcCalls.push([fnName, params]);
      return { error: null };
    },
    from: (table: string) => {
      if (!queryBuilders[table]) {
        queryBuilders[table] = createMockQueryBuilder();
      }
      return queryBuilders[table];
    },
    storage: {
      from: (bucket: string) => {
        if (!storageBuilders[bucket]) {
          storageBuilders[bucket] = createMockStorageBuilder();
        }
        return storageBuilders[bucket];
      },
    },
    _rpcCalls: rpcCalls,
    _queryBuilders: queryBuilders,
    _storageBuilders: storageBuilders,
  };
}

// ============================================================
// TEST SUITE
// ============================================================

describe('{FEATURE_NAME}', () => {
  // Shared test state
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    // Reset mocks before each test
    mockClient = createMockSupabaseClient();
  });

  afterEach(() => {
    // Cleanup after each test (if needed)
    mockClient = null as unknown as MockSupabaseClient;
  });

  // ============================================================
  // UNIT TESTS - Success Cases
  // ============================================================

  it('RED Cycle 1.1: should {BEHAVIOR_DESCRIPTION} successfully', async () => {
    // Arrange: Set up test data and mock responses
    const testInput: {TYPE_NAME} = {
      {FIELD_1}: {VALUE_1},
      {FIELD_2}: {VALUE_2},
    };

    // Configure mock responses
    const expectedData = { id: 'test-id', status: 'success' };
    mockClient.from('{TABLE_NAME}')._setResponse(expectedData, null);

    // Act: Execute the function under test
    const result = await {FUNCTION_NAME}(testInput, mockClient as never);

    // Assert: Verify behavior
    assertEquals(result, expectedData, 'Should return expected data');

    // Assert: Verify database calls
    const queryBuilder = mockClient._queryBuilders['{TABLE_NAME}'];
    assertExists(queryBuilder, 'Should have called from("{TABLE_NAME}")');
    assertEquals(
      queryBuilder._calls.insert.length,
      1,
      'Should have called insert() once'
    );
  });

  // ============================================================
  // UNIT TESTS - Error Cases
  // ============================================================

  it('RED Cycle 2.1: should fail when {ERROR_CONDITION}', async () => {
    // Arrange: Set up error condition
    const invalidInput: {TYPE_NAME} = {
      {FIELD_1}: {INVALID_VALUE},
    };

    // Act & Assert: Verify error is thrown
    await assertRejects(
      async () => await {FUNCTION_NAME}(invalidInput, mockClient as never),
      Error,
      '{EXPECTED_ERROR_MESSAGE}',
      'Should throw error for invalid input'
    );
  });

  it('RED Cycle 2.2: should handle database error gracefully', async () => {
    // Arrange: Configure mock to return database error
    const testInput: {TYPE_NAME} = {
      {FIELD_1}: {VALUE_1},
    };

    const dbError = { message: 'Database constraint failed', code: '23505' };
    mockClient.from('{TABLE_NAME}')._setResponse(null, dbError);

    // Act & Assert: Verify error handling
    await assertRejects(
      async () => await {FUNCTION_NAME}(testInput, mockClient as never),
      Error,
      'Database constraint failed',
      'Should propagate database errors'
    );
  });

  // ============================================================
  // UNIT TESTS - Edge Cases
  // ============================================================

  it('RED Cycle 3.1: should handle empty input', () => {
    // Arrange
    const emptyInput = {};

    // Act
    const result = {FUNCTION_NAME}(emptyInput as {TYPE_NAME}, mockClient as never);

    // Assert: Verify proper handling of empty input
    assertExists(result, 'Should handle empty input without crashing');
  });

  it('RED Cycle 3.2: should handle null/undefined values', () => {
    // Arrange
    const inputWithNulls: Partial<{TYPE_NAME}> = {
      {FIELD_1}: undefined,
      {FIELD_2}: null as never,
    };

    // Act & Assert
    assertThrows(
      () => {FUNCTION_NAME}(inputWithNulls as {TYPE_NAME}, mockClient as never),
      Error,
      'Should reject null/undefined values'
    );
  });

  // ============================================================
  // INTEGRATION TESTS - Storage Operations
  // ============================================================

  it('RED Cycle 4.1: should successfully upload to storage', async () => {
    // Arrange
    const testFile = new Blob(['test content'], { type: 'text/plain' });
    const uploadPath = 'tenant-uuid/uploads/test.txt';

    const storageBuilder = mockClient.storage.from('{BUCKET_NAME}');
    storageBuilder._setResponse('upload', { path: uploadPath }, null);

    // Act
    const uploadResult = await storageBuilder.upload(uploadPath, testFile);

    // Assert
    assertEquals(uploadResult.error, null, 'Upload should succeed');
    assertEquals(uploadResult.data?.path, uploadPath, 'Should return correct path');
    assertEquals(
      storageBuilder._calls.upload.length,
      1,
      'Should have called upload() once'
    );
  });

  // ============================================================
  // BDD SCENARIOS (Given-When-Then)
  // ============================================================

  describe('Scenario: {SCENARIO_NAME}', () => {
    it('should {EXPECTED_BEHAVIOR}', async () => {
      // Given: {PRECONDITION}
      const initialState: {TYPE_NAME} = {
        {FIELD_1}: {VALUE_1},
      };
      mockClient.from('{TABLE_NAME}')._setResponse({ count: 0 }, null);

      // When: {ACTION}
      const result = await {FUNCTION_NAME}(initialState, mockClient as never);

      // Then: {EXPECTED_OUTCOME}
      assertExists(result, 'Result should exist');
      assertEquals(result.status, 'success', 'Status should be success');
    });
  });
});

// ============================================================
// PROPERTY-BASED TESTS (if using fast-check)
// ============================================================

// NOTE: fast-check is available via npm: import for Deno
// import fc from 'npm:fast-check@latest';
//
// describe('Property-Based Tests', () => {
//   it('should satisfy idempotence property', () => {
//     fc.assert(
//       fc.property(fc.string(), (input) => {
//         const once = {FUNCTION_NAME}(input);
//         const twice = {FUNCTION_NAME}(once);
//         assertEquals(twice, once, 'f(f(x)) = f(x)');
//       }),
//       { numRuns: 100 }
//     );
//   });
// });

// ============================================================
// HELPER TEST UTILITIES
// ============================================================

/**
 * Helper: Create test payload with defaults
 */
function createTestPayload(overrides?: Partial<{TYPE_NAME}>): {TYPE_NAME} {
  return {
    {FIELD_1}: {DEFAULT_VALUE_1},
    {FIELD_2}: {DEFAULT_VALUE_2},
    ...overrides,
  };
}

/**
 * Helper: Assert error has expected properties
 */
function assertErrorShape(
  error: unknown,
  expectedKeyword: string,
  expectedPath?: string
): void {
  assert(typeof error === 'object' && error !== null, 'Error should be object');
  const err = error as { keyword?: string; instancePath?: string };

  assertEquals(err.keyword, expectedKeyword, `Should have keyword: ${expectedKeyword}`);

  if (expectedPath !== undefined) {
    assertEquals(
      err.instancePath,
      expectedPath,
      `Should have instancePath: ${expectedPath}`
    );
  }
}

// ============================================================
// VALIDATION TESTS (for AJV validators)
// ============================================================

describe('{VALIDATOR_NAME}', () => {
  it('RED Cycle 5.1: should validate minimal valid payload', () => {
    // Arrange
    const payload: {TYPE_NAME} = {
      tenant_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      {REQUIRED_FIELD}: {VALID_VALUE},
    };

    // Act
    const result = {VALIDATOR_NAME}(payload, false);

    // Assert
    assertEquals(
      result.isValid,
      true,
      `Validation failed: ${result.isValid === false ? JSON.stringify(result.errors, null, 2) : ''}`
    );
  });

  it('RED Cycle 5.2: should fail when required field is missing', () => {
    // Arrange
    const payload = {
      tenant_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      // {REQUIRED_FIELD} is missing
    };

    // Act
    const result = {VALIDATOR_NAME}(payload, false);

    // Assert
    assertEquals(
      result.isValid,
      false,
      'Validation should fail when required field is missing'
    );

    if (!result.isValid) {
      assertExists(result.errors, 'Errors array should exist');
      const hasExpectedError = result.errors.some(
        (e: { keyword?: string; params?: { missingProperty?: string } }) =>
          e.keyword === 'required' && e.params?.missingProperty === '{REQUIRED_FIELD}'
      );
      assert(
        hasExpectedError,
        "Should have a 'required' error for '{REQUIRED_FIELD}'"
      );
    }
  });

  it('RED Cycle 5.3: should fail if additional property is present', () => {
    // Arrange
    const payload = {
      tenant_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      {REQUIRED_FIELD}: {VALID_VALUE},
      unexpected_field: 'should not be allowed',
    };

    // Act
    const result = {VALIDATOR_NAME}(payload, false);

    // Assert
    assertEquals(
      result.isValid,
      false,
      'Validation should fail when additional property is present'
    );

    if (!result.isValid) {
      assertExists(result.errors, 'Errors array should exist');
      const hasExpectedError = result.errors.some(
        (e: { keyword?: string; params?: { additionalProperty?: string } }) =>
          e.keyword === 'additionalProperties' &&
          e.params?.additionalProperty === 'unexpected_field'
      );
      assert(
        hasExpectedError,
        "Should have 'additionalProperties' error for unexpected field"
      );
    }
  });
});

// ============================================================
// USAGE NOTES
// ============================================================

/**
 * DIFFERENCES FROM VITEST/NODE TESTS:
 *
 * 1. IMPORTS:
 *    - Deno uses jsr: imports (NOT npm:)
 *    - Relative imports MUST include .ts extension
 *    - Example: import { foo } from './utils.ts'; // ✅
 *    - Example: import { foo } from './utils';    // ❌ ERROR
 *
 * 2. ASSERTIONS:
 *    - Use assertEquals() not expect().toBe()
 *    - Use assert() not expect().toBeTruthy()
 *    - Use assertExists() not expect().toBeDefined()
 *    - Use assertRejects() for async errors
 *    - Use assertThrows() for sync errors
 *
 * 3. MOCKING:
 *    - No vi.mock() - use manual mocks with interfaces
 *    - Create mock builders for complex objects
 *    - Use Object.defineProperty() for import.meta mocking
 *
 * 4. RUNNING TESTS:
 *    - Command: deno test --allow-env --allow-read {FILE}
 *    - NOT: pnpm test or vitest
 *    - Permissions required: --allow-env, --allow-read, --allow-net
 *
 * 5. TEST STRUCTURE:
 *    - Same describe/it structure as Vitest
 *    - Same beforeEach/afterEach hooks
 *    - Use "RED Cycle X.Y" naming for TDD
 *
 * 6. FILE NAMING:
 *    - Use {feature}_test.ts (NOT .test.ts or .spec.ts)
 *    - Deno convention: index_test.ts, utils_test.ts
 *    - Node convention: index.test.ts, utils.spec.ts
 *
 * 7. TYPES:
 *    - Import types from source with .ts extension
 *    - Use `as never` to cast mocks to complex types
 *    - Prefix unused imports with _ to avoid lint warnings
 *
 * 8. COVERAGE:
 *    - Use: deno test --coverage=coverage {FILE}
 *    - Generate report: deno coverage coverage --lcov > coverage.lcov
 */
