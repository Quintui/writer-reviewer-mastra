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

  const modifiedStream = createUIMessageStream({
    execute: async ({ writer }) => {
      for await (const chunk of toAISdkFormat(
        stream.fullStream.pipeThrough(transformer),
        {},
      )) {
        console.log("aiv5", chunk.type);
        writer.write(chunk as UIMessageChunk);
      }
    },
  });

  return createUIMessageStreamResponse({
    stream: modifiedStream,
  });
};
