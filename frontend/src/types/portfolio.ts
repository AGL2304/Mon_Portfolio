export interface Profile {
  full_name: string;
  headline: string;
  short_bio: string;
  about: string;
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  cv_url: string;
  profile_image: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
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
}

export interface Interest {
  id: string;
  title: string;
  description: string;
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

export const emptyPortfolioContent: PortfolioContent = {
  profile: {
    full_name: "",
    headline: "",
    short_bio: "",
    about: "",
    location: "",
    email: "",
    github_url: "",
    linkedin_url: "",
    cv_url: "",
    profile_image: "",
  },
  hero_tags: [],
  experiences: [],
  projects: [],
  skill_categories: [],
  certifications: [],
  interests: [],
};

