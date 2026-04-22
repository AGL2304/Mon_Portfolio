def test_login_success(client):
    response = client.post("/api/auth/login", json={"password": "test-admin-password"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["access_token"]


def test_login_failure(client):
    response = client.post("/api/auth/login", json={"password": "wrong-password"})
    assert response.status_code == 401


def test_admin_access_requires_token(client):
    response = client.get("/api/admin/content")
    assert response.status_code == 401

