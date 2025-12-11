"use client";

import { useState } from "react";
import { useWriterReviewerWorkflow } from "../hooks/use-writer-reviewer-workflow";
import { LandingScreen } from "@/components/landing-screen";
import { ProcessingScreen } from "@/components/processing-screen";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { send, workflow, status } = useWriterReviewerWorkflow();

  const handleStartWriting = (inputTopic: string) => {
    setTopic(inputTopic);
    setIsProcessing(true);
    send(inputTopic);
  };

  const handleReset = () => {
    setTopic("");
    setIsProcessing(false);
  };

  return (
    <main className="min-h-screen noise-bg">
      {!isProcessing ? (
        <LandingScreen onStart={handleStartWriting} />
      ) : (
        <ProcessingScreen
          topic={topic}
          onReset={handleReset}
          workflow={workflow}
          status={status}
        />
      )}
    </main>
  );
}
