import { memo } from 'react';
import { BaseNode } from './BaseNode';
import { useNodeField } from '../hooks/useNodeField';

export const NoteNode = memo(function NoteNode({ id, data, selected }) {
  const [note, setNote] = useNodeField(id, 'note', data?.note || 'Add a note here...');

  return (
    <BaseNode
      id={id}
      title="Note"
      icon="💬"
      accentColor="#fbbf24"
      inputs={[]}
      outputs={[]}
      selected={selected}
      fields={
        <textarea
          aria-label={`Note for ${data?.label || 'note'}`}
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: '100%', resize: 'vertical', background: 'transparent', border: 'none', fontStyle: 'italic', color: 'inherit' }}
        />
      }
    />
  );
});
