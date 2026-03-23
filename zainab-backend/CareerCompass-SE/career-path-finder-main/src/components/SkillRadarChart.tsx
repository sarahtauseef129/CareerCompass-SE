import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { AssessmentData, SKILL_LEVEL_MAP } from "@/types/assessment";
import { Career } from "@/types/career";
import { SKILLS_LIST } from "@/types/assessment";

interface Props {
  career: Career;
  assessment: AssessmentData;
}

export function SkillRadarChart({ career, assessment }: Props) {
  const data = SKILLS_LIST.map((skill) => {
    const userSkill = assessment.skills.find((s) => s.skill === skill);
    const userLevel = userSkill ? SKILL_LEVEL_MAP[userSkill.level] : 0;
    const required = career.required_skills.includes(skill) ? 3 : 0;
    return {
      skill,
      "Your Level": userLevel,
      Required: required,
    };
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(220, 13%, 91%)" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fontSize: 10 }} />
          <Radar name="Your Level" dataKey="Your Level" stroke="hsl(243, 76%, 58%)" fill="hsl(243, 76%, 58%)" fillOpacity={0.3} />
          <Radar name="Required" dataKey="Required" stroke="hsl(173, 80%, 40%)" fill="hsl(173, 80%, 40%)" fillOpacity={0.2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
