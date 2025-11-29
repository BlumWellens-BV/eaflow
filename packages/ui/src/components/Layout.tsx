import { Palette } from './panels/Palette';
import { Canvas } from './Canvas';
import { Properties } from './panels/Properties';
import { Browser } from './panels/Browser';

export function Layout(): JSX.Element {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="flex h-10 items-center justify-between border-b border-gray-300 bg-white px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-800">EAFlow</h1>
          <nav className="flex gap-2 text-sm text-gray-600">
            <button className="rounded px-2 py-1 hover:bg-gray-100">File</button>
            <button className="rounded px-2 py-1 hover:bg-gray-100">Edit</button>
            <button className="rounded px-2 py-1 hover:bg-gray-100">View</button>
            <button className="rounded px-2 py-1 hover:bg-gray-100">Diagram</button>
            <button className="rounded px-2 py-1 hover:bg-gray-100">Help</button>
          </nav>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="rounded bg-gray-100 px-2 py-0.5">Git: main</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: Palette + Browser */}
        <div className="flex w-56 flex-col border-r border-gray-300 bg-white">
          <Palette />
          <Browser />
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <Canvas />
        </div>

        {/* Right sidebar: Properties */}
        <div className="w-64 border-l border-gray-300 bg-white">
          <Properties />
        </div>
      </div>

      {/* Status bar */}
      <footer className="flex h-6 items-center justify-between border-t border-gray-300 bg-white px-4 text-xs text-gray-500">
        <span>Ready</span>
        <span>ArchiMate 3.2</span>
      </footer>
    </div>
  );
}
