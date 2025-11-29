import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useModelStore } from '../store/model-store';

export function Canvas(): JSX.Element {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useModelStore();

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges as Edge[]}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            // Color by ArchiMate layer
            const type = node.data?.elementType as string | undefined;
            if (type?.includes('Business')) return '#FFFFB5';
            if (type?.includes('Application')) return '#B5FFFF';
            if (type?.includes('Technology')) return '#C9E7B7';
            return '#E0E0E0';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
