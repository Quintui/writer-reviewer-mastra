import { Mastra } from "@mastra/core/mastra";
import { writerAgent } from "./agents/writer-agent";
import { reviewerAgent } from "./agents/reviewer-agent";
import { writerReviewerWorkflow } from "./workflows/writer-reviewer-workflow";
import { loopWriterReviewerWorkflow } from "./workflows/loop-writer-reviewer-workflow";
export const mastra = new Mastra({
  agents: { writerAgent, reviewerAgent },
  workflows: {
    writerReviewerWorkflow,
    loopWriterReviewerWorkflow,
  },
});
