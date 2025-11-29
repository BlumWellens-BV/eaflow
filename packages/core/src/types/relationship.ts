/**
 * Base relationship connecting two elements
 */
export interface BaseRelationship {
  /** Unique identifier with type prefix (e.g., rel-uuid-5678) */
  id: string;
  /** Relationship type in notation:Type format (e.g., archimate:Serving) */
  type: RelationshipType;
  /** Optional name/label for the relationship */
  name?: string | undefined;
  /** Source element ID */
  sourceId: string;
  /** Target element ID */
  targetId: string;
  /** Optional documentation */
  documentation?: string | undefined;
  /** Custom properties */
  properties: Record<string, string | number | boolean>;
}

/**
 * Relationship type in format notation:TypeName
 * Examples: archimate:Serving, archimate:Assignment
 */
export type RelationshipType = `${string}:${string}`;

/**
 * Access relationship modifiers
 */
export type AccessType = 'read' | 'write' | 'readwrite' | 'access';

/**
 * Full relationship with optional notation-specific properties
 */
export interface Relationship extends BaseRelationship {
  /** For Access relationships: type of access */
  accessType?: AccessType | undefined;
  /** For Influence relationships: strength indicator */
  influenceStrength?: string | undefined;
}
