// LearningRoadmap.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { getAllCareers, CareerResponseDto } from "@/services/careersApi";
import { getRoadmap, getRoadmapProgress, markStepComplete, RoadmapResponseDto, RoadmapProgressDto } from "@/services/roadmapApi";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Map, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export default function LearningRoadmapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [careers, setCareers] = useState<CareerResponseDto[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponseDto | null>(null);
  const [progress, setProgress] = useState<RoadmapProgressDto[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Load all careers on mount
  useEffect(() => {
    getAllCareers()
      .then((data) => {
        setCareers(data);
        // check if careerId passed via query param
        const queryId = searchParams.get("career");
        if (queryId) {
          setSelectedCareerId(Number(queryId));
        } else if (data.length > 0) {
          setSelectedCareerId(data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingCareers(false));
  }, []);

  // Load roadmap when career changes
  useEffect(() => {
    if (!selectedCareerId) return;
    setLoadingRoadmap(true);
    Promise.all([
      getRoadmap(selectedCareerId),
      getRoadmapProgress(selectedCareerId),
    ])
      .then(([roadmapData, progressData]) => {
        setRoadmap(roadmapData);
        setProgress(progressData);
      })
      .catch(() => {
        setRoadmap(null);
        setProgress([]);
      })
      .finally(() => setLoadingRoadmap(false));
  }, [selectedCareerId]);

  const handleToggleStep = async (stepId: number, currentCompleted: boolean) => {
    try {
      const updated = await markStepComplete(stepId, !currentCompleted);
      setProgress((prev) =>
        prev.map((p) => p.stepId === stepId ? { ...p, completed: updated.completed, completedAt: updated.completedAt } : p)
      );
      toast.success(updated.completed ? "Step marked complete!" : "Step marked incomplete");
    } catch {
      toast.error("Failed to update step");
    }
  };

  if (loadingCareers) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center text-muted-foreground">Loading...</div>
    </div>
  );

  const selectedCareer = careers.find((c) => c.id === selectedCareerId);
  const completedCount = progress.filter((p) => p.completed).length;
  const totalSteps = roadmap?.steps.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Roadmap</h1>
            <p className="text-muted-foreground">Track your progress and follow guided learning paths</p>
          </div>

          {careers.length > 1 && (
            <div className="max-w-md mx-auto mb-8">
              <Select
                value={selectedCareerId?.toString()}
                onValueChange={(val) => setSelectedCareerId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a career" />
                </SelectTrigger>
                <SelectContent>
                  {careers.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedCareer && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
                <h2 className="text-xl font-bold mb-1">{selectedCareer.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">{selectedCareer.description}</p>
                <p className="text-xs text-muted-foreground">📚 {selectedCareer.educationPath}</p>
              </div>

              {loadingRoadmap ? (
                <div className="text-center py-12 text-muted-foreground">Loading roadmap...</div>
              ) : !roadmap ? (
                <div className="text-center py-12">
                  <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No roadmap available for this career yet.</p>
                </div>
              ) : (
                <div>
                  {/* Progress bar */}
                  <div className="bg-card rounded-2xl p-4 shadow-card mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">{completedCount}/{totalSteps} steps</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary transition-all duration-500"
                        style={{ width: totalSteps > 0 ? `${(completedCount / totalSteps) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4">
                    {roadmap.steps.map((step) => {
                      const stepProgress = progress.find((p) => p.stepId === step.id);
                      const completed = stepProgress?.completed ?? false;
                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`bg-card rounded-2xl p-5 shadow-card border-l-4 transition-all ${
                            completed ? "border-accent opacity-75" : "border-primary"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => handleToggleStep(step.id, completed)}
                              className="mt-0.5 flex-shrink-0"
                            >
                              {completed ? (
                                <CheckCircle2 className="h-6 w-6 text-accent" />
                              ) : (
                                <Circle className="h-6 w-6 text-muted-foreground" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-muted-foreground font-medium">Step {step.stepOrder}</span>
                              </div>
                              <h3 className={`font-semibold mb-1 ${completed ? "line-through text-muted-foreground" : ""}`}>
                                {step.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                              {completed && stepProgress?.completedAt && (
                                <p className="text-xs text-accent mt-2">
                                  Completed {new Date(stepProgress.completedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}