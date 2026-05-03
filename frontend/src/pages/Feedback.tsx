// Feedback.tsx
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitFeedback, getFeedbackHistory, FeedbackResponseDto } from "@/services/feedbackApi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [allFeedback, setAllFeedback] = useState<FeedbackResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFeedbackHistory().then(setAllFeedback).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (!comment.trim()) { toast.error("Please add a comment"); return; }

    try {
      setLoading(true);
      const newFeedback = await submitFeedback(comment.trim(), rating);
      setAllFeedback((prev) => [newFeedback, ...prev]);
      setRating(0);
      setComment("");
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Feedback</h1>
        <p className="text-muted-foreground mb-8">Help us improve CareerCompass with your feedback</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button key={val} type="button" onClick={() => setRating(val)} className="transition-transform hover:scale-110">
                        <Star className={`h-8 w-8 transition-colors ${val <= rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Comments</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you think of CareerCompass?"
                    rows={4}
                    maxLength={1000}
                  />
                </div>
                <Button type="submit" disabled={loading} className="gradient-primary text-primary-foreground">
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {allFeedback.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Feedback</h2>
              <div className="space-y-3">
                {allFeedback.slice(0, 5).map((fb) => (
                  <Card key={fb.id} className="shadow-card">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <Star key={v} className={`h-4 w-4 ${v <= fb.rating ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{fb.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}