import { UIMessage } from "ai";

type StreamingStatus = "streaming" | "completed";

export type WriterEventData = {
  iterationCount: number;
  status: StreamingStatus;
  article: string;
};

export type ReviewerEventData = {
  status: StreamingStatus;
  approved?: boolean;
  iterationCount: number;
  feedback?: string;
};

export type WriteReviewWorkflowUIMessage = UIMessage<
  unknown,
  {
    "writer-article": WriterEventData;
    "reviewer-feedback": ReviewerEventData;
  }
>;
