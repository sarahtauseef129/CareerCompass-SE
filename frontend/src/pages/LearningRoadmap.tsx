import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { getAssessment, getStartedRoadmaps } from "@/services/storageService";
import { calculateCareerScores } from "@/services/recommendationService";
import { CAREERS } from "@/data/careers";
import { Career } from "@/types/career";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Map, ArrowRight } from "lucide-react";

export default function LearningRoadmapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCareerId, setSelectedCareerId] = useState<string>("");
  const [availableCareers, setAvailableCareers] = useState<{ career: Career; label: string }[]>([]);

  useEffect(() => {
    const startedIds = getStartedRoadmaps();
    const assessment = getAssessment();
    const careers: { career: Career; label: string }[] = [];
    const addedIds = new Set<string>();

    // Add careers that have been explicitly started
    startedIds.forEach((careerId) => {
      const career = CAREERS.find((c) => c.id === careerId);
      if (career && !addedIds.has(careerId)) {
        let label = career.title;
        if (assessment) {
          const results = calculateCareerScores(assessment);
          const match = results.find((r) => r.career.id === careerId);
          if (match) label = `${career.title} (${Math.round(match.finalScore)}% match)`;
        }
        careers.push({ career, label });
        addedIds.add(careerId);
      }
    });

    // If a career is passed via query param, include it even if not started yet
    const queryCareerId = searchParams.get("career");
    if (queryCareerId && !addedIds.has(queryCareerId)) {
      const career = CAREERS.find((c) => c.id === queryCareerId);
      if (career) {
        let label = career.title;
        if (assessment) {
          const results = calculateCareerScores(assessment);
          const match = results.find((r) => r.career.id === queryCareerId);
          if (match) label = `${career.title} (${Math.round(match.finalScore)}% match)`;
        }
        careers.push({ career, label });
        addedIds.add(queryCareerId);
      }
    }

    setAvailableCareers(careers);

    // Select the query param career if present, otherwise first available
    if (queryCareerId && addedIds.has(queryCareerId)) {
      setSelectedCareerId(queryCareerId);
    } else if (careers.length > 0) {
      setSelectedCareerId(careers[0].career.id);
    }
  }, [searchParams]);

  const selectedCareer = CAREERS.find((c) => c.id === selectedCareerId);
  const assessment = getAssessment();
  const result = assessment && selectedCareer
    ? calculateCareerScores(assessment).find((r) => r.career.id === selectedCareerId)
    : null;

  if (availableCareers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Roadmaps Yet</h1>
          <p className="text-muted-foreground mb-6">Go to Career Matches and select a career to view and start its learning roadmap.</p>
          <Button className="gradient-primary text-primary-foreground" onClick={() => navigate("/results")}>
            View Career Matches <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Roadmap</h1>
            <p className="text-muted-foreground">Track your progress and follow guided learning paths</p>
          </div>

          {availableCareers.length > 1 && (
            <div className="max-w-md mx-auto mb-8">
              <Select value={selectedCareerId} onValueChange={setSelectedCareerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a career" />
                </SelectTrigger>
                <SelectContent>
                  {availableCareers.map((item) => (
                    <SelectItem key={item.career.id} value={item.career.id}>
                      {item.label}
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
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>📚 {selectedCareer.education_pathway}</span>
                  <span>💰 {selectedCareer.average_salary_range}</span>
                  <span>📈 {selectedCareer.growth_outlook}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Click the status icon to cycle through: Not Started → In Progress → Completed. Skill gaps are highlighted. Your roadmap is automatically saved when you interact with steps.
              </p>

              <RoadmapTimeline
                key={selectedCareer.id}
                careerId={selectedCareer.id}
                steps={selectedCareer.roadmap}
                highlightSkills={result?.missingSkills}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
