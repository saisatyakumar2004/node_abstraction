import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../store';
import { useNodeField } from '../hooks/useNodeField';
import { BaseNode } from './BaseNode';
import { extractVariables } from '../utils/pipelineUtils';

const OUTPUT_HANDLES = [{ id: 'output', label: 'out' }];

export const TextNode = memo(function TextNode({ id, data, selected }) {
  const [currText, setCurrText] = useNodeField(id, 'text', data?.text || '{{input}}');
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const removeEdges = useStore((state) => state.removeEdges);
  const edges = useStore((state) => state.edges);
  const previousHandlesRef = useRef([]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currText]);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  useEffect(() => {
    const currentHandles = variables.map((variable) => `${id}-${variable}`);
    const removedHandles = previousHandlesRef.current.filter((handleId) => !currentHandles.includes(handleId));

    if (removedHandles.length) {
      const danglingEdges = edges.filter((edge) => removedHandles.includes(edge.sourceHandle) || removedHandles.includes(edge.targetHandle));
      if (danglingEdges.length) {
        removeEdges(danglingEdges.map((edge) => edge.id));
      }
    }

    previousHandlesRef.current = currentHandles;
  }, [edges, id, removeEdges, variables]);

  const handleResize = useCallback((event, params) => {
    updateNodeField(id, 'width', params.width);
    updateNodeField(id, 'height', params.height);
  }, [id, updateNodeField]);

  const nodeWidth = data?.width || 280;
  const nodeHeight = data?.height || 220;

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="📝"
      accentColor="#ec4899"
      inputs={variables.map((variable) => ({ id: variable, label: variable }))}
      outputs={OUTPUT_HANDLES}
      selected={selected}
      resizable
      onResize={handleResize}
      width={nodeWidth}
      height={nodeHeight}
      style={{ width: nodeWidth, height: nodeHeight }}
      fields={
        <>
          <label className="node-field node-field-col">
            <span>Content</span>
            <textarea
              ref={textareaRef}
              aria-label={`Text content for node ${id}`}
              value={currText}
              onChange={(event) => setCurrText(event.target.value)}
              rows={1}
              style={{ resize: 'none', overflow: 'hidden' }}
            />
          </label>
          {variables.length > 0 && (
            <p className="node-vars-hint">
              Variables: {variables.map((variable) => <code key={variable}>{variable}</code>)}
            </p>
          )}
        </>
      }
    />
  );
});
