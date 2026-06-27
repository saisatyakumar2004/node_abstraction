from collections import defaultdict, deque
from typing import Optional

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


class Node(BaseModel):
    id: str
    type: Optional[str] = None
    data: dict = Field(default_factory=dict)


class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class Pipeline(BaseModel):
    nodes: list[Node] = Field(default_factory=list)
    edges: list[Edge] = Field(default_factory=list)


class PipelineResult(BaseModel):
    num_nodes: int
    num_edges: int
    valid_edges: int
    invalid_edges: int
    is_dag: bool


def is_dag(node_ids: set[str], edges: list[Edge]) -> bool:
    """Kahn's algorithm to detect cycles in a directed graph."""
    adj = defaultdict(list)
    in_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue = deque(node_id for node_id in node_ids if in_degree[node_id] == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.post('/pipelines/parse', response_model=PipelineResult)
def parse_pipeline(pipeline: Pipeline):
    node_ids = {node.id for node in pipeline.nodes}
    valid_edges = [edge for edge in pipeline.edges if edge.source in node_ids and edge.target in node_ids]

    return PipelineResult(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        valid_edges=len(valid_edges),
        invalid_edges=len(pipeline.edges) - len(valid_edges),
        is_dag=is_dag(node_ids, valid_edges),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={'detail': 'Unexpected error processing pipeline.'})
