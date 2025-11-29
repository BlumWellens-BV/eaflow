/**
 * Base properties shared by all elements
 */
export interface BaseElement {
  /** Unique identifier with type prefix (e.g., elem-uuid-1234) */
  id: string;
  /** Element type in notation:Type format (e.g., archimate:ApplicationComponent) */
  type: ElementType;
  /** Human-readable name */
  name: string;
  /** Optional documentation/description */
  documentation?: string | undefined;
  /** Custom properties as key-value pairs */
  properties: ElementProperties;
  /** Tags for categorization and filtering */
  tags: string[];
  /** ISO 8601 creation timestamp */
  created: string;
  /** ISO 8601 last modification timestamp */
  modified: string;
}

/**
 * Element type in format notation:TypeName
 * Examples: archimate:ApplicationComponent, bpmn:Task
 */
export type ElementType = `${string}:${string}`;

/**
 * Custom properties stored on elements
 */
export type ElementProperties = Record<string, string | number | boolean>;

/**
 * Full element type - currently identical to BaseElement
 * Extended notations may add specific properties
 */
export interface Element extends BaseElement {}
