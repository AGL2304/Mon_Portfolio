import io


def get_auth_headers(client) -> dict[str, str]:
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.local", "password": "test-admin-password"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_public_content_is_available(client):
    response = client.get("/api/public/content")
    assert response.status_code == 200
    payload = response.json()
    assert payload["profile"]["full_name"] == "Georges Lionel ANANI"
    # Seed: au moins 11 projets, 3 experiences
    assert len(payload["projects"]) >= 11
    assert len(payload["experiences"]) >= 3
    # Champs etendus presents
    assert "tagline" in payload["profile"]
    assert "phone" in payload["profile"]
    assert "tryhackme_url" in payload["profile"]
    assert payload["experiences"][0]["current"] is True


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
            "private_note": None,
        }
    )

    put_response = client.put("/api/admin/content", headers=headers, json=content)
    assert put_response.status_code == 200

    public_response = client.get("/api/public/content")
    updated = public_response.json()
    assert updated["profile"]["short_bio"] == "Bio mise a jour via test unitaire."
    assert any(p["id"] == "test-project" for p in updated["projects"])


def test_cv_upload_and_download(client):
    headers = get_auth_headers(client)

    # Initialement aucun CV
    assert client.get("/api/public/cv").status_code == 404

    # Faux PDF (signature %PDF- suffit pour passer le filtre par extension)
    pdf_bytes = b"%PDF-1.4\n%fake pdf content for tests\n"
    files = {"file": ("CV_test.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    response = client.post("/api/admin/cv", headers=headers, files=files)
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["url"].endswith("/api/public/cv")
    assert payload["filename"] == "CV_test.pdf"

    # Download du CV
    dl = client.get("/api/public/cv")
    assert dl.status_code == 200
    assert dl.headers["content-type"] == "application/pdf"
    assert pdf_bytes in dl.content

    # Le profile.cv_url a ete mis a jour
    public = client.get("/api/public/content").json()
    assert public["profile"]["cv_url"].endswith("/api/public/cv")


def test_cv_upload_rejects_non_pdf(client):
    headers = get_auth_headers(client)
    files = {"file": ("notes.txt", io.BytesIO(b"hello"), "text/plain")}
    response = client.post("/api/admin/cv", headers=headers, files=files)
    assert response.status_code == 400


def test_cv_delete(client):
    headers = get_auth_headers(client)
    files = {"file": ("CV.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}
    client.post("/api/admin/cv", headers=headers, files=files)

    response = client.delete("/api/admin/cv", headers=headers)
    assert response.status_code == 204
    assert client.get("/api/public/cv").status_code == 404
    public = client.get("/api/public/content").json()
    assert public["profile"]["cv_url"] == ""


def test_photo_upload_and_download(client):
    headers = get_auth_headers(client)

    assert client.get("/api/public/photo").status_code == 404

    # Minimal JPEG header bytes — sufficient since we only filter on MIME.
    jpeg_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xd9"
    files = {"file": ("avatar.jpg", io.BytesIO(jpeg_bytes), "image/jpeg")}
    response = client.post("/api/admin/photo", headers=headers, files=files)
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["url"].endswith("/api/public/photo")
    assert payload["content_type"] == "image/jpeg"

    dl = client.get("/api/public/photo")
    assert dl.status_code == 200
    assert dl.headers["content-type"] == "image/jpeg"
    assert dl.content == jpeg_bytes

    public = client.get("/api/public/content").json()
    assert public["profile"]["profile_image"].endswith("/api/public/photo")


def test_photo_upload_rejects_invalid_mime(client):
    headers = get_auth_headers(client)
    files = {"file": ("doc.pdf", io.BytesIO(b"%PDF"), "application/pdf")}
    response = client.post("/api/admin/photo", headers=headers, files=files)
    assert response.status_code == 400


def test_photo_delete(client):
    headers = get_auth_headers(client)
    files = {"file": ("avatar.jpg", io.BytesIO(b"\xff\xd8\xff\xd9"), "image/jpeg")}
    client.post("/api/admin/photo", headers=headers, files=files)

    response = client.delete("/api/admin/photo", headers=headers)
    assert response.status_code == 204
    assert client.get("/api/public/photo").status_code == 404
    public = client.get("/api/public/content").json()
    assert public["profile"]["profile_image"] == ""


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
