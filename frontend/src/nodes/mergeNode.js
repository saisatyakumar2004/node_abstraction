import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

const INPUT_HANDLES = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }];
const OUTPUT_HANDLES = [{ id: 'merged', label: 'merged' }];

export const MergeNode = memo(function MergeNode({ id, data, selected }) {
  const [separator, setSeparator] = useNodeField(id, 'separator', data?.separator || '\n');

  return (
    <BaseNode
      id={id}
      title="Merge"
      icon="🔗"
      accentColor="#14b8a6"
      inputs={INPUT_HANDLES}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      fields={
        <label className="node-field">
          <span>Separator</span>
          <input
            aria-label={`Separator for ${data?.label || 'merge'}`}
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            style={{ width: 60, fontFamily: 'monospace' }}
          />
        </label>
      }
    />
  );
});
