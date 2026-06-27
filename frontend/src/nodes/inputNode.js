import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

const OUTPUT_HANDLES = [{ id: 'value', label: 'out' }];

export const InputNode = memo(function InputNode({ id, data, selected }) {
  const [currName, setCurrName] = useNodeField(id, 'inputName', data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useNodeField(id, 'inputType', data?.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="⬇️"
      accentColor="#22c55e"
      inputs={[]}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      fields={
        <>
          <label className="node-field">
            <span>Name</span>
            <input
              aria-label={`Name for ${data?.label || 'input'}`}
              type="text"
              value={currName}
              onChange={(e) => setCurrName(e.target.value)}
            />
          </label>
          <label className="node-field">
            <span>Type</span>
            <select aria-label={`Type for ${data?.label || 'input'}`} value={inputType} onChange={(e) => setInputType(e.target.value)}>
              <option value="Text">Text</option>
              <option value="File">File</option>
            </select>
          </label>
        </>
      }
    />
  );
});
