"use client";

import type React from "react";

import { useState } from "react";
import { Feather, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const EXAMPLE_TOPICS = [
  "The future of sustainable architecture",
  "How ancient philosophy shapes modern AI ethics",
  "The hidden psychology of color in branding",
];

interface LandingScreenProps {
  onStart: (topic: string) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [topic, setTopic] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart(topic.trim());
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Atmospheric background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[oklch(0.10_0.02_60)]" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        {/* Logo and title */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-primary/10 border border-primary/20">
            <Feather className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Inkwell
          </h1>
          <p className="text-xl text-muted-foreground font-mono text-balance">
            Where ideas become polished prose
          </p>
        </div>

        {/* Main input form */}
        <form
          onSubmit={handleSubmit}
          className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150"
        >
          <div
            className={`
              relative p-1 rounded-xl transition-all duration-300
              ${isFocused ? "glow-primary" : ""}
            `}
          >
            <div
              className={`
              relative bg-card rounded-lg border transition-colors duration-300
              ${isFocused ? "border-primary/50" : "border-border"}
            `}
            >
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What would you like to write about?"
                className="w-full min-h-[140px] p-5 bg-transparent text-foreground text-lg font-mono placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed"
                rows={4}
              />

              <div className="flex items-center justify-between p-4 pt-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-mono">AI-powered iteration</span>
                </div>

                <Button
                  type="submit"
                  disabled={!topic.trim()}
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 gap-2 transition-all duration-300"
                >
                  Begin Writing
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Example topics */}
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            Need inspiration? Try one of these:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_TOPICS.map((example, i) => (
              <button
                key={i}
                onClick={() => setTopic(example)}
                className="px-4 py-2 text-sm font-mono text-muted-foreground bg-secondary/50 hover:bg-secondary hover:text-foreground rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
