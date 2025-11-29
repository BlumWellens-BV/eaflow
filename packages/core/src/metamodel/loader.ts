import type { Metamodel, ElementTypeDefinition } from '../types/metamodel.js';

/**
 * Loader and manager for notation metamodels
 */
export class MetamodelLoader {
  private metamodels: Map<string, Metamodel> = new Map();

  /**
   * Register a metamodel
   */
  register(metamodel: Metamodel): void {
    this.metamodels.set(metamodel.id, metamodel);
  }

  /**
   * Get a metamodel by ID
   */
  get(id: string): Metamodel | undefined {
    return this.metamodels.get(id);
  }

  /**
   * Get all registered metamodels
   */
  getAll(): Metamodel[] {
    return Array.from(this.metamodels.values());
  }

  /**
   * Get all registered metamodel IDs
   */
  getIds(): string[] {
    return Array.from(this.metamodels.keys());
  }

  /**
   * Check if a metamodel is registered
   */
  has(id: string): boolean {
    return this.metamodels.has(id);
  }

  /**
   * Find an element type definition across all metamodels
   */
  findElementType(typeId: string): ElementTypeDefinition | undefined {
    for (const metamodel of this.metamodels.values()) {
      const found = metamodel.elementTypes.find((et) => et.id === typeId);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  /**
   * Get the layer for an element type
   */
  getLayerForType(typeId: string): string | undefined {
    const elementType = this.findElementType(typeId);
    if (!elementType) {
      return undefined;
    }

    // Extract notation ID from type (e.g., 'archimate' from 'archimate:ApplicationComponent')
    const notationId = typeId.split(':')[0];
    const metamodel = this.metamodels.get(notationId!);
    if (!metamodel) {
      return undefined;
    }

    const layer = metamodel.layers.find((l) => l.id === elementType.layer);
    return layer?.name;
  }

  /**
   * Get the default color for an element type
   */
  getColorForType(typeId: string): string | undefined {
    const elementType = this.findElementType(typeId);
    if (!elementType) {
      return undefined;
    }

    const notationId = typeId.split(':')[0];
    const metamodel = this.metamodels.get(notationId!);
    if (!metamodel) {
      return undefined;
    }

    const layer = metamodel.layers.find((l) => l.id === elementType.layer);
    return layer?.color;
  }

  /**
   * Get all element types for a specific layer
   */
  getElementTypesForLayer(
    metamodelId: string,
    layerId: string
  ): ElementTypeDefinition[] {
    const metamodel = this.metamodels.get(metamodelId);
    if (!metamodel) {
      return [];
    }
    return metamodel.elementTypes.filter((et) => et.layer === layerId);
  }

  /**
   * Clear all registered metamodels
   */
  clear(): void {
    this.metamodels.clear();
  }
}
