//career.ts
export interface Career {
  id: string;
  title: string;
  description: string;
  industry: string;
  education_pathway: string;
  average_salary_range: string;
  growth_outlook: string;
  interest_tags: string[];
  required_skills: string[];
  environment_tags: string[];
  roadmap: RoadmapStep[];
}

export interface HelpingMaterials {
  articles: string[];
  tutorials: string[];
  exercises: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  priority_level: 1 | 2 | 3;
  estimated_duration_weeks: number;
  required_skill: string;
  order_index: number;
  completed?: boolean;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  helping_materials: HelpingMaterials;
  step_by_step_guide: string[];
}

export type RoadmapStatus = "not_started" | "in_progress" | "completed";

export interface CareerResult {
  career: Career;
  finalScore: number;
  interestScore: number;
  skillScore: number;
  environmentScore: number;
  missingSkills: string[];
}

export interface Bookmark {
  careerId: string;
  savedAt: string;
}

export interface Feedback {
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
