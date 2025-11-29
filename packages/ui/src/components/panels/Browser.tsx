import { useModelStore } from '../../store/model-store';

export function Browser(): JSX.Element {
  const nodes = useModelStore((s) => s.nodes);
  const selectedNodeId = useModelStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useModelStore((s) => s.setSelectedNodeId);

  // Group nodes by layer
  const businessNodes = nodes.filter((n) =>
    (n.data?.elementType as string)?.includes('Business')
  );
  const applicationNodes = nodes.filter((n) => {
    const type = (n.data?.elementType as string) ?? '';
    return type.includes('Application') || type.includes('Data');
  });
  const technologyNodes = nodes.filter((n) => {
    const type = (n.data?.elementType as string) ?? '';
    return (
      type.includes('Technology') ||
      type.includes('Node') ||
      type.includes('Device') ||
      type.includes('System') ||
      type.includes('Artifact') ||
      type.includes('Network')
    );
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Browser
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 panel-scroll">
        <input
          type="text"
          placeholder="Search..."
          className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        />
        {nodes.length === 0 ? (
          <div className="text-center text-sm text-gray-400">
            No elements yet.
            <br />
            Drag from palette to canvas.
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            {businessNodes.length > 0 && (
              <BrowserGroup
                title="Business"
                nodes={businessNodes}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            )}
            {applicationNodes.length > 0 && (
              <BrowserGroup
                title="Application"
                nodes={applicationNodes}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            )}
            {technologyNodes.length > 0 && (
              <BrowserGroup
                title="Technology"
                nodes={technologyNodes}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface BrowserGroupProps {
  title: string;
  nodes: Array<{ id: string; data: Record<string, unknown> }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function BrowserGroup({
  title,
  nodes,
  selectedId,
  onSelect,
}: BrowserGroupProps): JSX.Element {
  return (
    <div>
      <div className="font-medium text-gray-600">{title}</div>
      <div className="ml-2 mt-1 space-y-0.5">
        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => onSelect(node.id)}
            className={`block w-full rounded px-2 py-0.5 text-left ${
              selectedId === node.id
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {(node.data?.label as string) ?? 'Unnamed'}
          </button>
        ))}
      </div>
    </div>
  );
}
