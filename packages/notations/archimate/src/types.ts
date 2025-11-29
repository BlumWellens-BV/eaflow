import type { ElementType } from '@eaflow/core';

/**
 * ArchiMate layer identifiers
 */
export type ArchiMateLayer =
  | 'strategy'
  | 'business'
  | 'application'
  | 'technology'
  | 'physical'
  | 'implementation'
  | 'composite';

/**
 * All ArchiMate element types (MVP subset)
 */
export type ArchiMateElementType =
  // Business Layer
  | 'archimate:BusinessActor'
  | 'archimate:BusinessRole'
  | 'archimate:BusinessProcess'
  | 'archimate:BusinessFunction'
  | 'archimate:BusinessEvent'
  | 'archimate:BusinessService'
  | 'archimate:BusinessObject'
  // Application Layer
  | 'archimate:ApplicationComponent'
  | 'archimate:ApplicationInterface'
  | 'archimate:ApplicationService'
  | 'archimate:DataObject'
  // Technology Layer
  | 'archimate:Node'
  | 'archimate:Device'
  | 'archimate:SystemSoftware'
  | 'archimate:TechnologyInterface'
  | 'archimate:CommunicationNetwork'
  | 'archimate:TechnologyService'
  | 'archimate:Artifact'
  // Composite
  | 'archimate:Grouping'
  | 'archimate:Location';

/**
 * All ArchiMate relationship types (MVP subset)
 */
export type ArchiMateRelationshipType =
  | 'archimate:Composition'
  | 'archimate:Aggregation'
  | 'archimate:Assignment'
  | 'archimate:Realization'
  | 'archimate:Serving'
  | 'archimate:Access'
  | 'archimate:Triggering'
  | 'archimate:Flow'
  | 'archimate:Specialization'
  | 'archimate:Association';

/**
 * ArchiMate viewpoint identifiers
 */
export type ArchiMateViewpoint =
  | 'archimate:Layered'
  | 'archimate:Organization'
  | 'archimate:BusinessProcessCooperation'
  | 'archimate:ApplicationCooperation'
  | 'archimate:ApplicationUsage'
  | 'archimate:Technology'
  | 'archimate:TechnologyUsage';

/**
 * Layer colors as defined by ArchiMate specification
 */
export const ARCHIMATE_LAYERS: Record<ArchiMateLayer, { name: string; color: string }> = {
  strategy: { name: 'Strategy', color: '#F5E6A3' },
  business: { name: 'Business', color: '#FFFFB5' },
  application: { name: 'Application', color: '#B5FFFF' },
  technology: { name: 'Technology', color: '#C9E7B7' },
  physical: { name: 'Physical', color: '#C9E7B7' },
  implementation: { name: 'Implementation & Migration', color: '#FFE0E0' },
  composite: { name: 'Composite', color: '#E0E0E0' },
};

/**
 * Business layer element types
 */
export const BUSINESS_ELEMENTS: ArchiMateElementType[] = [
  'archimate:BusinessActor',
  'archimate:BusinessRole',
  'archimate:BusinessProcess',
  'archimate:BusinessFunction',
  'archimate:BusinessEvent',
  'archimate:BusinessService',
  'archimate:BusinessObject',
];

/**
 * Application layer element types
 */
export const APPLICATION_ELEMENTS: ArchiMateElementType[] = [
  'archimate:ApplicationComponent',
  'archimate:ApplicationInterface',
  'archimate:ApplicationService',
  'archimate:DataObject',
];

/**
 * Technology layer element types
 */
export const TECHNOLOGY_ELEMENTS: ArchiMateElementType[] = [
  'archimate:Node',
  'archimate:Device',
  'archimate:SystemSoftware',
  'archimate:TechnologyInterface',
  'archimate:CommunicationNetwork',
  'archimate:TechnologyService',
  'archimate:Artifact',
];

/**
 * Get the layer color for an element type
 */
export function getLayerColor(elementType: ArchiMateElementType): string {
  if (BUSINESS_ELEMENTS.includes(elementType)) {
    return ARCHIMATE_LAYERS.business.color;
  }
  if (APPLICATION_ELEMENTS.includes(elementType)) {
    return ARCHIMATE_LAYERS.application.color;
  }
  if (TECHNOLOGY_ELEMENTS.includes(elementType)) {
    return ARCHIMATE_LAYERS.technology.color;
  }
  return ARCHIMATE_LAYERS.composite.color;
}

/**
 * Get all element types for a given layer
 */
export function getElementTypesByLayer(layer: ArchiMateLayer): ArchiMateElementType[] {
  switch (layer) {
    case 'business':
      return BUSINESS_ELEMENTS;
    case 'application':
      return APPLICATION_ELEMENTS;
    case 'technology':
      return TECHNOLOGY_ELEMENTS;
    default:
      return [];
  }
}

/**
 * Check if a string is a valid ArchiMate element type
 */
export function isValidArchiMateType(type: ElementType): type is ArchiMateElementType {
  return (
    BUSINESS_ELEMENTS.includes(type as ArchiMateElementType) ||
    APPLICATION_ELEMENTS.includes(type as ArchiMateElementType) ||
    TECHNOLOGY_ELEMENTS.includes(type as ArchiMateElementType) ||
    type === 'archimate:Grouping' ||
    type === 'archimate:Location'
  );
}
