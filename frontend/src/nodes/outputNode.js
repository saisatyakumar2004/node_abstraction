import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

const INPUT_HANDLES = [{ id: 'value', label: 'in' }];

export const OutputNode = memo(function OutputNode({ id, data, selected }) {
  const [currName, setCurrName] = useNodeField(id, 'outputName', data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useNodeField(id, 'outputType', data?.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      title="Output"
      icon="⬆️"
      accentColor="#f59e0b"
      inputs={INPUT_HANDLES}
      outputs={[]}
      selected={selected}
      fields={
        <>
          <label className="node-field">
            <span>Name</span>
            <input
              aria-label={`Name for ${data?.label || 'output'}`}
              type="text"
              value={currName}
              onChange={(e) => setCurrName(e.target.value)}
            />
          </label>
          <label className="node-field">
            <span>Type</span>
            <select aria-label={`Type for ${data?.label || 'output'}`} value={outputType} onChange={(e) => setOutputType(e.target.value)}>
              <option value="Text">Text</option>
              <option value="Image">Image</option>
            </select>
          </label>
        </>
      }
    />
  );
});
