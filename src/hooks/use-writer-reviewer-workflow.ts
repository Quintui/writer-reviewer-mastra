import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { WriteReviewWorkflowUIMessage } from "../types/workflow";
import { useMemo } from "react";

export const useWriterReviewerWorkflow = () => {
  const { messages, sendMessage, status } =
    useChat<WriteReviewWorkflowUIMessage>({
      transport: new DefaultChatTransport({
        api: "/api/write-review",
        prepareSendMessagesRequest: async ({ messages }) => {
          const lastMessage = messages[messages.length - 1];

          const topic =
            lastMessage.parts.find((p) => p.type === "text")?.text || "";

          return {
            body: {
              topic,
            },
          };
        },
      }),
    });

  const workflow = useMemo(() => {
    const lastAssistantMessage = messages.find(
      (item) => item.role === "assistant",
    );

    if (!lastAssistantMessage) {
      return null;
    }

    return lastAssistantMessage;
  }, [messages]);

  const send = (articleTopic: string) => {
    sendMessage({
      text: articleTopic,
    });
  };

  return {
    send,
    workflow,
    status,
  };
};
