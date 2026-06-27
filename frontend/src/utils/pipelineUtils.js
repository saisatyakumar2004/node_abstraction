const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const extractVariables = (text = '') => {
  const variables = [];
  let match;
  while ((match = VARIABLE_PATTERN.exec(text)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  return variables;
};

export const validateVariableName = (name) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);

export const createNodeHandle = (nodeId, handleName, type = 'target') => ({
  id: `${nodeId}-${handleName}`,
  label: handleName,
  type,
});

export const removeDanglingEdges = (edges = [], deletedHandles = []) => {
  if (!deletedHandles.length) {
    return edges;
  }

  const deletedHandleSet = new Set(deletedHandles);
  return edges.filter((edge) => !deletedHandleSet.has(edge.sourceHandle) && !deletedHandleSet.has(edge.targetHandle));
};

export const buildNodePosition = (projectFn, bounds, nodeCount, clientPosition = null) => {
  const offset = (nodeCount % 6) * 24;
  if (clientPosition && bounds) {
    return projectFn({
      x: clientPosition.x - bounds.left + offset,
      y: clientPosition.y - bounds.top + offset,
    });
  }

  if (!bounds) {
    return { x: 120 + offset, y: 120 + offset };
  }

  return projectFn({
    x: bounds.width / 2 + offset,
    y: bounds.height / 2 + offset,
  });
};

export const createEdgeId = (connection) => `${connection.source}_${connection.sourceHandle ?? ''}-${connection.target}_${connection.targetHandle ?? ''}`;
