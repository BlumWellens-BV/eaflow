/**
 * Property-Based Testing Template
 *
 * Uses fast-check library for generative testing
 * Tests properties that should hold for ALL possible inputs
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { {IMPORTS} } from '@/{MODULE_PATH}';

// ==========================================
// Property-Based Test Template
// ==========================================

describe('Property: {PROPERTY_NAME}', () => {
  it('holds for all generated inputs', () => {
    fc.assert(
      fc.property(
        {ARBITRARY_GENERATORS}, // Input generators
        ({INPUT_VARIABLES}) => {
          // Execute function under test
          const result = {FUNCTION_NAME}({INPUT_VARIABLES});

          // Assert property holds
          expect(result).{PROPERTY_ASSERTION};
        }
      ),
      { numRuns: {NUM_RUNS} } // Number of test cases to generate
    );
  });
});

// ==========================================
// EXAMPLE 1: Idempotence Property
// ==========================================

/**
 * Property: Applying slugify twice produces same result as applying once
 * (Idempotence: f(f(x)) = f(x))
 */
describe('Property: slugify is idempotent', () => {
  it('produces same result when applied twice', () => {
    fc.assert(
      fc.property(
        fc.string(), // Generate random strings
        (input) => {
          const once = slugify(input);
          const twice = slugify(once);

          // Property: f(f(x)) = f(x)
          expect(twice).toBe(once);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ==========================================
// EXAMPLE 2: Inverse Functions Property
// ==========================================

/**
 * Property: Encoding and then decoding returns original value
 * (Inverse: decode(encode(x)) = x)
 */
describe('Property: encode/decode are inverses', () => {
  it('roundtrip preserves original value', () => {
    fc.assert(
      fc.property(
        fc.object(), // Generate random objects
        (original) => {
          const encoded = encodeData(original);
          const decoded = decodeData(encoded);

          // Property: decode(encode(x)) = x
          expect(decoded).toEqual(original);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ==========================================
// EXAMPLE 3: Commutativity Property
// ==========================================

/**
 * Property: Order of merging objects doesn't matter
 * (Commutativity: merge(a, b) = merge(b, a))
 */
describe('Property: merge is commutative', () => {
  it('produces same result regardless of order', () => {
    fc.assert(
      fc.property(
        fc.object(), // First object
        fc.object(), // Second object
        (objA, objB) => {
          const mergeAB = mergeObjects(objA, objB);
          const mergeBA = mergeObjects(objB, objA);

          // Property: f(a, b) = f(b, a)
          expect(mergeAB).toEqual(mergeBA);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ==========================================
// EXAMPLE 4: Invariant Property
// ==========================================

/**
 * Property: Sorting never increases array length
 * (Invariant: length(sort(arr)) = length(arr))
 */
describe('Property: sort preserves array length', () => {
  it('never changes array length', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()), // Generate random integer arrays
        (arr) => {
          const sorted = [...arr].sort((a, b) => a - b);

          // Property: length is preserved
          expect(sorted.length).toBe(arr.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ==========================================
// EXAMPLE 5: Validation Property
// ==========================================

/**
 * Property: Valid email always passes validation
 * (Domain constraint)
 */
describe('Property: email validation accepts valid emails', () => {
  it('accepts all valid email formats', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(), // Built-in email generator
        (email) => {
          const result = validateEmail(email);

          // Property: valid emails are accepted
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects all invalid email formats', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes('@')), // Strings without @
        (invalidEmail) => {
          const result = validateEmail(invalidEmail);

          // Property: invalid emails are rejected
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ==========================================
// EXAMPLE 6: Business Logic Property
// ==========================================

/**
 * Property: Tenant ID is always preserved in asset operations
 * (Security invariant for multi-tenant system)
 */
describe('Property: tenant_id is preserved in asset transformations', () => {
  it('never changes tenant_id during any operation', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          tenant_id: fc.string(),
          filename: fc.string(),
          size_bytes: fc.nat(),
        }), // Generate random asset objects
        async (asset) => {
          // Apply various transformations
          const renamed = await renameAsset(asset, 'new-name.jpg');
          const resized = await resizeAsset(asset, { width: 800, height: 600 });
          const tagged = await addTags(asset, ['tag1', 'tag2']);

          // Property: tenant_id NEVER changes
          expect(renamed.tenant_id).toBe(asset.tenant_id);
          expect(resized.tenant_id).toBe(asset.tenant_id);
          expect(tagged.tenant_id).toBe(asset.tenant_id);
        }
      ),
      { numRuns: 50 } // Fewer runs for async operations
    );
  });
});

// ==========================================
// Fast-Check Generators (Arbitraries)
// ==========================================

/**
 * Common generators for property-based testing
 */

// Custom generator: Valid tenant ID
const tenantIdArbitrary = fc
  .stringMatching(/^ten_[0-9a-zA-Z]{20}$/)
  .map((s) => s || 'ten_01234567890123456789');

// Custom generator: Valid asset with tenant
const assetArbitrary = fc.record({
  id: fc.stringMatching(/^ast_[0-9a-zA-Z]{20}$/),
  tenant_id: tenantIdArbitrary,
  filename: fc.string({ minLength: 1, maxLength: 255 }),
  content_type: fc.constantFrom(
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4'
  ),
  size_bytes: fc.nat({ max: 100_000_000 }), // Max 100MB
  storage_path: fc.string(),
  uploaded_at: fc.date().map((d) => d.toISOString()),
});

// Custom generator: Pagination params
const paginationArbitrary = fc.record({
  page: fc.nat({ max: 1000 }),
  limit: fc.integer({ min: 1, max: 100 }),
  sort: fc.constantFrom('asc', 'desc'),
  sortBy: fc.constantFrom('created_at', 'filename', 'size_bytes'),
});

// Example usage of custom generators
describe('Property: pagination never returns negative page numbers', () => {
  it('always returns page >= 1', () => {
    fc.assert(
      fc.property(
        paginationArbitrary,
        fc.array(assetArbitrary), // Array of assets
        (params, assets) => {
          const result = paginateAssets(assets, params);

          // Property: page number is always >= 1
          expect(result.pagination.page).toBeGreaterThanOrEqual(1);
        }
      )
    );
  });
});

// ==========================================
// Property-Based Testing Patterns
// ==========================================

/**
 * Pattern 1: Oracle Pattern
 * Compare implementation against known-correct reference
 */
describe('Property: custom sort matches native sort', () => {
  it('produces same result as Array.prototype.sort', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const customSorted = customSort([...arr]);
        const nativeSorted = [...arr].sort((a, b) => a - b);

        // Property: matches oracle implementation
        expect(customSorted).toEqual(nativeSorted);
      })
    );
  });
});

/**
 * Pattern 2: Invariant Pattern
 * Property that should ALWAYS hold
 */
describe('Property: balance never goes negative', () => {
  it('maintains non-negative balance after any transaction', () => {
    fc.assert(
      fc.property(
        fc.nat(), // Initial balance
        fc.array(fc.integer({ min: -1000, max: 1000 })), // Transactions
        (initialBalance, transactions) => {
          let balance = initialBalance;

          for (const transaction of transactions) {
            balance = processTransaction(balance, transaction);

            // Property: balance >= 0 (invariant)
            expect(balance).toBeGreaterThanOrEqual(0);
          }
        }
      )
    );
  });
});

/**
 * Pattern 3: Metamorphic Pattern
 * Relationship between inputs and outputs
 */
describe('Property: doubling input doubles output', () => {
  it('scales linearly with input', () => {
    fc.assert(
      fc.property(fc.nat(), (n) => {
        const result1 = calculateCost(n);
        const result2 = calculateCost(n * 2);

        // Property: f(2x) = 2 * f(x)
        expect(result2).toBe(result1 * 2);
      })
    );
  });
});

/**
 * Pattern 4: Error Boundary Pattern
 * System handles invalid inputs gracefully
 */
describe('Property: API never returns 500 for bad input', () => {
  it('returns 4xx for any invalid input, never 5xx', () => {
    fc.assert(
      fc.property(
        fc.anything(), // Generate ANY input
        async (input) => {
          const response = await POST(createRequest(input));

          // Property: bad input → 4xx, never 5xx
          if (response.status >= 400) {
            expect(response.status).toBeLessThan(500);
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});

// ==========================================
// When to Use Property-Based Testing
// ==========================================

/**
 * ✅ Use property-based testing when:
 *
 * 1. Function has mathematical properties
 *    - Commutativity: f(a,b) = f(b,a)
 *    - Associativity: f(f(a,b),c) = f(a,f(b,c))
 *    - Idempotence: f(f(x)) = f(x)
 *    - Inverse: g(f(x)) = x
 *
 * 2. Function has invariants
 *    - Array length preserved after sort
 *    - Balance never negative
 *    - tenant_id never changes
 *
 * 3. Function has domain constraints
 *    - Valid email always accepted
 *    - Invalid input always rejected
 *
 * 4. Testing against oracle
 *    - Custom implementation matches library
 *    - Optimized version matches naive version
 *
 * 5. Error handling
 *    - System never crashes on bad input
 *    - Always returns appropriate error codes
 *
 * ❌ DON'T use property-based testing when:
 *
 * 1. No clear property to test
 * 2. Behavior is inherently random (unless testing randomness properties)
 * 3. Testing external side effects (database writes, API calls)
 * 4. Behavior depends on global state
 * 5. Example-based testing is clearer and sufficient
 *
 * 💡 Best Practice: Combine both approaches
 *    - Example-based: Document specific important cases
 *    - Property-based: Verify general properties hold
 */

// ==========================================
// Property-Based Testing Configuration
// ==========================================

/**
 * Configure fast-check for your needs
 */

// More test runs for critical functions
describe('Property: password hashing (critical)', () => {
  it('never returns plaintext password', () => {
    fc.assert(
      fc.property(fc.string(), (password) => {
        const hashed = hashPassword(password);
        expect(hashed).not.toBe(password);
      }),
      { numRuns: 1000 } // More runs for security-critical code
    );
  });
});

// Seed for reproducible failures
describe('Property: reproducible test', () => {
  it('can be reproduced with seed', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(calculate(n)).toBeGreaterThanOrEqual(0);
      }),
      { seed: 42 } // Same seed = same random values
    );
  });
});

// Verbose mode for debugging
describe('Property: debugging failures', () => {
  it('shows counterexamples when property fails', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        // Property that might fail
        expect(calculate(n)).toBeGreaterThan(0);
      }),
      { verbose: true } // Shows which input caused failure
    );
  });
});

// ==========================================
// Common Fast-Check Generators
// ==========================================

/**
 * Reference: Useful arbitrary generators
 */

// Primitives
fc.boolean(); // true | false
fc.integer(); // any integer
fc.nat(); // non-negative integer
fc.float(); // floating point number
fc.string(); // any string
fc.char(); // single character

// Strings with constraints
fc.string({ minLength: 5, maxLength: 20 });
fc.stringMatching(/^[a-z]+$/); // Regex pattern
fc.hexaString(); // Hex string
fc.base64String(); // Base64 string

// Built-in domains
fc.emailAddress(); // Valid email
fc.webUrl(); // Valid URL
fc.date(); // Date object
fc.uuid(); // UUID v4

// Collections
fc.array(fc.integer()); // Array of integers
fc.set(fc.string()); // Set of strings
fc.dictionary(fc.string(), fc.integer()); // Object

// Composite types
fc.record({
  name: fc.string(),
  age: fc.nat({ max: 120 }),
  email: fc.emailAddress(),
});

// Custom constraints
fc.integer({ min: 0, max: 100 }); // Range
fc.string().filter((s) => s.length > 0); // Non-empty
fc.array(fc.nat(), { minLength: 1, maxLength: 10 }); // Array size
