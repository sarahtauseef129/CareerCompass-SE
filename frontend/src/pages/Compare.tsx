import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CAREERS } from "@/data/careers";
import { getAssessment } from "@/services/storageService";
import { calculateCareerScores } from "@/services/recommendationService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean);
  const assessment = getAssessment();
  const results = assessment ? calculateCareerScores(assessment) : [];
  const careers = ids.map((id) => ({
    career: CAREERS.find((c) => c.id === id)!,
    result: results.find((r) => r.career.id === id),
  })).filter((c) => c.career);

  if (careers.length < 2) {
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

  const allSkills = [...new Set(careers.flatMap((c) => c.career.required_skills))];

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
                  <th key={c.career.id} className="p-4 text-center">
                    <span className="font-bold text-lg">{c.career.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-card">
                <td className="p-4 text-sm font-medium">Compatibility</td>
                {careers.map((c) => (
                  <td key={c.career.id} className="p-4 text-center">
                    <Badge className="gradient-primary text-primary-foreground border-0">
                      {c.result ? Math.round(c.result.finalScore) + "%" : "N/A"}
                    </Badge>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium">Salary</td>
                {careers.map((c) => (
                  <td key={c.career.id} className="p-4 text-center text-sm">{c.career.average_salary_range}</td>
                ))}
              </tr>
              <tr className="bg-card">
                <td className="p-4 text-sm font-medium">Growth</td>
                {careers.map((c) => (
                  <td key={c.career.id} className="p-4 text-center text-sm">{c.career.growth_outlook}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium">Education</td>
                {careers.map((c) => (
                  <td key={c.career.id} className="p-4 text-center text-sm">{c.career.education_pathway}</td>
                ))}
              </tr>
              {allSkills.map((skill) => (
                <tr key={skill} className="bg-card">
                  <td className="p-4 text-sm font-medium">{skill}</td>
                  {careers.map((c) => (
                    <td key={c.career.id} className="p-4 text-center">
                      {c.career.required_skills.includes(skill) ? (
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
