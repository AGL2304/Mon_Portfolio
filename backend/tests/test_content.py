def get_auth_headers(client):
    login_response = client.post("/api/auth/login", json={"password": "test-admin-password"})
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_public_content_is_available(client):
    response = client.get("/api/public/content")
    assert response.status_code == 200
    payload = response.json()
    assert payload["profile"]["full_name"] == "ANANI Georges Lionel"
    assert len(payload["projects"]) > 0


def test_admin_can_update_portfolio(client):
    headers = get_auth_headers(client)

    get_response = client.get("/api/admin/content", headers=headers)
    assert get_response.status_code == 200
    content = get_response.json()

    content["profile"]["short_bio"] = "Bio mise a jour via test unitaire."
    content["projects"].append(
        {
            "id": "test-project",
            "title": "Projet de test",
            "date": "2026",
            "categories": ["web"],
            "description": "Projet ajoute depuis un test unitaire.",
            "technologies": ["React", "FastAPI"],
            "repository_url": "https://github.com/example/test-project",
        }
    )

    put_response = client.put("/api/admin/content", headers=headers, json=content)
    assert put_response.status_code == 200

    public_response = client.get("/api/public/content")
    assert public_response.status_code == 200
    updated = public_response.json()
    assert updated["profile"]["short_bio"] == "Bio mise a jour via test unitaire."
    assert any(project["id"] == "test-project" for project in updated["projects"])

