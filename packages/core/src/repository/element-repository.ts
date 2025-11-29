import type { Element, ElementType, ElementProperties } from '../types/element.js';
import { elementSchema } from '../schemas/index.js';
import { generateId } from '../utils/id.js';

/**
 * Options for creating a new element
 */
export interface CreateElementOptions {
  type: ElementType;
  name: string;
  documentation?: string;
  properties?: ElementProperties;
  tags?: string[];
}

/**
 * Options for updating an existing element
 */
export interface UpdateElementOptions {
  name?: string;
  documentation?: string;
  properties?: ElementProperties;
  tags?: string[];
}

/**
 * Repository for managing elements in-memory with optional persistence
 */
export class ElementRepository {
  private elements: Map<string, Element> = new Map();

  /**
   * Create a new element
   */
  create(options: CreateElementOptions): Element {
    const now = new Date().toISOString();
    const element: Element = {
      id: generateId('elem'),
      type: options.type,
      name: options.name,
      documentation: options.documentation,
      properties: options.properties ?? {},
      tags: options.tags ?? [],
      created: now,
      modified: now,
    };

    // Validate with Zod
    elementSchema.parse(element);

    this.elements.set(element.id, element);
    return element;
  }

  /**
   * Get an element by ID
   */
  get(id: string): Element | undefined {
    return this.elements.get(id);
  }

  /**
   * Get all elements
   */
  getAll(): Element[] {
    return Array.from(this.elements.values());
  }

  /**
   * Get elements by type
   */
  getByType(type: ElementType): Element[] {
    return this.getAll().filter((el) => el.type === type);
  }

  /**
   * Get elements by layer (prefix of type)
   */
  getByLayer(layer: string): Element[] {
    const prefix = `${layer}:`;
    return this.getAll().filter((el) => el.type.startsWith(prefix));
  }

  /**
   * Get elements with a specific tag
   */
  getByTag(tag: string): Element[] {
    return this.getAll().filter((el) => el.tags.includes(tag));
  }

  /**
   * Search elements by name (case-insensitive)
   */
  searchByName(query: string): Element[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((el) =>
      el.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Update an existing element
   */
  update(id: string, options: UpdateElementOptions): Element | undefined {
    const existing = this.elements.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Element = {
      ...existing,
      name: options.name ?? existing.name,
      documentation: options.documentation ?? existing.documentation,
      properties: options.properties ?? existing.properties,
      tags: options.tags ?? existing.tags,
      modified: new Date().toISOString(),
    };

    // Validate with Zod
    elementSchema.parse(updated);

    this.elements.set(id, updated);
    return updated;
  }

  /**
   * Delete an element by ID
   * @returns true if element was deleted, false if not found
   */
  delete(id: string): boolean {
    return this.elements.delete(id);
  }

  /**
   * Check if an element exists
   */
  has(id: string): boolean {
    return this.elements.has(id);
  }

  /**
   * Get the count of elements
   */
  count(): number {
    return this.elements.size;
  }

  /**
   * Clear all elements
   */
  clear(): void {
    this.elements.clear();
  }

  /**
   * Load elements from an array (e.g., from JSON)
   */
  loadFromArray(elements: Element[]): void {
    for (const element of elements) {
      elementSchema.parse(element);
      this.elements.set(element.id, element);
    }
  }

  /**
   * Export all elements as an array (e.g., for JSON serialization)
   */
  toArray(): Element[] {
    return this.getAll();
  }
}
