/**
 * A notation metamodel definition (e.g., ArchiMate, BPMN)
 */
export interface Metamodel {
  /** Unique identifier for the notation (e.g., 'archimate') */
  id: string;
  /** Human-readable name */
  name: string;
  /** Version of the notation */
  version: string;
  /** Layers/categories of elements */
  layers: MetamodelLayer[];
  /** Available element types */
  elementTypes: ElementTypeDefinition[];
  /** Available relationship types */
  relationshipTypes: RelationshipTypeDefinition[];
  /** Viewpoint definitions */
  viewpoints: ViewpointDefinition[];
}

/**
 * A layer/category of elements (e.g., Business, Application, Technology)
 */
export interface MetamodelLayer {
  /** Layer identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Default color for elements in this layer */
  color: string;
}

/**
 * Definition of an element type
 */
export interface ElementTypeDefinition {
  /** Full type ID (e.g., archimate:ApplicationComponent) */
  id: string;
  /** Human-readable name */
  name: string;
  /** Layer this element belongs to */
  layer: string;
  /** Aspect: active, behavior, passive */
  aspect: 'active' | 'behavior' | 'passive';
  /** Shape type for rendering */
  shape: string;
  /** Icon file reference */
  icon?: string;
  /** Documentation about this element type */
  documentation: string;
  /** Additional properties specific to this element type */
  properties: ElementTypeProperty[];
}

/**
 * A property defined on an element type
 */
export interface ElementTypeProperty {
  /** Property name */
  name: string;
  /** Property data type */
  type: 'string' | 'number' | 'boolean' | 'enum';
  /** Whether this property is required */
  required?: boolean;
  /** For enum types: allowed values */
  values?: string[];
}

/**
 * Definition of a relationship type
 */
export interface RelationshipTypeDefinition {
  /** Full type ID (e.g., archimate:Serving) */
  id: string;
  /** Human-readable name */
  name: string;
  /** Line rendering style */
  lineStyle: 'solid' | 'dashed' | 'dotted';
  /** Arrow style at source end */
  sourceArrow:
    | 'none'
    | 'diamond-filled'
    | 'diamond-hollow'
    | 'circle-filled'
    | 'circle-hollow';
  /** Arrow style at target end */
  targetArrow:
    | 'none'
    | 'open'
    | 'filled'
    | 'hollow-triangle';
  /** Documentation about this relationship type */
  documentation: string;
  /** Valid source-target element type combinations, or a rule string */
  validConnections: ValidConnection[] | string;
  /** Additional properties for this relationship type */
  properties?: ElementTypeProperty[];
}

/**
 * A valid connection rule between element types
 */
export interface ValidConnection {
  /** Source element type ID */
  source: string;
  /** Target element type ID */
  target: string;
}

/**
 * Definition of a viewpoint
 */
export interface ViewpointDefinition {
  /** Full viewpoint ID (e.g., archimate:Layered) */
  id: string;
  /** Human-readable name */
  name: string;
  /** Element types allowed in this viewpoint (or '*' for all) */
  allowedElements: string[] | '*';
  /** Relationship types allowed (or '*' for all) */
  allowedRelationships: string[] | '*';
  /** Description of this viewpoint's purpose */
  description: string;
}
