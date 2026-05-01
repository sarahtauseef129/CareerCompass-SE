import { Career } from "@/types/career";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { isBookmarked, addBookmark, removeBookmark, getCurrentUser } from "@/services/storageService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  career: Career;
  score?: number;
  missingSkills?: string[];
  showBookmark?: boolean;
}

export function CareerCard({ career, score, missingSkills, showBookmark = true }: Props) {
  const [bookmarked, setBookmarked] = useState(isBookmarked(career.id));
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    setBookmarked(isBookmarked(career.id));
  }, [career.id, currentUser?.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (bookmarked) {
      removeBookmark(career.id);
      setBookmarked(false);
    } else {
      addBookmark(career.id);
      setBookmarked(true);
    }
  };

  return (
    <Card
      className="group cursor-pointer bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/career/${career.id}`)}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{career.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{career.industry}</p>
        </div>
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <Badge className="gradient-primary text-primary-foreground border-0 text-sm">
              {Math.round(score)}%
            </Badge>
          )}
          {showBookmark && (
            <button onClick={toggleBookmark} className="text-muted-foreground hover:text-accent transition-colors">
              {bookmarked ? <BookmarkCheck className="h-5 w-5 text-accent" /> : <Bookmark className="h-5 w-5" />}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{career.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {career.required_skills.map((skill) => (
            <Badge
              key={skill}
              variant={missingSkills?.includes(skill) ? "destructive" : "secondary"}
              className="text-xs"
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{career.average_salary_range}</span>
          <span>{career.growth_outlook.split("–")[0]}</span>
        </div>
      </CardContent>
    </Card>
  );
}