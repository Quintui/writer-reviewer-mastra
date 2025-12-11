"use client"

import { useState } from "react"
import { LandingScreen } from "@/components/landing-screen"
import { ProcessingScreen } from "@/components/processing-screen"

export default function Home() {
  const [topic, setTopic] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStartWriting = (inputTopic: string) => {
    setTopic(inputTopic)
    setIsProcessing(true)
  }

  const handleReset = () => {
    setTopic("")
    setIsProcessing(false)
  }

  return (
    <main className="min-h-screen noise-bg">
      {!isProcessing ? (
        <LandingScreen onStart={handleStartWriting} />
      ) : (
        <ProcessingScreen topic={topic} onReset={handleReset} />
      )}
    </main>
  )
}
