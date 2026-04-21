import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/storageService";
import { motion } from "framer-motion";
import { ArrowRight, Target, BarChart3, Route, BookmarkCheck } from "lucide-react";

const features = [
  { icon: Target, title: "Skills Assessment", desc: "Multi-step questionnaire covering interests, skills, and preferences" },
  { icon: BarChart3, title: "Smart Matching", desc: "Rule-based scoring engine matches you to 15+ careers" },
  { icon: Route, title: "Learning Roadmaps", desc: "Personalized step-by-step plans based on your skill gaps" },
  { icon: BookmarkCheck, title: "Track Progress", desc: "Bookmark careers and track your learning journey" },
];

const Index = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Discover Your <span className="text-gradient">Perfect Career</span> Path
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take a structured assessment, get matched to careers with a deterministic scoring engine, and follow personalized learning roadmaps.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground shadow-elevated text-base px-8"
                onClick={() => navigate(user ? "/assessment" : "/auth")}
              >
                {user ? "Take Assessment" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {!user && (
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base"
                  onClick={() => navigate("/auth?mode=login")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 CareerCompass. All rights reserved.</span>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
