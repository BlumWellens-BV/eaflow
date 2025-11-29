import { ReactFlowProvider } from '@xyflow/react';
import { Layout } from './components/Layout';

export function App(): JSX.Element {
  return (
    <ReactFlowProvider>
      <Layout />
    </ReactFlowProvider>
  );
}
