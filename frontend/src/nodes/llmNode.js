import { memo } from 'react';
import { BaseNode } from './BaseNode';

const INPUT_HANDLES = [{ id: 'system', label: 'system' }, { id: 'prompt', label: 'prompt' }];
const OUTPUT_HANDLES = [{ id: 'response', label: 'response' }];

export const LLMNode = memo(function LLMNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="🤖"
      accentColor="#6c63ff"
      inputs={INPUT_HANDLES}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      fields={
        <p className="node-description" aria-label={`Description for ${data?.label || 'LLM node'}`}>
          Large language model. Connect a system prompt and user prompt to generate a response.
        </p>
      }
    />
  );
});
