import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  INTEREST_QUESTIONS,
  SKILLS_LIST,
  ENVIRONMENT_OPTIONS,
  type AssessmentData,
  type InterestRating,
  type SkillProficiency,
} from "@/types/assessment";
import { saveAssessment } from "@/services/storageService";
import { saveAssessment as saveAssessmentToBackend } from "@/services/assessmentsApi";
import { getCurrentUser } from "@/services/storageService";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const TOTAL_STEPS = 3;

export function AssessmentWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interests, setInterests] = useState<InterestRating[]>(
    INTEREST_QUESTIONS.map((q) => ({ question: q.question, tag: q.tag, rating: 3 }))
  );
  const [skills, setSkills] = useState<SkillProficiency[]>(
    SKILLS_LIST.map((s) => ({ skill: s, level: "none" }))
  );
  const [envPrefs, setEnvPrefs] = useState<string[]>([]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const updateInterest = (idx: number, rating: number) => {
    setInterests((prev) => prev.map((i, j) => (j === idx ? { ...i, rating } : i)));
  };

  const updateSkill = (idx: number, level: SkillProficiency["level"]) => {
    setSkills((prev) => prev.map((s, j) => (j === idx ? { ...s, level } : s)));
  };

  const toggleEnv = (env: string) => {
    setEnvPrefs((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const data: AssessmentData = { interests, skills, environmentPreferences: envPrefs };
      
      // Save to local storage first (for offline support)
      saveAssessment(data);
      
      // Try to save to backend
      const user = getCurrentUser();
      if (user && user.id) {
        try {
          // Calculate scores based on assessment data
          const interestScore = interests.reduce((sum, i) => sum + i.rating, 0) / interests.length;
          const skillScore = skills.reduce((sum, s) => {
            const levels: Record<string, number> = { none: 0, beginner: 1, intermediate: 2, advanced: 3 };
            return sum + (levels[s.level] || 0);
          }, 0) / skills.length;
          const environmentScore = (envPrefs.length / ENVIRONMENT_OPTIONS.length) * 5;

          // Create assessment payload for backend
          const assessmentPayload = {
            userId: user.id,
            responses: {
              interests: interests.map(i => ({ question: i.question, rating: i.rating })),
              skills: skills.map(s => ({ skill: s.skill, level: s.level })),
              environmentPreferences: envPrefs,
            },
            interestScore,
            skillScore,
            environmentScore,
          };

          // Save to backend
          await saveAssessmentToBackend(assessmentPayload);
          console.log("Assessment saved to backend successfully");
        } catch (backendError) {
          console.warn("Could not save assessment to backend, using local storage only:", backendError);
        }
      }
      
      navigate("/results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      // Still navigate even if there's an error, using local data
      navigate("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillLevels: { value: SkillProficiency["level"]; label: string }[] = [
    { value: "none", label: "None" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Section A – Interests</CardTitle>
                <p className="text-sm text-muted-foreground">Rate each statement from 1 (Disagree) to 5 (Strongly Agree). Weight: 40%</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {interests.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium mb-2">{item.question}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateInterest(idx, val)}
                          className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                            item.rating === val
                              ? "gradient-primary text-primary-foreground shadow-elevated"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Section B – Existing Skills</CardTitle>
                <p className="text-sm text-muted-foreground">Select your proficiency level for each skill. Weight: 40%</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {skills.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium mb-2">{item.skill}</p>
                    <div className="flex flex-wrap gap-2">
                      {skillLevels.map((sl) => (
                        <button
                          key={sl.value}
                          onClick={() => updateSkill(idx, sl.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            item.level === sl.value
                              ? "gradient-primary text-primary-foreground shadow-elevated"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {sl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Section C – Work Environment</CardTitle>
                <p className="text-sm text-muted-foreground">Select your preferred work environments. Weight: 20%</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {ENVIRONMENT_OPTIONS.map((env) => (
                    <button
                      key={env}
                      onClick={() => toggleEnv(env)}
                      className={`p-4 rounded-xl text-sm font-medium text-left transition-all border ${
                        envPrefs.includes(env)
                          ? "gradient-primary text-primary-foreground border-primary shadow-elevated"
                          : "bg-card text-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0 || isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        {step < TOTAL_STEPS - 1 ? (
          <Button 
            onClick={() => setStep((s) => s + 1)} 
            disabled={isSubmitting}
            className="gradient-primary text-primary-foreground"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gradient-primary text-primary-foreground"
          >
            {isSubmitting ? "Processing..." : "Get Results"}
            <Send className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
