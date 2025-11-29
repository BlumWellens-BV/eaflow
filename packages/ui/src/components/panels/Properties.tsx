import { useModelStore } from '../../store/model-store';

export function Properties(): JSX.Element {
  const selectedNodeId = useModelStore((s) => s.selectedNodeId);
  const nodes = useModelStore((s) => s.nodes);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Properties
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 panel-scroll">
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data?.label as string) ?? ''}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">
                Type
              </label>
              <div className="mt-1 text-sm text-gray-700">
                {(selectedNode.data?.elementType as string)?.split(':')[1] ?? 'Unknown'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">
                Layer
              </label>
              <div className="mt-1 text-sm text-gray-700">
                {getLayerFromType((selectedNode.data?.elementType as string) ?? '')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">
                Documentation
              </label>
              <textarea
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                rows={3}
                placeholder="Add documentation..."
                readOnly
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Select an element to view properties
          </div>
        )}
      </div>
    </div>
  );
}

function getLayerFromType(type: string): string {
  if (type.includes('Business')) return 'Business';
  if (type.includes('Application') || type.includes('Data')) return 'Application';
  if (type.includes('Technology') || type.includes('Node') || type.includes('Device') || type.includes('System') || type.includes('Artifact') || type.includes('Network')) return 'Technology';
  return 'Unknown';
}
