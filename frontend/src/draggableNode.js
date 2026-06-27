export const DraggableNode = ({ type, label, icon }) => {
  const addNode = () => {
    const event = new CustomEvent('add-node-from-toolbar', { detail: { nodeType: type } });
    window.dispatchEvent(event);
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      draggable
      role="button"
      tabIndex={0}
      onDragStart={onDragStart}
      onClick={addNode}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          addNode();
        }
      }}
    >
      {icon && <span className="draggable-node-icon">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};
