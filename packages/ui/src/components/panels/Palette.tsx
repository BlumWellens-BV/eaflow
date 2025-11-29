import { useState } from 'react';
import {
  BUSINESS_ELEMENTS,
  APPLICATION_ELEMENTS,
  TECHNOLOGY_ELEMENTS,
} from '@eaflow/archimate';

interface PaletteGroupProps {
  title: string;
  color: string;
  elements: readonly string[];
  isOpen: boolean;
  onToggle: () => void;
}

function PaletteGroup({
  title,
  color,
  elements,
  isOpen,
  onToggle,
}: PaletteGroupProps): JSX.Element {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: color }}
          />
          <span>{title}</span>
        </div>
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-2">
          {elements.map((el) => {
            const name = el.split(':')[1] ?? el;
            return (
              <div
                key={el}
                className="cursor-grab rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/eaflow-element', el);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
              >
                {name.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Palette(): JSX.Element {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    business: true,
    application: false,
    technology: false,
  });

  const toggleGroup = (group: string): void => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="flex-1 overflow-y-auto border-b border-gray-300 panel-scroll">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Palette
        </h2>
      </div>
      <PaletteGroup
        title="Business"
        color="#FFFFB5"
        elements={BUSINESS_ELEMENTS}
        isOpen={openGroups['business'] ?? false}
        onToggle={() => toggleGroup('business')}
      />
      <PaletteGroup
        title="Application"
        color="#B5FFFF"
        elements={APPLICATION_ELEMENTS}
        isOpen={openGroups['application'] ?? false}
        onToggle={() => toggleGroup('application')}
      />
      <PaletteGroup
        title="Technology"
        color="#C9E7B7"
        elements={TECHNOLOGY_ELEMENTS}
        isOpen={openGroups['technology'] ?? false}
        onToggle={() => toggleGroup('technology')}
      />
    </div>
  );
}
