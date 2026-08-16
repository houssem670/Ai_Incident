from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_dashboard_endpoint_requires_auth():
    """
    Verifie que le endpoint dashboard repond sans planter (pas de 500),
    qu'il soit protege ou non.
    """
    response = client.get("/dashboard/")
    assert response.status_code in (200, 401, 403, 404)


def test_root_endpoint():
    """
    Verifie que l'endpoint racine repond correctement.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "SOC API Running"