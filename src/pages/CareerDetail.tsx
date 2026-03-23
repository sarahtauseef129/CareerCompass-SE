import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CAREERS } from "@/data/careers";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { SkillRadarChart } from "@/components/SkillRadarChart";
import { getAssessment } from "@/services/storageService";
import { calculateCareerScores } from "@/services/recommendationService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, DollarSign, TrendingUp, GraduationCap, Briefcase, Bot } from "lucide-react";

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const career = CAREERS.find((c) => c.id === id);
  const assessment = getAssessment();

  if (!career) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Career not found</h1>
          <Button className="mt-4" onClick={() => navigate("/results")}>Back to Results</Button>
        </div>
      </div>
    );
  }

  const result = assessment ? calculateCareerScores(assessment).find((r) => r.career.id === id) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="bg-card rounded-2xl p-8 shadow-card mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">{career.title}</h1>
                <p className="text-muted-foreground">{career.industry}</p>
              </div>
              {result && (
                <Badge className="gradient-primary text-primary-foreground border-0 text-lg px-4 py-2 self-start">
                  {Math.round(result.finalScore)}% Match
                </Badge>
              )}
            </div>
            <p className="text-foreground mb-6">{career.description}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <DollarSign className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Salary Range</p>
                  <p className="text-sm font-medium">{career.average_salary_range}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <TrendingUp className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-sm font-medium">{career.growth_outlook}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <GraduationCap className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Education</p>
                  <p className="text-sm font-medium">{career.education_pathway}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <Briefcase className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Environment</p>
                  <p className="text-sm font-medium">{career.environment_tags.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CareerCompassAI Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => navigate(`/career/${id}/chat`, { replace: false })}
              className="gradient-primary text-primary-foreground text-base px-6 py-3 h-auto rounded-xl shadow-elevated hover:opacity-90 transition-opacity"
            >
              <Bot className="h-5 w-5 mr-2" />
              CareerCompassAI — Get Personalized Guidance
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Skills */}
            <div>
              <h2 className="text-xl font-bold mb-4">Skills Analysis</h2>
              <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
                <h3 className="font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {career.required_skills.map((s) => (
                    <Badge key={s} variant={result?.missingSkills.includes(s) ? "destructive" : "secondary"}>
                      {s}
                    </Badge>
                  ))}
                </div>
                {result && result.missingSkills.length > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-sm">
                    <span className="font-medium text-destructive">Skill gaps: </span>
                    {result.missingSkills.join(", ")}
                  </div>
                )}
              </div>
              {assessment && (
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h3 className="font-semibold mb-2">Your Skills vs Required</h3>
                  <SkillRadarChart career={career} assessment={assessment} />
                </div>
              )}
            </div>

            {/* Roadmap */}
            <div>
              <h2 className="text-xl font-bold mb-4">Learning Roadmap</h2>
              <p className="text-sm text-muted-foreground mb-4">Click steps to mark them as in progress and complete. Skill gaps are highlighted.</p>
              <RoadmapTimeline
                key={career.id}
                careerId={career.id}
                steps={career.roadmap}
                highlightSkills={result?.missingSkills}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
