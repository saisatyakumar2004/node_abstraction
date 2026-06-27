import { useStore } from '../store';

export function useNodeField(nodeId, fieldName, fallbackValue) {
  const node = useStore((state) => state.nodes.find((candidate) => candidate.id === nodeId));
  const updateNodeField = useStore((state) => state.updateNodeField);

  const value = node?.data?.[fieldName] ?? fallbackValue;
  const setValue = (nextValue) => updateNodeField(nodeId, fieldName, nextValue);

  return [value, setValue];
}
