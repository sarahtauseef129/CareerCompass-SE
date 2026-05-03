// Compare.tsximport { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { compareCareers, ComparisonResponseDto } from "@/services/comparisonApi";
import { getAssessment } from "@/services/storageService";
import { calculateCareerScores } from "@/services/recommendationService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState<ComparisonResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ids from URL are numeric backend IDs e.g. "1,2,3"
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean).map(Number);

  const assessment = getAssessment();
  const localResults = assessment ? calculateCareerScores(assessment) : [];

  useEffect(() => {
    if (ids.length < 2) { setLoading(false); return; }
    compareCareers(ids)
      .then(setComparison)
      .catch(() => setError("Failed to load comparison data"))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (ids.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Select at least 2 careers to compare</h1>
          <Button className="mt-4" onClick={() => navigate("/results")}>Back to Results</Button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center text-muted-foreground">Loading comparison...</div>
    </div>
  );

  if (error || !comparison) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center">
        <p className="text-destructive mb-4">{error || "Something went wrong"}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );

  const careers = comparison.careers;

  // collect all unique skill names across compared careers
  const allSkills = [...new Set(careers.flatMap((c) => c.skills?.map((s) => s.skillName) ?? []))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-center">Career Comparison</h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Attribute</th>
                {careers.map((c) => (
                  <th key={c.id} className="p-4 text-center">
                    <span className="font-bold text-lg">{c.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-card">
                <td className="p-4 text-sm font-medium">Education</td>
                {careers.map((c) => (
                  <td key={c.id} className="p-4 text-center text-sm">{c.educationPath ?? "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium">Industry</td>
                {careers.map((c) => (
                  <td key={c.id} className="p-4 text-center text-sm">{c.industryOverview ?? "—"}</td>
                ))}
              </tr>
              {allSkills.map((skill, i) => (
                <tr key={skill} className={i % 2 === 0 ? "bg-card" : ""}>
                  <td className="p-4 text-sm font-medium">{skill}</td>
                  {careers.map((c) => (
                    <td key={c.id} className="p-4 text-center">
                      {c.skills?.some((s) => s.skillName === skill) ? (
                        <Check className="h-5 w-5 text-accent mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}