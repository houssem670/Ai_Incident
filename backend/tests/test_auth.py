from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_with_invalid_credentials_returns_401():
    response = client.post(
        "/api/auth/login",
        json={"username": "utilisateur_qui_nexiste_pas", "password": "mauvais_mdp"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_login_missing_fields_returns_422():
    response = client.post("/api/auth/login", json={"username": "test"})
    assert response.status_code == 422


def test_me_without_token_returns_401_or_403():
    response = client.get("/api/auth/me")
    assert response.status_code in (401, 403)