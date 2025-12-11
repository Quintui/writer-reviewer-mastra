"use client";

import { useMemo } from "react";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import {
  WriteReviewWorkflowUIMessage,
  WriterEventData,
  ReviewerEventData,
} from "../types/workflow";
import { Button } from "./ui/button";
import { ReviewerPanel } from "./reviewer-panel";
import { WriterPanel } from "./writer-panel";

interface ProcessingScreenProps {
  topic: string;
  onReset: () => void;
  workflow: WriteReviewWorkflowUIMessage | null;
  status: "submitted" | "streaming" | "ready" | "error";
}

type Phase = "writing" | "reviewing" | "revising" | "approved";

interface IterationData {
  iteration: number;
  article: string;
  articleStatus: "streaming" | "completed";
  feedback?: string;
  feedbackStatus?: "streaming" | "completed";
  approved?: boolean;
}

export function ProcessingScreen({
  topic,
  onReset,
  workflow,
  status,
}: ProcessingScreenProps) {
  // Parse workflow data and group by iterationCount
  const { iterations, currentIteration, phase, isApproved } = useMemo(() => {
    if (!workflow) {
      return {
        iterations: [] as IterationData[],
        currentIteration: 1,
        phase: "writing" as Phase,
        isApproved: false,
      };
    }

    const writerParts: WriterEventData[] = [];
    const reviewerParts: ReviewerEventData[] = [];

    // Extract data parts from the workflow message
    for (const part of workflow.parts) {
      if (part.type === "data-writer-article") {
        writerParts.push(part.data);
      } else if (part.type === "data-reviewer-feedback") {
        reviewerParts.push(part.data);
      }
    }

    // Group by iterationCount
    const iterationMap = new Map<number, IterationData>();

    for (const writer of writerParts) {
      iterationMap.set(writer.iterationCount, {
        iteration: writer.iterationCount,
        article: writer.article,
        articleStatus: writer.status,
      });
    }

    for (const reviewer of reviewerParts) {
      const existing = iterationMap.get(reviewer.iterationCount);
      if (existing) {
        existing.feedback = reviewer.feedback;
        existing.feedbackStatus = reviewer.status;
        existing.approved = reviewer.approved;
      }
    }

    const iterations = Array.from(iterationMap.values()).sort(
      (a, b) => a.iteration - b.iteration,
    );

    // Determine current state
    const latestIteration = iterations[iterations.length - 1];
    const currentIteration = latestIteration?.iteration || 1;

    // Check if approved
    const isApproved = latestIteration?.approved === true;

    // Determine phase
    let phase: Phase = "writing";
    if (isApproved) {
      phase = "approved";
    } else if (latestIteration) {
      if (latestIteration.articleStatus === "streaming") {
        phase = "writing";
      } else if (latestIteration.articleStatus === "completed") {
        if (!latestIteration.feedback) {
          phase = "reviewing";
        } else if (latestIteration.feedbackStatus === "streaming") {
          phase = "reviewing";
        } else if (latestIteration.feedbackStatus === "completed") {
          // Check if we're starting a new iteration (revising)
          phase = "revising";
        }
      }
    }

    return {
      iterations,
      currentIteration,
      phase,
      isApproved,
    };
  }, [workflow]);

  // Get the latest article and feedback for display
  const latestIteration = iterations[iterations.length - 1];
  const article = latestIteration?.article || "";
  const feedback = latestIteration?.feedback || "";

  // Calculate max iterations (we don't know ahead of time, so estimate based on current)
  const maxIterations = Math.max(3, currentIteration);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate max-w-md">
            {topic}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-lg border border-border">
            <span className="text-sm font-mono text-muted-foreground">
              Iteration
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIterations }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${i < currentIteration ? (isApproved ? "bg-success" : "bg-primary") : "bg-border"}
                    ${i === currentIteration - 1 && !isApproved ? "scale-125" : ""}
                  `}
                />
              ))}
            </div>
            <span className="text-sm font-mono font-medium text-foreground">
              {currentIteration}/{maxIterations}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2 font-mono bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            New Topic
          </Button>
        </div>
      </header>

      {/* Main content - dual panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-px bg-border">
        <WriterPanel article={article} phase={phase} isApproved={isApproved} />
        <ReviewerPanel
          feedback={feedback}
          phase={phase}
          isApproved={isApproved}
        />
      </div>

      {/* Approval overlay */}
      {isApproved && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 pointer-events-none">
          <div className="flex items-center gap-3 px-6 py-3 bg-success/20 backdrop-blur-sm rounded-full border border-success/30 glow-success animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-semibold text-success">Article Approved</span>
          </div>
        </div>
      )}
    </div>
  );
}
