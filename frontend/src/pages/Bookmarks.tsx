import { Header } from "@/components/Header";
import { CareerCard } from "@/components/CareerCard";
import { getBookmarks } from "@/services/storageService";
import { CAREERS } from "@/data/careers";
import { motion } from "framer-motion";
import { BookmarkX } from "lucide-react";

export default function BookmarksPage() {
  const bookmarks = getBookmarks();
  const savedCareers = bookmarks
    .map((b) => CAREERS.find((c) => c.id === b.careerId))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2">Saved Careers</h1>
        <p className="text-muted-foreground mb-8">Your bookmarked careers for quick access</p>

        {savedCareers.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground">Take an assessment and bookmark careers you're interested in</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCareers.map((career, i) => (
              <motion.div
                key={career!.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <CareerCard career={career!} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
