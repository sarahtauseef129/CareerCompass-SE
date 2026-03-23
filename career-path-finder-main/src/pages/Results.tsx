import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CareerCard } from "@/components/CareerCard";
import { ScoreBarChart } from "@/components/ScoreBarChart";
import { SkillRadarChart } from "@/components/SkillRadarChart";
import { getAssessment, getCurrentUser } from "@/services/storageService";
import { calculateCareerScores } from "@/services/recommendationService";
import { getUserRecommendations } from "@/services/recommendationsApi";
import { getUserAssessment } from "@/services/assessmentsApi";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true);
        // Try to get current user from storage or backend
        const user = getCurrentUser();
        
        if (!user || !user.id) {
          // No user logged in, use local assessment
          const localData = getAssessment();
          if (localData) {
            setAssessment(localData);
            const scores = calculateCareerScores(localData);
            setResults(scores);
          }
          setIsLoading(false);
          return;
        }

        // Try to fetch recommendations from backend
        try {
          const response = await getUserRecommendations(user.id);
          
          // Map backend recommendations to CareerResult format
          if (response.recommendations && response.recommendations.length > 0) {
            const mappedResults: CareerResult[] = response.recommendations.map((rec) => ({
              career: {
                id: String(rec.id),
                title: rec.careerTitle,
                description: rec.careerDescription || "Career opportunity",
                industry: "Various Industries",
                education_pathway: "Check detailed profile",
                average_salary_range: "Competitive",
                growth_outlook: "Growing",
                interest_tags: [],
                required_skills: [],
                environment_tags: [],
                roadmap: [],
              },
              finalScore: rec.score,
              interestScore: rec.interestScore,
              skillScore: rec.skillScore,
              environmentScore: rec.environmentScore,
              missingSkills: [],
            }));

            setResults(mappedResults);
            
            // Try to get the assessment data to populate details
            try {
              const assessmentResponse = await getUserAssessment(user.id);
              if (assessmentResponse) {
                // Keep the assessment data for showing skill profile
                setAssessment({
                  interests: [],
                  skills: [],
                  workEnvironment: [],
                  careerValues: [],
                });
              }
            } catch (e) {
              // Assessment not found or error, but we have recommendations
            }
          }
        } catch (backendError) {
          // Backend failed, fall back to local calculation
          console.error("Backend recommendations failed:", backendError);
          const localData = getAssessment();
          if (localData) {
            setAssessment(localData);
            const scores = calculateCareerScores(localData);
            setResults(scores);
          } else {
            setError("Unable to load recommendations. Please retake the assessment.");
          }
        }
      } catch (err) {
        console.error("Error loading results:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, []);

  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="h-16 w-16 mx-auto mb-6 bg-muted rounded-full animate-pulse" />
            <h1 className="text-2xl font-bold mb-3">Loading your recommendations...</h1>
            <p className="text-muted-foreground">
              We're analyzing your assessment data to find the best career matches.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || (!assessment && results.length === 0)) {
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
              {error || "Take the career assessment to discover your top 5 career matches based on your interests, skills, and preferences."}
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
  }

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