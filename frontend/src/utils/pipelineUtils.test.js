import { createNodeHandle, extractVariables, removeDanglingEdges, validateVariableName } from './pipelineUtils';

describe('pipeline utilities', () => {
  it('extracts unique variables from templated text', () => {
    expect(extractVariables('Hello {{username}} and {{username}} and {{company}}')).toEqual(['username', 'company']);
  });

  it('rejects invalid variable names', () => {
    expect(validateVariableName('username')).toBe(true);
    expect(validateVariableName('1name')).toBe(false);
    expect(validateVariableName('user-name')).toBe(false);
  });

  it('creates node handles with a stable id', () => {
    expect(createNodeHandle('node-1', 'username')).toEqual({ id: 'node-1-username', label: 'username', type: 'target' });
  });

  it('removes edges that reference deleted handles', () => {
    const edges = [
      { id: 'e1', sourceHandle: 'node-1-username', targetHandle: 'node-2-output' },
      { id: 'e2', sourceHandle: 'node-1-email', targetHandle: 'node-2-output' },
    ];

    expect(removeDanglingEdges(edges, ['node-1-username'])).toEqual([edges[1]]);
  });
});
