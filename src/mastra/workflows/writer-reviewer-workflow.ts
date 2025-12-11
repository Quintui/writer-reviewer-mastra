import { ReviewerEventData, WriterEventData } from "@/src/types/workflow";
import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";

export const loopArticleSchema = z.object({
  topic: z.string(),
  iterationCount: z.number().default(0),
  currentArticle: z.string().optional(),
  previousFeedback: z.string().optional(),
  approved: z.boolean().default(false),
});

const writerStep = createStep({
  id: "writer-step",
  inputSchema: loopArticleSchema,
  outputSchema: loopArticleSchema,
  execute: async ({ inputData, mastra, writer }) => {
    const {
      topic,
      approved,
      currentArticle,
      previousFeedback,
      iterationCount,
    } = inputData;

    const currentIterationCount = iterationCount + 1;

    const writerAgent = mastra.getAgent("writerAgent");

    const response = await writerAgent.stream(
      `Please write an article about: ${topic}

      ${
        previousFeedback &&
        currentArticle &&
        `
      <original_article>
        ${currentArticle}
      </original_article>
      <previous_feedback>
          ${previousFeedback}
      </previous_feedback>

      `
      }

      `,
    );

    let articleContent = "";

    for await (const chunk of response.textStream) {
      articleContent += chunk;
      writer.write({
        id: `writer-article-${currentIterationCount}`,
        type: "data-writer-article",
        data: {
          status: "streaming",
          article: articleContent,
          iterationCount: currentIterationCount,
        } satisfies WriterEventData,
      });
    }

    writer.write({
      id: `writer-article-${currentIterationCount}`,
      type: "data-writer-article",
      data: {
        status: "completed",
        article: articleContent,
        iterationCount: currentIterationCount,
      } satisfies WriterEventData,
    });

    const responseFinal = await response.text;

    return {
      approved,
      topic,
      currentArticle: responseFinal,
      previousFeedback,
      iterationCount: currentIterationCount,
    };
  },
});

const reviewerStep = createStep({
  id: "reviewer-step",
  inputSchema: loopArticleSchema,
  outputSchema: loopArticleSchema,
  execute: async ({ inputData, mastra, writer }) => {
    const { topic, currentArticle, previousFeedback } = inputData;

    const reviewerAgent = mastra.getAgent("reviewerAgent");

    const response = await reviewerAgent.stream(
      `Please review the following article on the topic "${topic}":
      <article>
        ${currentArticle}
      </article>

      ${
        previousFeedback &&
        currentArticle &&
        `
      <previous_feedback>
        ${previousFeedback}
      </previous_feedback>

      `
      }

    `,
      {
        structuredOutput: {
          schema: z.object({
            approved: z
              .boolean()
              .describe("Whether the article is approved or not"),
            feedback: z.string().describe("Detailed feedback on the article"),
          }),
        },
      },
    );

    for await (const chunk of response.objectStream) {
      writer.write({
        id: `reviewer-feedback-${inputData.iterationCount}`,
        type: "data-reviewer-feedback",
        data: {
          status: "streaming",
          approved: chunk.approved,
          feedback: chunk.feedback,
          iterationCount: inputData.iterationCount,
        } satisfies ReviewerEventData,
      });
    }

    const finalObject = await response.object;

    writer.write({
      id: `reviewer-feedback-${inputData.iterationCount}`,
      type: "data-reviewer-feedback",
      data: {
        status: "completed",
        approved: finalObject.approved,
        feedback: finalObject.feedback,
        iterationCount: inputData.iterationCount,
      } satisfies ReviewerEventData,
    });

    return {
      topic,
      currentArticle: currentArticle,
      approved: finalObject.approved,
      previousFeedback: finalObject.feedback,
      iterationCount: inputData.iterationCount,
    };
  },
});

export const writerReviewerWorkflow = createWorkflow({
  id: "writer-reviewer-workflow",
  inputSchema: loopArticleSchema,
  outputSchema: loopArticleSchema,
})
  .then(writerStep)
  .then(reviewerStep)
  .commit();
