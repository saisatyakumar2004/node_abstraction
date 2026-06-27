import { DraggableNode } from './draggableNode';

const NODES = [
  { type: 'customInput',  label: 'Input',       icon: '⬇️' },
  { type: 'llm',          label: 'LLM',          icon: '🤖' },
  { type: 'customOutput', label: 'Output',       icon: '⬆️' },
  { type: 'text',         label: 'Text',         icon: '📝' },
  { type: 'api',          label: 'API Call',     icon: '🌐' },
  { type: 'transform',    label: 'Transform',    icon: '⚙️' },
  { type: 'conditional',  label: 'Conditional',  icon: '🔀' },
  { type: 'note',         label: 'Note',         icon: '💬' },
  { type: 'merge',        label: 'Merge',        icon: '🔗' },
];

export const PipelineToolbar = () => (
  <div className="toolbar">
    <span className="toolbar-label">Nodes</span>
    {NODES.map(n => (
      <DraggableNode key={n.type} type={n.type} label={n.label} icon={n.icon} />
    ))}
  </div>
);
