// Types
export type {
  Element,
  ElementType,
  BaseElement,
  ElementProperties,
} from './types/element.js';

export type {
  Relationship,
  RelationshipType,
  BaseRelationship,
  AccessType,
} from './types/relationship.js';

export type {
  View,
  ViewNode,
  ViewEdge,
  ViewGroup,
  ViewNodeStyle,
  ViewEdgeStyle,
} from './types/view.js';

export type {
  Metamodel,
  MetamodelLayer,
  ElementTypeDefinition,
  RelationshipTypeDefinition,
  ViewpointDefinition,
  ValidConnection,
} from './types/metamodel.js';

// Schemas
export {
  elementSchema,
  relationshipSchema,
  viewSchema,
  viewNodeSchema,
  viewEdgeSchema,
  viewGroupSchema,
} from './schemas/index.js';

// Repositories
export { ElementRepository } from './repository/element-repository.js';
export { RelationshipRepository } from './repository/relationship-repository.js';

// Metamodel
export { MetamodelLoader } from './metamodel/loader.js';

// Utilities
export { generateId } from './utils/id.js';
