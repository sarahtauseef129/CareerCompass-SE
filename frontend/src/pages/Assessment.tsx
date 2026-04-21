import { Header } from "@/components/Header";
import { AssessmentWizard } from "@/components/AssessmentWizard";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Career Assessment</h1>
          <p className="text-muted-foreground">Answer the following questions to discover your ideal career path</p>
        </div>
        <AssessmentWizard />
      </div>
    </div>
  );
}
