import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CareerCard } from "@/components/CareerCard";
import { ScoreBarChart } from "@/components/ScoreBarChart";
import { SkillRadarChart } from "@/components/SkillRadarChart";
import { getAssessment } from "@/services/storageService";
import { calculateCareerScores } from "@/services/recommendationService";
import { CareerResult } from "@/types/career";
import { AssessmentData } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GitCompareArrows } from "lucide-react";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<CareerResult[]>([]);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const data = getAssessment();
    if (data) {
      setAssessment(data);
      const scores = calculateCareerScores(data);
      setResults(scores);
    }
  }, []);

  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  if (!assessment)
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <GitCompareArrows className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
            <h1 className="text-2xl font-bold mb-3">No Career Matches Yet</h1>
            <p className="text-muted-foreground mb-8">
              Take the career assessment to discover your top 5 career matches based on your interests,
              skills, and preferences.
            </p>
            <Button
              onClick={() => navigate("/assessment")}
              className="gradient-primary text-primary-foreground"
            >
              Take Assessment
            </Button>
          </motion.div>
        </div>
      </div>
    );

  const top5 = results.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Your Career Matches</h1>
          <p className="text-muted-foreground">
            Based on your assessment, here are your top career recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-card"
          >
            <h3 className="font-semibold mb-4">Compatibility Scores</h3>
            <ScoreBarChart results={results} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card"
          >
            <h3 className="font-semibold mb-4">Skill Profile vs Top Match</h3>
            {top5[0] && <SkillRadarChart career={top5[0].career} assessment={assessment} />}
          </motion.div>
        </div>

        {compareList.length >= 2 && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => navigate(`/compare?ids=${compareList.join(",")}`)}
              className="gradient-primary text-primary-foreground"
            >
              <GitCompareArrows className="h-4 w-4 mr-2" />
              Compare {compareList.length} Careers
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center mb-6">
          Select up to 3 careers to compare.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top5.map((r, i) => (
            <motion.div
              key={r.career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className="relative">
                <div
                  className={`absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full border-2 cursor-pointer flex items-center justify-center text-xs font-bold transition-all ${
                    compareList.includes(r.career.id)
                      ? "gradient-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(r.career.id);
                  }}
                >
                  {compareList.includes(r.career.id) ? "✓" : i + 1}
                </div>

                <CareerCard
                  career={r.career}
                  score={r.finalScore}
                  missingSkills={r.missingSkills}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}