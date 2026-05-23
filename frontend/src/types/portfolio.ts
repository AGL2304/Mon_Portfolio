export interface Profile {
  full_name: string;
  headline: string;
  tagline: string;
  short_bio: string;
  about: string;
  availability: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  tryhackme_url: string;
  cv_url: string;
  profile_image: string;
  english_level: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  highlights: string[];
}

export interface Project {
  id: string;
  title: string;
  date: string;
  categories: string[];
  description: string;
  technologies: string[];
  repository_url: string | null;
  private_note: string | null;
}

export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
}

export interface Certification {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  in_progress: boolean;
}

export interface Interest {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface PortfolioContent {
  profile: Profile;
  hero_tags: string[];
  experiences: Experience[];
  projects: Project[];
  skill_categories: SkillCategory[];
  certifications: Certification[];
  interests: Interest[];
}

export interface UploadResponse {
  url: string;
  filename: string;
  content_type: string;
}

export const emptyPortfolioContent: PortfolioContent = {
  profile: {
    full_name: "",
    headline: "",
    tagline: "",
    short_bio: "",
    about: "",
    availability: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    github_url: "",
    linkedin_url: "",
    tryhackme_url: "",
    cv_url: "",
    profile_image: "",
    english_level: "",
  },
  hero_tags: [],
  experiences: [],
  projects: [],
  skill_categories: [],
  certifications: [],
  interests: [],
};
