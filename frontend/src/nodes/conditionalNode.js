import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

const INPUT_HANDLES = [{ id: 'input', label: 'input' }];
const OUTPUT_HANDLES = [{ id: 'true', label: 'true' }, { id: 'false', label: 'false' }];

export const ConditionalNode = memo(function ConditionalNode({ id, data, selected }) {
  const [condition, setCondition] = useNodeField(id, 'condition', data?.condition || 'value > 0');

  return (
    <BaseNode
      id={id}
      title="Conditional"
      icon="🔀"
      accentColor="#f97316"
      inputs={INPUT_HANDLES}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      fields={
        <label className="node-field node-field-col">
          <span>Condition</span>
          <input
            aria-label={`Condition for ${data?.label || 'conditional'}`}
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ fontFamily: 'monospace' }}
          />
        </label>
      }
    />
  );
});
