import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { getCareerById, getAllCareers, CareerResponseDto } from "@/services/careersApi";
import { getRoadmap, getRoadmapProgress, markStepComplete, RoadmapResponseDto, RoadmapProgressDto } from "@/services/roadmapApi";
import { getCachedCareers, titleToBackendId } from "@/services/careerStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Briefcase, Bot, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ALL state hooks must be declared before any return
  const [career, setCareer] = useState<CareerResponseDto | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponseDto | null>(null);
  const [progress, setProgress] = useState<RoadmapProgressDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchByNumericId = (nid: number) => {
      Promise.all([
        getCareerById(nid),
        getRoadmap(nid).catch(() => null),
        getRoadmapProgress(nid).catch(() => []),
      ])
        .then(([careerData, roadmapData, progressData]) => {
          setCareer(careerData);
          setRoadmap(roadmapData);
          setProgress(progressData as RoadmapProgressDto[]);
        })
        .catch(() => setCareer(null))
        .finally(() => setLoading(false));
    };

    const numericId = Number(id);
    setLoading(true);

    if (!isNaN(numericId)) {
      fetchByNumericId(numericId);
    } else {
      getCachedCareers()
        .then((careers) => {
          const backendId = titleToBackendId(
            id.replace(/-/g, ' '),
            careers
          );
          if (!backendId) {
            setCareer(null);
            setLoading(false);
            return;
          }
          fetchByNumericId(backendId);
        })
        .catch(() => {
          setCareer(null);
          setLoading(false);
        });
    }
  }, [id]);

  const handleToggleStep = async (stepId: number, currentCompleted: boolean) => {
    try {
      const updated = await markStepComplete(stepId, !currentCompleted);
      setProgress((prev) =>
        prev.map((p) =>
          p.stepId === stepId
            ? { ...p, completed: updated.completed, completedAt: updated.completedAt }
            : p
        )
      );
      toast.success(updated.completed ? "Step marked complete!" : "Step marked incomplete");
    } catch {
      toast.error("Failed to update step");
    }
  };

  // returns AFTER all hooks
  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center text-muted-foreground">Loading...</div>
    </div>
  );

  if (!career) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Career not found</h1>
        <Button className="mt-4" onClick={() => navigate("/results")}>Back to Results</Button>
      </div>
    </div>
  );

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
            <h1 className="text-3xl font-bold mb-2">{career.title}</h1>
            <p className="text-muted-foreground mb-6">{career.description}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <GraduationCap className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Education</p>
                  <p className="text-sm font-medium">{career.educationPath ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <Briefcase className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="text-sm font-medium">{career.industryOverview ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => navigate(`/career/${id}/chat`)}
              className="gradient-primary text-primary-foreground text-base px-6 py-3 h-auto rounded-xl"
            >
              <Bot className="h-5 w-5 mr-2" />
              CareerCompassAI — Get Personalized Guidance
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Skills */}
            <div>
              <h2 className="text-xl font-bold mb-4">Required Skills</h2>
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex flex-wrap gap-2">
                  {career.skills && career.skills.length > 0 ? (
                    career.skills.map((s) => (
                      <Badge key={s.id} variant="secondary">
                        {s.skillName}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({s.importanceLevel}/5)
                        </span>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div>
              <h2 className="text-xl font-bold mb-4">Learning Roadmap</h2>
              {!roadmap ? (
                <div className="bg-card rounded-2xl p-6 shadow-card text-center text-muted-foreground text-sm">
                  No roadmap available yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {roadmap.steps.map((step) => {
                    const stepProgress = progress.find((p) => p.stepId === step.id);
                    const completed = stepProgress?.completed ?? false;
                    return (
                      <div
                        key={step.id}
                        className={`bg-card rounded-xl p-4 shadow-card border-l-4 ${
                          completed ? "border-accent" : "border-primary"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleStep(step.id, completed)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <p className={`font-medium text-sm ${completed ? "line-through text-muted-foreground" : ""}`}>
                              {step.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}