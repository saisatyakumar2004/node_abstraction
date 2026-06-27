import { useStore } from './store';

describe('pipeline store', () => {
  beforeEach(() => {
    useStore.setState({
      nodes: [],
      edges: [],
      nodeIDs: {},
    });
  });

  it('persists node field edits into the shared store', () => {
    useStore.setState({
      nodes: [{ id: 'node-1', type: 'text', data: { title: 'Draft' } }],
    });

    useStore.getState().updateNodeField('node-1', 'title', 'Updated');

    expect(useStore.getState().nodes[0].data.title).toBe('Updated');
  });
});
