import { mastra } from "@/mastra";
import { toAISdkFormat } from "@mastra/ai-sdk";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  UIMessageChunk,
} from "ai";

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
