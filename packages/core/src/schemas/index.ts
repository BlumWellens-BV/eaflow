import { z } from 'zod';

/**
 * Schema for element type format: notation:TypeName
 */
export const elementTypeSchema = z
  .string()
  .regex(/^[a-z]+:[A-Z][a-zA-Z]+$/, 'Element type must be in format notation:TypeName');

/**
 * Schema for relationship type format: notation:TypeName
 */
export const relationshipTypeSchema = z
  .string()
  .regex(/^[a-z]+:[A-Z][a-zA-Z]+$/, 'Relationship type must be in format notation:TypeName');

/**
 * Schema for custom element properties
 */
export const elementPropertiesSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
);

/**
 * Schema for validating elements
 */
export const elementSchema = z.object({
  id: z.string().min(1),
  type: elementTypeSchema,
  name: z.string().min(1),
  documentation: z.string().optional(),
  properties: elementPropertiesSchema,
  tags: z.array(z.string()),
  created: z.string().datetime(),
  modified: z.string().datetime(),
});

/**
 * Schema for access type enum
 */
export const accessTypeSchema = z.enum(['read', 'write', 'readwrite', 'access']);

/**
 * Schema for validating relationships
 */
export const relationshipSchema = z.object({
  id: z.string().min(1),
  type: relationshipTypeSchema,
  name: z.string().optional(),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  documentation: z.string().optional(),
  properties: elementPropertiesSchema,
  accessType: accessTypeSchema.optional(),
  influenceStrength: z.string().optional(),
});

/**
 * Schema for view node styling
 */
export const viewNodeStyleSchema = z.object({
  fillColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  textColor: z.string().optional(),
  fontSize: z.number().optional(),
});

/**
 * Schema for view nodes
 */
export const viewNodeSchema = z.object({
  id: z.string().min(1),
  elementId: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  style: viewNodeStyleSchema.optional(),
  children: z.array(z.string()),
  parentId: z.string().optional(),
});

/**
 * Schema for view edge styling
 */
export const viewEdgeStyleSchema = z.object({
  lineColor: z.string().optional(),
  lineWidth: z.number().optional(),
  lineStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
});

/**
 * Schema for view edges
 */
export const viewEdgeSchema = z.object({
  id: z.string().min(1),
  relationshipId: z.string().min(1),
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  waypoints: z.array(z.object({ x: z.number(), y: z.number() })),
  style: viewEdgeStyleSchema.optional(),
  labelPosition: z.object({ x: z.number(), y: z.number() }).optional(),
});

/**
 * Schema for view groups
 */
export const viewGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  nodeIds: z.array(z.string()),
  style: z
    .object({
      fillColor: z.string().optional(),
      borderColor: z.string().optional(),
      textColor: z.string().optional(),
    })
    .optional(),
});

/**
 * Schema for complete views
 */
export const viewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  viewpoint: z.string().optional(),
  documentation: z.string().optional(),
  nodes: z.array(viewNodeSchema),
  edges: z.array(viewEdgeSchema),
  groups: z.array(viewGroupSchema),
  created: z.string().datetime(),
  modified: z.string().datetime(),
});

// Export inferred types for convenience
export type ElementSchemaType = z.infer<typeof elementSchema>;
export type RelationshipSchemaType = z.infer<typeof relationshipSchema>;
export type ViewSchemaType = z.infer<typeof viewSchema>;
