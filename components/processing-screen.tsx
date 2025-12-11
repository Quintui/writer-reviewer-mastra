"use client"

import { useState, useEffect, useCallback } from "react"
import { RotateCcw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WriterPanel } from "@/components/writer-panel"
import { ReviewerPanel } from "@/components/reviewer-panel"

interface ProcessingScreenProps {
  topic: string
  onReset: () => void
}

type Phase = "writing" | "reviewing" | "revising" | "approved"

interface IterationState {
  iteration: number
  maxIterations: number
  phase: Phase
  article: string
  feedback: string
  score: number
}

const SAMPLE_ARTICLES = [
  `The intersection of ancient philosophy and modern artificial intelligence presents a fascinating paradox. While Aristotle pondered the nature of thought and Plato explored the realm of ideal forms, today's engineers grapple with remarkably similar questions in silicon and code.

The concept of virtue ethics, championed by the Stoics, finds surprising relevance in AI alignment research. How do we instill values in systems that lack consciousness? The ancient Greeks believed virtue was a practice—a habit cultivated through repetition.`,

  `The intersection of ancient philosophy and modern artificial intelligence reveals profound insights about human nature and machine cognition. While Aristotle meticulously categorized knowledge and Plato explored the realm of ideal forms, contemporary AI researchers face strikingly parallel challenges in their pursuit of machine intelligence.

The concept of virtue ethics, championed by Stoic philosophers, offers unexpected wisdom for AI alignment research. The fundamental question persists: How do we instill genuine values in systems that lack consciousness? The ancient Greeks understood virtue as praxis—a habit cultivated through deliberate, repeated action.

This philosophical framework suggests that AI systems might develop ethical behavior not through explicit programming, but through iterative exposure to morally sound decisions.`,

  `The intersection of ancient philosophy and modern artificial intelligence reveals profound insights that bridge millennia of human intellectual pursuit. While Aristotle meticulously categorized knowledge and Plato explored the realm of ideal forms, contemporary AI researchers face strikingly parallel challenges in their quest for machine intelligence.

The concept of virtue ethics, championed by Stoic philosophers like Epictetus and Marcus Aurelius, offers unexpected wisdom for AI alignment research. The fundamental question persists across ages: How do we instill genuine values in systems that lack consciousness? The ancient Greeks understood virtue as praxis—a habit cultivated through deliberate, repeated action over a lifetime.

This philosophical framework suggests that AI systems might develop ethical behavior not through explicit rule-based programming, but through iterative exposure to morally sound decisions. Just as a person becomes just by performing just acts, perhaps machines can become aligned by processing aligned examples.

The implications are profound. If we accept that wisdom cannot be merely transmitted but must be earned through experience, then our approach to AI development must embrace this ancient truth. The future of ethical AI may depend less on our ability to codify morality and more on our capacity to create environments where artificial minds can cultivate virtue through practice.`,
]

const SAMPLE_FEEDBACK = [
  {
    feedback: `The opening establishes a compelling parallel but needs deeper exploration. Consider:

• Expand the Stoic virtue ethics connection with specific examples
• The transition between philosophy and AI feels abrupt
• Add concrete implications for modern AI development
• The conclusion lacks a memorable takeaway`,
    score: 65,
  },
  {
    feedback: `Significant improvement in depth and flow. The Stoic connection is stronger now. Suggestions:

• The concept of "praxis" deserves more exploration
• Consider adding a forward-looking conclusion
• Minor: tighten the second paragraph's structure
• The philosophical-to-practical bridge is clearer`,
    score: 82,
  },
  {
    feedback: `Excellent refinement. The article now flows naturally from ancient wisdom to modern application. The Marcus Aurelius reference adds authority.

The conclusion effectively ties together the philosophical and practical threads. Minor polish on sentence rhythm recommended, but this meets publication standards.`,
    score: 94,
  },
]

export function ProcessingScreen({ topic, onReset }: ProcessingScreenProps) {
  const [state, setState] = useState<IterationState>({
    iteration: 1,
    maxIterations: 3,
    phase: "writing",
    article: "",
    feedback: "",
    score: 0,
  })

  const simulatePhase = useCallback(() => {
    const { iteration, phase, maxIterations } = state

    if (phase === "writing") {
      // Simulate writing completion
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          article: SAMPLE_ARTICLES[Math.min(prev.iteration - 1, SAMPLE_ARTICLES.length - 1)],
          phase: "reviewing",
        }))
      }, 2500)
    } else if (phase === "reviewing") {
      // Simulate review completion
      setTimeout(() => {
        const feedbackData = SAMPLE_FEEDBACK[Math.min(iteration - 1, SAMPLE_FEEDBACK.length - 1)]
        const isApproved = feedbackData.score >= 90

        setState((prev) => ({
          ...prev,
          feedback: feedbackData.feedback,
          score: feedbackData.score,
          phase: isApproved ? "approved" : "revising",
        }))
      }, 2000)
    } else if (phase === "revising") {
      // Move to next iteration
      setTimeout(() => {
        if (iteration < maxIterations) {
          setState((prev) => ({
            ...prev,
            iteration: prev.iteration + 1,
            phase: "writing",
            feedback: prev.feedback, // Keep feedback visible during revision
          }))
        }
      }, 1500)
    }
  }, [state])

  useEffect(() => {
    if (state.phase !== "approved") {
      simulatePhase()
    }
  }, [state.phase, state.iteration, simulatePhase])

  const isApproved = state.phase === "approved"

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate max-w-md">{topic}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-lg border border-border">
            <span className="text-sm font-mono text-muted-foreground">Iteration</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: state.maxIterations }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${i < state.iteration ? (isApproved ? "bg-success" : "bg-primary") : "bg-border"}
                    ${i === state.iteration - 1 && !isApproved ? "scale-125" : ""}
                  `}
                />
              ))}
            </div>
            <span className="text-sm font-mono font-medium text-foreground">
              {state.iteration}/{state.maxIterations}
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={onReset} className="gap-2 font-mono bg-transparent">
            <RotateCcw className="w-4 h-4" />
            New Topic
          </Button>
        </div>
      </header>

      {/* Main content - dual panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-px bg-border">
        <WriterPanel article={state.article} phase={state.phase} isApproved={isApproved} />
        <ReviewerPanel feedback={state.feedback} score={state.score} phase={state.phase} isApproved={isApproved} />
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
  )
}
