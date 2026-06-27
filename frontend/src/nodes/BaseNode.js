import { memo } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';

const getHandlePosition = (index, length) => (length === 1 ? '50%' : `${((index + 1) / (length + 1)) * 100}%`);

export const BaseNode = memo(function BaseNode({
  id,
  title,
  icon,
  accentColor = '#6c63ff',
  inputs = [],
  outputs = [],
  fields,
  minWidth = 220,
  minHeight = 140,
  style = {},
  selected = false,
  resizable = false,
  onResize,
  width,
  height,
}) {
  const resolvedWidth = style.width || width || minWidth;
  const resolvedHeight = style.height || height || minHeight;

  return (
    <div
      className={`base-node${selected ? ' selected' : ''}`}
      style={{
        minWidth: resolvedWidth,
        minHeight: resolvedHeight,
        width: resolvedWidth,
        height: resolvedHeight,
        '--node-accent': accentColor,
        ...style,
      }}
    >
      {resizable && selected && (
        <NodeResizer
          minWidth={minWidth}
          minHeight={minHeight}
          lineStyle={{ borderColor: accentColor }}
          handleStyle={{ width: 8, height: 8, backgroundColor: accentColor }}
          onResize={onResize}
        />
      )}

      {inputs.map((input, index) => {
        const top = input.style?.top || getHandlePosition(index, inputs.length);
        return (
          <div key={input.id}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${input.id}`}
              style={{ top, ...input.style }}
            />
            <span className="handle-label handle-label-left" style={{ top }}>
              {input.label}
            </span>
          </div>
        );
      })}

      <div className="node-header" style={{ borderColor: accentColor }}>
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title}</span>
      </div>

      <div className="node-body">{fields}</div>

      {outputs.map((output, index) => {
        const top = output.style?.top || getHandlePosition(index, outputs.length);
        return (
          <div key={output.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-${output.id}`}
              style={{ top, ...output.style }}
            />
            <span className="handle-label handle-label-right" style={{ top }}>
              {output.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});
