import type { Metamodel } from '@eaflow/core';
import metamodelJson from './metamodel.json' with { type: 'json' };

/**
 * ArchiMate 3.2 metamodel definition
 */
export const archimateMetamodel: Metamodel = metamodelJson as Metamodel;

// Re-export types specific to ArchiMate
export type {
  ArchiMateLayer,
  ArchiMateElementType,
  ArchiMateRelationshipType,
  ArchiMateViewpoint,
} from './types.js';

// Re-export helper functions
export {
  getLayerColor,
  getElementTypesByLayer,
  isValidArchiMateType,
  ARCHIMATE_LAYERS,
  BUSINESS_ELEMENTS,
  APPLICATION_ELEMENTS,
  TECHNOLOGY_ELEMENTS,
} from './types.js';
