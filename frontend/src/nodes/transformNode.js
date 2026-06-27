import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

const INPUT_HANDLES = [{ id: 'input', label: 'input' }];
const OUTPUT_HANDLES = [{ id: 'output', label: 'output' }];

export const TransformNode = memo(function TransformNode({ id, data, selected }) {
  const [code, setCode] = useNodeField(id, 'code', data?.code || 'return input.trim()');

  return (
    <BaseNode
      id={id}
      title="Transform"
      icon="⚙️"
      accentColor="#8b5cf6"
      inputs={INPUT_HANDLES}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      fields={
        <label className="node-field node-field-col">
          <span>JS Expression</span>
          <textarea
            aria-label={`Expression for ${data?.label || 'transform'}`}
            rows={3}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '11px' }}
          />
        </label>
      }
    />
  );
});
