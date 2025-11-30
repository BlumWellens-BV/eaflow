/**
 * BDD (Behavior-Driven Development) Scenario Test Template
 *
 * Uses Given-When-Then pattern to describe behavior from user perspective
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { {IMPORTS} } from '@/{MODULE_PATH}';

describe('Feature: {FEATURE_NAME}', () => {
  // Shared test context
  let {CONTEXT_VARIABLES};

  beforeEach(async () => {
    // Setup shared context for all scenarios
    {SETUP_CODE}
  });

  afterEach(async () => {
    // Cleanup after each scenario
    {TEARDOWN_CODE}
  });

  /**
   * Scenario: {SCENARIO_NAME}
   *
   * User Story:
   * As a {USER_ROLE}
   * I want to {ACTION}
   * So that {BENEFIT}
   */
  it('Scenario: {SCENARIO_NAME}', async () => {
    // Given: Initial context/preconditions
    {GIVEN_SETUP}

    // When: Action performed
    {WHEN_ACTION}

    // Then: Expected outcome
    {THEN_ASSERTIONS}
  });

  /**
   * Scenario: {SCENARIO_NAME_2}
   *
   * User Story:
   * As a {USER_ROLE}
   * I want to {ACTION}
   * So that {BENEFIT}
   */
  it('Scenario: {SCENARIO_NAME_2}', async () => {
    // Given: Different initial context
    {GIVEN_SETUP_2}

    // When: Same or different action
    {WHEN_ACTION_2}

    // Then: Different expected outcome
    {THEN_ASSERTIONS_2}
  });
});

// ==========================================
// EXAMPLE: Asset Upload Feature (BDD Style)
// ==========================================

describe('Feature: Asset Upload', () => {
  let mockSupabase: SupabaseClient;
  let mockRequest: NextRequest;
  const TENANT_ID = 'ten_01234567890123456789';
  const USER_ID = 'usr_01234567890123456789';

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient(USER_ID, TENANT_ID);
  });

  /**
   * Scenario: Authenticated user uploads valid image
   *
   * User Story:
   * As an authenticated user
   * I want to upload an image file
   * So that I can use it in my projects
   */
  it('Scenario: Authenticated user uploads valid image', async () => {
    // Given: I am authenticated with a tenant
    const authHeaders = {
      'Authorization': 'Bearer valid-token',
      'X-Tenant-ID': TENANT_ID,
    };

    // And: I have a valid image file
    const validImageFile = new File(['image data'], 'photo.jpg', {
      type: 'image/jpeg',
    });

    // When: I upload the image through the API
    const formData = new FormData();
    formData.append('file', validImageFile);

    mockRequest = new NextRequest('http://localhost:3000/api/v1/assets', {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    const response = await POST(mockRequest);

    // Then: The upload should succeed
    expect(response.status).toBe(201);

    // And: I should receive the asset details
    const data = await response.json();
    expect(data).toMatchObject({
      id: expect.stringMatching(/^ast_/),
      filename: 'photo.jpg',
      content_type: 'image/jpeg',
      tenant_id: TENANT_ID,
    });

    // And: The asset should be stored in my tenant's storage
    expect(data.storage_path).toContain(TENANT_ID);
  });

  /**
   * Scenario: Unauthenticated user attempts upload
   *
   * User Story:
   * As a security measure
   * I want unauthenticated requests to be rejected
   * So that only authorized users can upload assets
   */
  it('Scenario: Unauthenticated user attempts upload', async () => {
    // Given: I am NOT authenticated
    // (no auth headers)

    // And: I have a valid file
    const file = new File(['data'], 'file.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file);

    // When: I attempt to upload through the API
    mockRequest = new NextRequest('http://localhost:3000/api/v1/assets', {
      method: 'POST',
      body: formData,
      // No Authorization header
    });

    const response = await POST(mockRequest);

    // Then: The upload should be rejected
    expect(response.status).toBe(401);

    // And: I should receive an error message
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  /**
   * Scenario: User uploads invalid file type
   *
   * User Story:
   * As a platform administrator
   * I want to reject unsupported file types
   * So that only safe, processable files are stored
   */
  it('Scenario: User uploads invalid file type', async () => {
    // Given: I am authenticated
    const authHeaders = {
      'Authorization': 'Bearer valid-token',
      'X-Tenant-ID': TENANT_ID,
    };

    // And: I have a file with an unsupported type
    const invalidFile = new File(['malicious code'], 'virus.exe', {
      type: 'application/x-msdownload',
    });

    // When: I attempt to upload the file
    const formData = new FormData();
    formData.append('file', invalidFile);

    mockRequest = new NextRequest('http://localhost:3000/api/v1/assets', {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    const response = await POST(mockRequest);

    // Then: The upload should be rejected
    expect(response.status).toBe(400);

    // And: I should receive a validation error
    const data = await response.json();
    expect(data.error).toContain('Unsupported file type');

    // And: The file should NOT be stored
    expect(mockSupabase.storage.from).not.toHaveBeenCalled();
  });

  /**
   * Scenario: User from Tenant A cannot access Tenant B's assets
   *
   * User Story:
   * As a security measure
   * I want tenant isolation to be enforced
   * So that users can only access their own tenant's data
   */
  it('Scenario: User from Tenant A cannot access Tenant B assets', async () => {
    // Given: There is an asset belonging to Tenant B
    const TENANT_B_ID = 'ten_BBBBBBBBBBBBBBBBBBBB';
    const assetFromTenantB = await createMockAsset(mockSupabase, {
      id: 'ast_12345',
      tenant_id: TENANT_B_ID,
      filename: 'secret.pdf',
    });

    // And: I am authenticated as a user in Tenant A
    mockSupabase = createMockSupabaseClient(USER_ID, TENANT_ID); // Tenant A

    // When: I attempt to retrieve the asset from Tenant B
    mockRequest = new NextRequest(
      `http://localhost:3000/api/v1/assets/${assetFromTenantB.id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer valid-token',
          'X-Tenant-ID': TENANT_ID, // Tenant A
        },
      }
    );

    const response = await GET(mockRequest, { params: { id: assetFromTenantB.id } });

    // Then: The request should be rejected
    expect(response.status).toBe(404); // Not found (for security, don't reveal existence)

    // And: I should NOT receive the asset data
    const data = await response.json();
    expect(data).not.toHaveProperty('filename');
  });
});

// ==========================================
// BDD Helper Functions
// ==========================================

/**
 * Helper: Create Given-When-Then test structure
 */
export function createBDDTest({
  scenario,
  userStory,
  given,
  when,
  then,
}: {
  scenario: string;
  userStory: { role: string; action: string; benefit: string };
  given: () => void | Promise<void>;
  when: () => void | Promise<void>;
  then: () => void | Promise<void>;
}) {
  return async () => {
    // Execute Given
    await given();

    // Execute When
    await when();

    // Execute Then
    await then();
  };
}

/**
 * Example usage of BDD helper:
 */
it(
  'Scenario: User successfully logs in',
  createBDDTest({
    scenario: 'User successfully logs in',
    userStory: {
      role: 'registered user',
      action: 'log in with valid credentials',
      benefit: 'I can access my account',
    },
    given: async () => {
      // User exists in database
      await createMockUser({ email: 'user@example.com', password: 'hashedPassword' });
    },
    when: async () => {
      // User submits login form
      await submitLoginForm('user@example.com', 'password123');
    },
    then: async () => {
      // User is redirected to dashboard
      expect(currentUrl()).toBe('/dashboard');
      // User session is created
      expect(sessionStorage.getItem('userId')).toBeTruthy();
    },
  })
);

// ==========================================
// BDD Best Practices
// ==========================================

/**
 * 1. Write scenarios from user perspective (not technical implementation)
 *    ✅ "User uploads an image"
 *    ❌ "POST /api/v1/assets returns 201"
 *
 * 2. Use clear, descriptive Given-When-Then structure
 *    ✅ Given: "I am authenticated as user A"
 *    ❌ Given: "mockAuth returns true"
 *
 * 3. Focus on behavior, not implementation details
 *    ✅ Then: "The asset should be visible in my gallery"
 *    ❌ Then: "The database should have 1 row in sat_asset_metadata"
 *
 * 4. Include user stories for context
 *    Helps team understand WHY the feature exists
 *
 * 5. Test both happy paths and edge cases
 *    - Success scenarios
 *    - Error scenarios
 *    - Security scenarios
 *    - Edge cases
 *
 * 6. Use domain language (not technical jargon)
 *    ✅ "project", "image", "gallery"
 *    ❌ "sat_asset_metadata", "RLS policy", "foreign key"
 */
