"use client"

import { PenLine, Loader2, RefreshCw, CheckCircle2 } from "lucide-react"

interface WriterPanelProps {
  article: string
  phase: "writing" | "reviewing" | "revising" | "approved"
  isApproved: boolean
}

export function WriterPanel({ article, phase, isApproved }: WriterPanelProps) {
  const getStatusInfo = () => {
    switch (phase) {
      case "writing":
        return { icon: Loader2, text: "Writing...", animate: true }
      case "reviewing":
        return { icon: PenLine, text: "Awaiting review", animate: false }
      case "revising":
        return { icon: RefreshCw, text: "Revising...", animate: true }
      case "approved":
        return { icon: CheckCircle2, text: "Complete", animate: false }
      default:
        return { icon: PenLine, text: "Ready", animate: false }
    }
  }

  const status = getStatusInfo()
  const StatusIcon = status.icon

  return (
    <div
      className={`
      relative flex flex-col h-full min-h-[calc(100vh-73px)]
      transition-colors duration-500
      ${isApproved ? "bg-[oklch(0.14_0.015_145)]" : "bg-writer"}
    `}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            ${isApproved ? "bg-success/20" : "bg-writer-accent/20"}
          `}
          >
            <PenLine className={`w-4 h-4 ${isApproved ? "text-success" : "text-writer-accent"}`} />
          </div>
          <span className="font-semibold text-writer-foreground">AI Writer</span>
        </div>

        <div
          className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono
          ${isApproved ? "bg-success/20 text-success" : "bg-writer-accent/20 text-writer-accent"}
        `}
        >
          <StatusIcon className={`w-3.5 h-3.5 ${status.animate ? "animate-spin" : ""}`} />
          <span>{status.text}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        {article ? (
          <article className="prose prose-invert prose-lg max-w-none animate-in fade-in duration-500">
            {article.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-writer-foreground/90 leading-relaxed font-mono text-base"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </article>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-muted-foreground font-mono">
              <span>Composing initial draft</span>
              <span className="cursor-blink text-primary">|</span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-writer to-transparent pointer-events-none" />
    </div>
  )
}
