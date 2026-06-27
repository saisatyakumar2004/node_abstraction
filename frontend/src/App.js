import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';
import './index.css';

function App() {
  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="top-bar-brand">
          <div className="brand-logo">VS</div>
          <span className="brand-name">VectorShift</span>
          <span className="brand-badge">Pipeline Builder</span>
        </div>
      </div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
