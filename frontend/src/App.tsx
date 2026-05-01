import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import AssessmentPage from "./pages/Assessment";
import ResultsPage from "./pages/Results";
import CareerDetailPage from "./pages/CareerDetail";
import CareerChatPage from "./pages/CareerChat";
import ComparePage from "./pages/Compare";
import BookmarksPage from "./pages/Bookmarks";
import FeedbackPage from "./pages/Feedback";
import LearningRoadmapPage from "./pages/LearningRoadmap";
import PrivacyPage from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/career/:id" element={<ProtectedRoute><CareerDetailPage /></ProtectedRoute>} />
          <Route path="/career/:id/chat" element={<ProtectedRoute><CareerChatPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><LearningRoadmapPage /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
