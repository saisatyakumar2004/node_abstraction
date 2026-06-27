from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_parse_pipeline_returns_validation_summary():
    response = client.post(
        '/pipelines/parse',
        json={
            'nodes': [
                {'id': 'n1', 'type': 'input', 'data': {'label': 'Start'}},
                {'id': 'n2', 'type': 'output', 'data': {'label': 'End'}},
            ],
            'edges': [
                {'id': 'e1', 'source': 'n1', 'target': 'n2'},
                {'id': 'e2', 'source': 'missing', 'target': 'n2'},
            ],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload['num_nodes'] == 2
    assert payload['num_edges'] == 2
    assert payload['valid_edges'] == 1
    assert payload['invalid_edges'] == 1
    assert payload['is_dag'] is True
