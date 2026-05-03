//assessment.ts
export interface InterestRating {
  question: string;
  tag: string;
  rating: number; // 1-5
}

export interface SkillProficiency {
  skill: string;
  level: 'none' | 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentData {
  interests: InterestRating[];
  skills: SkillProficiency[];
  environmentPreferences: string[];
}

export const INTEREST_QUESTIONS: { question: string; tag: string }[] = [
  { question: "I enjoy solving logical problems", tag: "logical" },
  { question: "I like helping people", tag: "helping" },
  { question: "I enjoy creative design", tag: "creative" },
  { question: "I like working with data", tag: "data" },
  { question: "I enjoy building things", tag: "building" },
  { question: "I prefer business and strategy", tag: "business" },
  { question: "I enjoy research and analysis", tag: "research" },
];

export const SKILLS_LIST = [
  "Programming",
  "Communication",
  "Mathematics",
  "Design",
  "Data Analysis",
  "Leadership",
  "Writing",
];

export const ENVIRONMENT_OPTIONS = [
  "Office-based",
  "Remote",
  "Field work",
  "Team-based",
  "Independent",
  "Research-oriented",
];

export const SKILL_LEVEL_MAP: Record<SkillProficiency['level'], number> = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};
