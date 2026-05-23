def test_login_success_with_email_and_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.local", "password": "test-admin-password"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["access_token"]


def test_login_failure_without_email(client):
    # L'email est obligatoire : sans email -> 401.
    response = client.post(
        "/api/auth/login", json={"password": "test-admin-password"}
    )
    assert response.status_code in (401, 422)


def test_login_failure_wrong_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.local", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_login_failure_wrong_email(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "other@test.local", "password": "test-admin-password"},
    )
    assert response.status_code == 401


def test_admin_access_requires_token(client):
    assert client.get("/api/admin/content").status_code == 401
    assert client.put("/api/admin/content", json={}).status_code == 401
    assert client.post("/api/admin/cv").status_code == 401
    assert client.post("/api/admin/photo").status_code == 401
