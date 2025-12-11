import { Agent } from "@mastra/core/agent";

export const writerAgent = new Agent({
  name: "Writer agent",
  instructions: `You are an expert article writer. Your task is to write high-quality, engaging articles on various topics`,
  model: "openrouter/google/gemini-2.5-flash",
});
