import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
} from '@xyflow/react';

interface ModelState {
  // React Flow state
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Actions for React Flow
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNodeId: (id: string | null) => void;

  // Model actions
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  clear: () => void;
}

export const useModelStore = create<ModelState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });

    // Update selected node on selection change
    for (const change of changes) {
      if (change.type === 'select') {
        set({ selectedNodeId: change.selected ? change.id : null });
      }
    }
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    };
    set({ edges: [...get().edges, newEdge] });
  },

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
    // Also update the node selection state
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        selected: node.id === id,
      })),
    });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  addEdge: (edge) => {
    set({ edges: [...get().edges, edge] });
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, ...data } : node
      ),
    });
  },

  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    });
  },

  removeEdge: (id) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
    });
  },

  clear: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
}));
