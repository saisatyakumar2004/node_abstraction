import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

const INPUT_HANDLES = [{ id: 'body', label: 'body' }];
const OUTPUT_HANDLES = [{ id: 'response', label: 'response' }, { id: 'error', label: 'error' }];

export const ApiNode = memo(function ApiNode({ id, data, selected }) {
  const [url, setUrl] = useNodeField(id, 'url', data?.url || 'https://api.example.com');
  const [method, setMethod] = useNodeField(id, 'method', data?.method || 'GET');

  return (
    <BaseNode
      id={id}
      title="API Call"
      icon="🌐"
      accentColor="#0ea5e9"
      inputs={INPUT_HANDLES}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      fields={
        <>
          <label className="node-field">
            <span>Method</span>
            <select aria-label={`Method for ${data?.label || 'API call'}`} value={method} onChange={(e) => setMethod(e.target.value)}>
              {['GET', 'POST', 'PUT', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="node-field">
            <span>URL</span>
            <input aria-label={`URL for ${data?.label || 'API call'}`} type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
        </>
      }
    />
  );
});
