from pydantic import BaseModel, Field


class Profile(BaseModel):
    full_name: str = Field(min_length=1)
    headline: str = Field(min_length=1)
    short_bio: str = Field(min_length=1)
    about: str = Field(min_length=1)
    location: str = Field(default="")
    email: str = Field(min_length=3)
    github_url: str = Field(default="")
    linkedin_url: str = Field(default="")
    cv_url: str = Field(default="")
    profile_image: str = Field(default="")


class Experience(BaseModel):
    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    company: str = Field(min_length=1)
    period: str = Field(min_length=1)
    highlights: list[str] = Field(default_factory=list)


class Project(BaseModel):
    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    date: str = Field(default="")
    categories: list[str] = Field(default_factory=list)
    description: str = Field(min_length=1)
    technologies: list[str] = Field(default_factory=list)
    repository_url: str | None = None


class SkillCategory(BaseModel):
    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    items: list[str] = Field(default_factory=list)


class Certification(BaseModel):
    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    subtitle: str = Field(default="")
    description: str = Field(default="")


class Interest(BaseModel):
    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = Field(default="")


class PortfolioContent(BaseModel):
    profile: Profile
    hero_tags: list[str] = Field(default_factory=list)
    experiences: list[Experience] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    skill_categories: list[SkillCategory] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    interests: list[Interest] = Field(default_factory=list)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
