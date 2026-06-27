import { create } from 'zustand';

const initialState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  nodeIDs: {},
};

export const useStore = create((set, get) => ({
  ...initialState,

  setPipeline: (nodes, edges) => set({ nodes, edges }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (nodeId, updates) => set((state) => ({
    nodes: state.nodes.map((node) => node.id === nodeId ? {
      ...node,
      ...updates,
      data: { ...node.data, ...(updates.data || {}) },
    } : node),
  })),
  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== nodeId),
    edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
  })),

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  removeEdge: (edgeId) => set((state) => ({ edges: state.edges.filter((edge) => edge.id !== edgeId) })),
  removeEdges: (edgeIds) => set((state) => ({ edges: state.edges.filter((edge) => !edgeIds.includes(edge.id)) })),

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  getNodeID: (type) => {
    const nextNodeIDs = { ...get().nodeIDs };
    if (nextNodeIDs[type] === undefined) {
      nextNodeIDs[type] = 0;
    }
    nextNodeIDs[type] += 1;
    set({ nodeIDs: nextNodeIDs });
    return `${type}-${nextNodeIDs[type]}`;
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set((state) => {
      let changed = false;
      const nextNodes = state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        const currentValue = node.data?.[fieldName];
        if (currentValue === fieldValue) return node;
        changed = true;
        return {
          ...node,
          data: { ...node.data, [fieldName]: fieldValue },
        };
      });
      return changed ? { nodes: nextNodes } : state;
    });
  },
}));
