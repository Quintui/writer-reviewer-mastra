"use client"

import { Eye, Loader2, Clock, CheckCircle2 } from "lucide-react"

interface ReviewerPanelProps {
  feedback: string
  score: number
  phase: "writing" | "reviewing" | "revising" | "approved"
  isApproved: boolean
}

export function ReviewerPanel({ feedback, score, phase, isApproved }: ReviewerPanelProps) {
  const getStatusInfo = () => {
    switch (phase) {
      case "writing":
        return { icon: Clock, text: "Waiting for draft", animate: false }
      case "reviewing":
        return { icon: Loader2, text: "Reviewing...", animate: true }
      case "revising":
        return { icon: Eye, text: "Feedback delivered", animate: false }
      case "approved":
        return { icon: CheckCircle2, text: "Approved", animate: false }
      default:
        return { icon: Eye, text: "Ready", animate: false }
    }
  }

  const status = getStatusInfo()
  const StatusIcon = status.icon

  const getScoreColor = () => {
    if (score >= 90) return "text-success"
    if (score >= 70) return "text-primary"
    return "text-muted-foreground"
  }

  const getScoreBg = () => {
    if (score >= 90) return "bg-success/20 border-success/30"
    if (score >= 70) return "bg-primary/20 border-primary/30"
    return "bg-muted/50 border-border"
  }

  return (
    <div
      className={`
      relative flex flex-col h-full min-h-[calc(100vh-73px)]
      transition-colors duration-500
      ${isApproved ? "bg-[oklch(0.14_0.015_145)]" : "bg-reviewer"}
    `}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            ${isApproved ? "bg-success/20" : "bg-reviewer-accent/20"}
          `}
          >
            <Eye className={`w-4 h-4 ${isApproved ? "text-success" : "text-reviewer-accent"}`} />
          </div>
          <span className="font-semibold text-reviewer-foreground">AI Reviewer</span>
        </div>

        <div className="flex items-center gap-3">
          {score > 0 && (
            <div
              className={`
              px-3 py-1.5 rounded-full text-sm font-mono font-semibold border
              ${getScoreBg()} ${getScoreColor()}
            `}
            >
              {score}/100
            </div>
          )}

          <div
            className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono
            ${isApproved ? "bg-success/20 text-success" : "bg-reviewer-accent/20 text-reviewer-accent"}
          `}
          >
            <StatusIcon className={`w-3.5 h-3.5 ${status.animate ? "animate-spin" : ""}`} />
            <span>{status.text}</span>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        {feedback ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            {feedback.split("\n\n").map((section, i) => (
              <div key={i} className="text-reviewer-foreground/90 leading-relaxed font-mono text-sm">
                {section.split("\n").map((line, j) => {
                  const isBullet = line.startsWith("•")
                  return (
                    <p key={j} className={`${isBullet ? "pl-4 text-muted-foreground" : ""} ${j > 0 ? "mt-2" : ""}`}>
                      {line}
                    </p>
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
              {phase === "writing" ? (
                <span>Awaiting content to review...</span>
              ) : (
                <>
                  <span>Analyzing draft</span>
                  <span className="cursor-blink text-reviewer-accent">|</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approval badge */}
      {isApproved && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
          <CheckCircle2 className="w-48 h-48 text-success" />
        </div>
      )}

      {/* Subtle gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-reviewer to-transparent pointer-events-none" />
    </div>
  )
}
