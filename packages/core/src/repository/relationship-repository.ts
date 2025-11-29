import type {
  Relationship,
  RelationshipType,
  AccessType,
} from '../types/relationship.js';
import type { Metamodel, ValidConnection } from '../types/metamodel.js';
import { relationshipSchema } from '../schemas/index.js';
import { generateId } from '../utils/id.js';
import type { ElementRepository } from './element-repository.js';

/**
 * Options for creating a new relationship
 */
export interface CreateRelationshipOptions {
  type: RelationshipType;
  sourceId: string;
  targetId: string;
  name?: string;
  documentation?: string;
  properties?: Record<string, string | number | boolean>;
  accessType?: AccessType;
  influenceStrength?: string;
}

/**
 * Options for updating an existing relationship
 */
export interface UpdateRelationshipOptions {
  name?: string;
  documentation?: string;
  properties?: Record<string, string | number | boolean>;
  accessType?: AccessType;
  influenceStrength?: string;
}

/**
 * Result of relationship validation
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Repository for managing relationships with validation against metamodel
 */
export class RelationshipRepository {
  private relationships: Map<string, Relationship> = new Map();
  private metamodel: Metamodel | null = null;
  private elementRepository: ElementRepository | null = null;

  /**
   * Set the metamodel for relationship validation
   */
  setMetamodel(metamodel: Metamodel): void {
    this.metamodel = metamodel;
  }

  /**
   * Set the element repository for cross-reference validation
   */
  setElementRepository(elementRepository: ElementRepository): void {
    this.elementRepository = elementRepository;
  }

  /**
   * Validate a relationship against the metamodel
   */
  validate(options: CreateRelationshipOptions): ValidationResult {
    const errors: string[] = [];

    // Check if source element exists
    if (this.elementRepository && !this.elementRepository.has(options.sourceId)) {
      errors.push(`Source element '${options.sourceId}' not found`);
    }

    // Check if target element exists
    if (this.elementRepository && !this.elementRepository.has(options.targetId)) {
      errors.push(`Target element '${options.targetId}' not found`);
    }

    // Check metamodel constraints
    if (this.metamodel && this.elementRepository) {
      const sourceElement = this.elementRepository.get(options.sourceId);
      const targetElement = this.elementRepository.get(options.targetId);

      if (sourceElement && targetElement) {
        const relationshipDef = this.metamodel.relationshipTypes.find(
          (rt) => rt.id === options.type
        );

        if (!relationshipDef) {
          errors.push(`Unknown relationship type: ${options.type}`);
        } else if (Array.isArray(relationshipDef.validConnections)) {
          const validConns = relationshipDef.validConnections as ValidConnection[];
          const isValid = validConns.some(
            (vc) =>
              vc.source === sourceElement.type && vc.target === targetElement.type
          );

          if (!isValid) {
            errors.push(
              `Invalid connection: ${sourceElement.type} cannot have ` +
                `${options.type} relationship to ${targetElement.type}`
            );
          }
        }
        // If validConnections is a string rule, we skip validation for now
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a new relationship
   * @param options - Relationship options
   * @param skipValidation - Skip metamodel validation (useful for imports)
   */
  create(
    options: CreateRelationshipOptions,
    skipValidation = false
  ): Relationship {
    if (!skipValidation) {
      const validation = this.validate(options);
      if (!validation.valid) {
        throw new Error(`Invalid relationship: ${validation.errors.join(', ')}`);
      }
    }

    const relationship: Relationship = {
      id: generateId('rel'),
      type: options.type,
      sourceId: options.sourceId,
      targetId: options.targetId,
      name: options.name,
      documentation: options.documentation,
      properties: options.properties ?? {},
      accessType: options.accessType,
      influenceStrength: options.influenceStrength,
    };

    // Validate with Zod
    relationshipSchema.parse(relationship);

    this.relationships.set(relationship.id, relationship);
    return relationship;
  }

  /**
   * Get a relationship by ID
   */
  get(id: string): Relationship | undefined {
    return this.relationships.get(id);
  }

  /**
   * Get all relationships
   */
  getAll(): Relationship[] {
    return Array.from(this.relationships.values());
  }

  /**
   * Get relationships by type
   */
  getByType(type: RelationshipType): Relationship[] {
    return this.getAll().filter((rel) => rel.type === type);
  }

  /**
   * Get all relationships from a specific element
   */
  getFromElement(elementId: string): Relationship[] {
    return this.getAll().filter((rel) => rel.sourceId === elementId);
  }

  /**
   * Get all relationships to a specific element
   */
  getToElement(elementId: string): Relationship[] {
    return this.getAll().filter((rel) => rel.targetId === elementId);
  }

  /**
   * Get all relationships connected to an element (either source or target)
   */
  getForElement(elementId: string): Relationship[] {
    return this.getAll().filter(
      (rel) => rel.sourceId === elementId || rel.targetId === elementId
    );
  }

  /**
   * Update an existing relationship
   */
  update(
    id: string,
    options: UpdateRelationshipOptions
  ): Relationship | undefined {
    const existing = this.relationships.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Relationship = {
      ...existing,
      name: options.name ?? existing.name,
      documentation: options.documentation ?? existing.documentation,
      properties: options.properties ?? existing.properties,
      accessType: options.accessType ?? existing.accessType,
      influenceStrength: options.influenceStrength ?? existing.influenceStrength,
    };

    // Validate with Zod
    relationshipSchema.parse(updated);

    this.relationships.set(id, updated);
    return updated;
  }

  /**
   * Delete a relationship by ID
   */
  delete(id: string): boolean {
    return this.relationships.delete(id);
  }

  /**
   * Delete all relationships connected to an element
   * (useful when deleting an element)
   */
  deleteForElement(elementId: string): number {
    const toDelete = this.getForElement(elementId);
    for (const rel of toDelete) {
      this.relationships.delete(rel.id);
    }
    return toDelete.length;
  }

  /**
   * Check if a relationship exists
   */
  has(id: string): boolean {
    return this.relationships.has(id);
  }

  /**
   * Get the count of relationships
   */
  count(): number {
    return this.relationships.size;
  }

  /**
   * Clear all relationships
   */
  clear(): void {
    this.relationships.clear();
  }

  /**
   * Load relationships from an array (e.g., from JSON)
   */
  loadFromArray(relationships: Relationship[]): void {
    for (const relationship of relationships) {
      relationshipSchema.parse(relationship);
      this.relationships.set(relationship.id, relationship);
    }
  }

  /**
   * Export all relationships as an array (e.g., for JSON serialization)
   */
  toArray(): Relationship[] {
    return this.getAll();
  }
}
