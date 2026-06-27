import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, applyEdgeChanges, applyNodeChanges, useReactFlow } from 'reactflow';
import { useStore } from './store';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode } from './nodes/apiNode';
import { TransformNode } from './nodes/transformNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { NoteNode } from './nodes/noteNode';
import { MergeNode } from './nodes/mergeNode';
import { buildNodePosition, createEdgeId } from './utils/pipelineUtils';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  transform: TransformNode,
  conditional: ConditionalNode,
  note: NoteNode,
  merge: MergeNode,
};

const PipelineCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const setPipeline = useStore((state) => state.setPipeline);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const addNode = useStore((state) => state.addNode);
  const setSelectedNodeId = useStore((state) => state.setSelectedNodeId);

  const addNodeAtPosition = useCallback((nodeType, position) => {
    const nodeID = getNodeID(nodeType);
    const baseData = { id: nodeID, nodeType, width: 280, height: 220 };
    if (nodeType === 'text') {
      baseData.text = '{{input}}';
    }
    addNode({ id: nodeID, type: nodeType, position, data: baseData });
  }, [addNode, getNodeID]);

  useEffect(() => {
    const onToolbarAdd = (event) => {
      const { nodeType } = event.detail || {};
      if (!nodeType) return;
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = buildNodePosition(project, bounds, nodes.length);
      addNodeAtPosition(nodeType, position);
    };

    window.addEventListener('add-node-from-toolbar', onToolbarAdd);
    return () => window.removeEventListener('add-node-from-toolbar', onToolbarAdd);
  }, [addNodeAtPosition, nodes.length, project]);

  useEffect(() => {
    setPipeline(nodes, edges);
  }, [edges, nodes, setPipeline]);

  const onNodesChange = useCallback((changes) => {
    setNodes(applyNodeChanges(changes, nodes));
  }, [nodes, setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdges(applyEdgeChanges(changes, edges));
  }, [edges, setEdges]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    setSelectedNodeId(selectedNodes[0]?.id ?? null);
  }, [setSelectedNodeId]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!event?.dataTransfer?.getData('application/reactflow') || !bounds) return;
    const { nodeType } = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    if (!nodeType) return;

    const position = buildNodePosition(project, bounds, nodes.length, {
      x: event.clientX,
      y: event.clientY,
    });
    addNodeAtPosition(nodeType, position);
  }, [addNodeAtPosition, nodes.length, project]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback((connection) => {
    useStore.setState((state) => ({
      edges: [
        ...state.edges,
        {
          ...connection,
          id: createEdgeId(connection),
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: 'arrowclosed', width: 20, height: 20 },
        },
      ],
    }));
  }, []);

  return (
    <div ref={reactFlowWrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        fitView
        nodesDraggable
        nodesConnectable
        elementsSelectable
      >
        <Background color="#2a3050" gap={gridSize} size={1} />
        <Controls />
        <MiniMap nodeColor="#252b3d" maskColor="rgba(15,17,23,0.8)" />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="empty-state" role="status">
          Drag a node here or click a node in the toolbar to start building your pipeline.
        </div>
      )}
    </div>
  );
};

export const PipelineUI = () => (
  <ReactFlowProvider>
    <PipelineCanvas />
  </ReactFlowProvider>
);
