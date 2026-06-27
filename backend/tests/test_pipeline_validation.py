from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_detects_cycles():
    response = client.post(
        '/pipelines/parse',
        json={
            'nodes': [{'id': 'n1'}, {'id': 'n2'}],
            'edges': [{'source': 'n1', 'target': 'n2'}, {'source': 'n2', 'target': 'n1'}],
        },
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload['is_dag'] is False


def test_empty_graph_is_valid():
    response = client.post('/pipelines/parse', json={'nodes': [], 'edges': []})

    payload = response.json()
    assert response.status_code == 200
    assert payload['num_nodes'] == 0
    assert payload['is_dag'] is True


def test_malformed_payload_is_rejected():
    response = client.post('/pipelines/parse', json={'nodes': 'not-a-list', 'edges': []})

    assert response.status_code == 422


def test_missing_node_id_is_rejected():
    response = client.post('/pipelines/parse', json={'nodes': [{'type': 'input'}], 'edges': []})

    assert response.status_code == 422


def test_invalid_edge_is_counted():
    response = client.post(
        '/pipelines/parse',
        json={'nodes': [{'id': 'n1'}], 'edges': [{'source': 'missing', 'target': 'n1'}]},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload['invalid_edges'] == 1
    assert payload['valid_edges'] == 0
