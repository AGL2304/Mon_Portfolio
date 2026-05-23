from pydantic import BaseModel, ConfigDict, Field


class Profile(BaseModel):
    """Profil personnel — affiche dans le hero et la section contact."""

    model_config = ConfigDict(extra="ignore")

    full_name: str = Field(min_length=1)
    headline: str = Field(min_length=1)
    tagline: str = Field(default="")  # sous-titre nav / hero
    short_bio: str = Field(min_length=1)
    about: str = Field(min_length=1)
    availability: str = Field(default="")  # ex: "Alternance Septembre 2026"
    location: str = Field(default="")
    address: str = Field(default="")
    phone: str = Field(default="")
    email: str = Field(min_length=3)
    github_url: str = Field(default="")
    linkedin_url: str = Field(default="")
    tryhackme_url: str = Field(default="")
    cv_url: str = Field(default="")  # mis a jour automatiquement apres upload
    profile_image: str = Field(default="")  # idem apres upload photo
    english_level: str = Field(default="")


class Experience(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    company: str = Field(min_length=1)
    location: str = Field(default="")
    period: str = Field(min_length=1)
    current: bool = Field(default=False)
    highlights: list[str] = Field(default_factory=list)


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    date: str = Field(default="")
    categories: list[str] = Field(default_factory=list)
    description: str = Field(min_length=1)
    technologies: list[str] = Field(default_factory=list)
    repository_url: str | None = None
    private_note: str | None = None  # si le repo n'est pas public


class SkillCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    items: list[str] = Field(default_factory=list)


class Certification(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    subtitle: str = Field(default="")
    description: str = Field(default="")
    in_progress: bool = Field(default=False)


class Interest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = Field(default="")
    emoji: str = Field(default="")


class PortfolioContent(BaseModel):
    profile: Profile
    hero_tags: list[str] = Field(default_factory=list)
    experiences: list[Experience] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    skill_categories: list[SkillCategory] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    interests: list[Interest] = Field(default_factory=list)


class LoginRequest(BaseModel):
    """Login admin. L'email est optionnel pour rester compatible avec un setup
    base mot-de-passe-seul. Quand l'email est absent, on accepte si le mot de
    passe correspond a la valeur configuree.
    """

    email: str | None = None
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UploadResponse(BaseModel):
    url: str
    filename: str
    content_type: str
