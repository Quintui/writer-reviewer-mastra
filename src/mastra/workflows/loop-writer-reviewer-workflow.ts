import { createWorkflow } from "@mastra/core";
import {
  loopArticleSchema,
  writerReviewerWorkflow,
} from "./writer-reviewer-workflow";

export const loopWriterReviewerWorkflow = createWorkflow({
  id: "loop-writer-reviewer-workflow",
  inputSchema: loopArticleSchema,
  outputSchema: loopArticleSchema,
})
  .dountil(writerReviewerWorkflow, async ({ inputData, iterationCount }) => {
    if (inputData.approved) {
      return true;
    }

    if (iterationCount >= 10) {
      return true;
    }

    return false;
  })
  .commit();
