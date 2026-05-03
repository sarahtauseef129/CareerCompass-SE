//recommendationService.ts
import { AssessmentData, SKILL_LEVEL_MAP } from "@/types/assessment";
import { Career, CareerResult } from "@/types/career";
import { CAREERS } from "@/data/careers";

export function calculateCareerScores(assessment: AssessmentData): CareerResult[] {
  const results = CAREERS.map((career) => calculateSingleScore(career, assessment));
  results.sort((a, b) => b.finalScore - a.finalScore);
  return results;
}

function calculateSingleScore(career: Career, assessment: AssessmentData): CareerResult {
  const interestScore = calculateInterestScore(career, assessment);
  const skillScore = calculateSkillScore(career, assessment);
  const environmentScore = calculateEnvironmentScore(career, assessment);
  const finalScore = interestScore + skillScore + environmentScore;
  const missingSkills = findMissingSkills(career, assessment);

  return {
    career,
    finalScore: Math.round(finalScore * 100) / 100,
    interestScore: Math.round(interestScore * 100) / 100,
    skillScore: Math.round(skillScore * 100) / 100,
    environmentScore: Math.round(environmentScore * 100) / 100,
    missingSkills,
  };
}

function calculateInterestScore(career: Career, assessment: AssessmentData): number {
  const matchedRatings = assessment.interests
    .filter((i) => career.interest_tags.includes(i.tag))
    .reduce((sum, i) => sum + i.rating, 0);
  const maxPossible = career.interest_tags.length * 5;
  if (maxPossible === 0) return 0;
  return (matchedRatings / maxPossible) * 40;
}

function calculateSkillScore(career: Career, assessment: AssessmentData): number {
  let totalMatch = 0;
  const maxPossible = career.required_skills.length * 3;
  
  for (const reqSkill of career.required_skills) {
    const userSkill = assessment.skills.find(
      (s) => s.skill.toLowerCase() === reqSkill.toLowerCase()
    );
    if (userSkill) {
      totalMatch += SKILL_LEVEL_MAP[userSkill.level];
    }
  }
  
  if (maxPossible === 0) return 0;
  return (totalMatch / maxPossible) * 40;
}

function calculateEnvironmentScore(career: Career, assessment: AssessmentData): number {
  const matched = assessment.environmentPreferences.filter((pref) =>
    career.environment_tags.includes(pref)
  ).length;
  const total = career.environment_tags.length;
  if (total === 0) return 0;
  return (matched / total) * 20;
}

function findMissingSkills(career: Career, assessment: AssessmentData): string[] {
  return career.required_skills.filter((reqSkill) => {
    const userSkill = assessment.skills.find(
      (s) => s.skill.toLowerCase() === reqSkill.toLowerCase()
    );
    return !userSkill || SKILL_LEVEL_MAP[userSkill.level] < 2;
  });
}
