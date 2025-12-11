import { mastra } from "@/src/mastra";
import { toAISdkFormat } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";

export const POST = async (request: Request) => {
  const { topic } = await request.json();
  const workflow = mastra.getWorkflow("loopWriterReviewerWorkflow");

  const run = await workflow.createRunAsync();

  const stream = run.stream({
    inputData: {
      topic,
    },
  });

  return createUIMessageStreamResponse({
    stream: toAISdkFormat(stream, {
      from: "workflow",
    }),
  });
};
