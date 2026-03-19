import { RoadmapStep, RoadmapStatus } from "@/types/career";
import {
  getRoadmapProgress,
  cycleRoadmapStep,
  startRoadmap,
  isRoadmapStarted,
} from "@/services/storageService";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
  ChevronDown,
  BookOpen,
  Video,
  Dumbbell,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Props {
  careerId: string;
  steps: RoadmapStep[];
  highlightSkills?: string[];
}

const statusConfig: Record<
  RoadmapStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  not_started: {
    label: "Not Started",
    icon: <Circle className="h-5 w-5 text-muted-foreground" />,
    className: "bg-card border-border",
  },
  in_progress: {
    label: "In Progress",
    icon: <PlayCircle className="h-5 w-5 text-primary" />,
    className: "bg-primary/5 border-primary/30",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-5 w-5 text-accent" />,
    className: "bg-accent/10 border-accent/30",
  },
};

const difficultyConfig: Record<string, string> = {
  Beginner: "bg-accent/15 text-accent",
  Intermediate: "bg-primary/15 text-primary",
  Advanced: "bg-destructive/15 text-destructive",
};

const priorityLabels: Record<number, string> = {
  1: "High Priority",
  2: "Medium",
  3: "Low",
};

const priorityColors: Record<number, string> = {
  1: "text-destructive",
  2: "text-primary",
  3: "text-muted-foreground",
};

export function RoadmapTimeline({
  careerId,
  steps,
  highlightSkills = [],
}: Props) {
  const [progress, setProgress] = useState(getRoadmapProgress(careerId));
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setProgress(getRoadmapProgress(careerId));
    setExpandedIndex(null);
  }, [careerId, steps]);

  const sortedSteps = [...steps].sort((a, b) => a.order_index - b.order_index);

  const handleCycleStatus = (e: React.MouseEvent, orderIndex: number) => {
    e.stopPropagation();

    if (!isRoadmapStarted(careerId)) {
      startRoadmap(careerId);
    }

    const newStatus = cycleRoadmapStep(careerId, orderIndex);

    setProgress((prev) => ({
      ...prev,
      [orderIndex]: newStatus,
    }));
  };

  const completedCount = sortedSteps.filter(
    (s) => (progress[s.order_index] || "not_started") === "completed"
  ).length;

  const inProgressCount = sortedSteps.filter(
    (s) => (progress[s.order_index] || "not_started") === "in_progress"
  ).length;

  const overallPercent =
    sortedSteps.length > 0
      ? Math.round(
          ((completedCount + inProgressCount * 0.5) / sortedSteps.length) * 100
        )
      : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-4 border border-border shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{sortedSteps.length} completed
          </span>
        </div>

        <Progress value={overallPercent} className="h-2" />

        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Circle className="h-3 w-3" />
            {sortedSteps.length - completedCount - inProgressCount} not started
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="h-3 w-3 text-primary" />
            {inProgressCount} in progress
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-accent" />
            {completedCount} completed
          </span>
        </div>
      </div>

      {sortedSteps.map((step) => {
        const status: RoadmapStatus =
          progress[step.order_index] || "not_started";
        const config = statusConfig[status];
        const isGap = highlightSkills.includes(step.required_skill);
        const isExpanded = expandedIndex === step.order_index;

        return (
          <Collapsible
            key={step.order_index}
            open={isExpanded}
            onOpenChange={(open) =>
              setExpandedIndex(open ? step.order_index : null)
            }
          >
            <div
              className={cn(
                "rounded-xl border transition-all",
                config.className,
                isGap &&
                  status === "not_started" &&
                  "border-destructive/20 bg-destructive/5",
                "hover:shadow-card"
              )}
            >
              <div className="flex items-start gap-4 p-4">
                <button
                  onClick={(e) => handleCycleStatus(e, step.order_index)}
                  className="pt-0.5 hover:scale-110 transition-transform"
                  title={`Status: ${config.label}. Click to change.`}
                >
                  {config.icon}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4
                      className={cn(
                        "font-medium text-sm",
                        status === "completed" &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </h4>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0",
                          difficultyConfig[step.difficulty_level]
                        )}
                      >
                        {step.difficulty_level}
                      </Badge>

                      <span
                        className={cn(
                          "text-xs font-medium",
                          priorityColors[step.priority_level]
                        )}
                      >
                        {priorityLabels[step.priority_level]}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {step.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step.estimated_duration_weeks} weeks
                    </span>

                    <span
                      className={cn(
                        "font-medium",
                        isGap ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {step.required_skill} {isGap && "(skill gap)"}
                    </span>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0 ml-auto",
                        status === "completed"
                          ? "border-accent text-accent"
                          : status === "in_progress"
                          ? "border-primary text-primary"
                          : ""
                      )}
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>

                <CollapsibleTrigger asChild>
                  <button className="pt-1 hover:text-foreground text-muted-foreground transition-colors">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0">
                  <div className="pt-4 space-y-4">
                    {step.step_by_step_guide.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Step-by-Step Guide
                        </h5>

                        <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground pl-1">
                          {step.step_by_step_guide.map((instruction, i) => (
                            <li key={i} className="leading-relaxed">
                              {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-3 gap-3">
                      {step.helping_materials.articles.length > 0 && (
                        <div className="bg-secondary/50 rounded-lg p-3">
                          <h6 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3 text-primary" />
                            Articles
                          </h6>
                          <ul className="space-y-1">
                            {step.helping_materials.articles.map((a, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-muted-foreground"
                              >
                                • {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.helping_materials.tutorials.length > 0 && (
                        <div className="bg-secondary/50 rounded-lg p-3">
                          <h6 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                            <Video className="h-3 w-3 text-accent" />
                            Tutorials
                          </h6>
                          <ul className="space-y-1">
                            {step.helping_materials.tutorials.map((t, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-muted-foreground"
                              >
                                • {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.helping_materials.exercises.length > 0 && (
                        <div className="bg-secondary/50 rounded-lg p-3">
                          <h6 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                            <Dumbbell className="h-3 w-3 text-destructive" />
                            Exercises
                          </h6>
                          <ul className="space-y-1">
                            {step.helping_materials.exercises.map((ex, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-muted-foreground"
                              >
                                • {ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}