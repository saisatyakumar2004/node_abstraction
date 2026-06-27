import { useState } from 'react';
import { useStore } from './store';

const ResultModal = ({ data, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="modal-title">📊 Pipeline Analysis</div>

      <div className="modal-stats">
        <div className="modal-stat">
          <div
            className="modal-stat-value"
            style={{ color: '#6c63ff' }}
          >
            {data.num_nodes}
          </div>
          <div className="modal-stat-label">Nodes</div>
        </div>

        <div className="modal-stat">
          <div
            className="modal-stat-value"
            style={{ color: '#0ea5e9' }}
          >
            {data.num_edges}
          </div>
          <div className="modal-stat-label">Edges</div>
        </div>

        <div
          className={`modal-stat ${
            data.is_dag ? 'modal-dag-true' : 'modal-dag-false'
          }`}
        >
          <div className="modal-stat-value">
            {data.is_dag ? '✓' : '✗'}
          </div>
          <div className="modal-stat-label">Valid DAG</div>
        </div>
      </div>

      <button className="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8000/pipelines/parse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodes,
            edges,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Server Error: ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-bar">
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Run Pipeline'}
      </button>

      {error && (
        <div className="modal-overlay" onClick={() => setError(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⚠️ Pipeline Error</div>
            <p>{error}</p>
            <button className="modal-close" onClick={() => setError(null)}>Close</button>
          </div>
        </div>
      )}

      {result && (
        <ResultModal
          data={result}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
};