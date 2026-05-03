// Bookmarks.tsx
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { getBookmarks, removeBookmark, BookmarkResponseDto } from "@/services/bookmarksApi";
import { motion } from "framer-motion";
import { BookmarkX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  getBookmarks()
    .then((data) => {
      console.log('bookmarks:', data);
      setBookmarks(data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  const handleRemove = async (careerId: number) => {
    try {
      await removeBookmark(careerId);
      setBookmarks((prev) => prev.filter((b) => b.careerId !== careerId));
      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    }
    
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2">Saved Careers</h1>
        <p className="text-muted-foreground mb-8">Your bookmarked careers for quick access</p>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground">Take an assessment and bookmark careers you're interested in</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark, i) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="shadow-card h-full">
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{bookmark.careerTitle}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(bookmark.careerId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {bookmark.careerDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {bookmark.careerDescription}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-auto">
                      Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}