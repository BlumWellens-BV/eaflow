/**
 * A view/diagram showing elements and relationships
 */
export interface View {
  /** Unique identifier (e.g., view-uuid-0001) */
  id: string;
  /** Human-readable name */
  name: string;
  /** Viewpoint type (e.g., archimate:ApplicationCooperation) */
  viewpoint?: string;
  /** Documentation for this view */
  documentation?: string;
  /** Visual nodes representing elements */
  nodes: ViewNode[];
  /** Visual edges representing relationships */
  edges: ViewEdge[];
  /** Grouping rectangles */
  groups: ViewGroup[];
  /** ISO 8601 creation timestamp */
  created: string;
  /** ISO 8601 last modification timestamp */
  modified: string;
}

/**
 * A visual node on a diagram, referencing an element
 */
export interface ViewNode {
  /** Unique node ID within this view */
  id: string;
  /** Reference to the element this node represents */
  elementId: string;
  /** X position on canvas */
  x: number;
  /** Y position on canvas */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Visual styling overrides */
  style?: ViewNodeStyle;
  /** Nested child node IDs (for composition) */
  children: string[];
  /** Parent node ID if nested */
  parentId?: string;
}

/**
 * Visual styling for a node
 */
export interface ViewNodeStyle {
  /** Fill/background color */
  fillColor?: string;
  /** Border color */
  borderColor?: string;
  /** Border width in pixels */
  borderWidth?: number;
  /** Text color */
  textColor?: string;
  /** Font size */
  fontSize?: number;
}

/**
 * A visual edge on a diagram, referencing a relationship
 */
export interface ViewEdge {
  /** Unique edge ID within this view */
  id: string;
  /** Reference to the relationship this edge represents */
  relationshipId: string;
  /** Source node ID */
  sourceNodeId: string;
  /** Target node ID */
  targetNodeId: string;
  /** Intermediate waypoints for routing */
  waypoints: Array<{ x: number; y: number }>;
  /** Visual styling overrides */
  style?: ViewEdgeStyle;
  /** Label position offset */
  labelPosition?: { x: number; y: number };
}

/**
 * Visual styling for an edge
 */
export interface ViewEdgeStyle {
  /** Line color */
  lineColor?: string;
  /** Line width in pixels */
  lineWidth?: number;
  /** Line style: solid, dashed, dotted */
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

/**
 * A grouping rectangle on a diagram
 */
export interface ViewGroup {
  /** Unique group ID within this view */
  id: string;
  /** Group label */
  name: string;
  /** X position on canvas */
  x: number;
  /** Y position on canvas */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** IDs of nodes contained in this group */
  nodeIds: string[];
  /** Visual styling */
  style?: {
    fillColor?: string;
    borderColor?: string;
    textColor?: string;
  };
}
