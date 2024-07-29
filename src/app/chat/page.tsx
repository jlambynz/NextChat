import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { UserInput } from "./_components/user-input";
import { type ChatMessage, Messages } from "./_components/message";

export default async function Chat() {
  return (
    <>
      <div className="flex flex-1 flex-col overflow-auto">
        <MaxWidthContainer className="flex flex-1 flex-col">
          <Messages messages={MOCK_MESSAGES} />
        </MaxWidthContainer>
      </div>

      <MaxWidthContainer>
        <UserInput />
      </MaxWidthContainer>
    </>
  );
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    type: "user-sent",
    id: "1",
    message: "Hi",
  },
  {
    type: "llm-response",
    id: "2",
    message: "Hello! How can I help you today?",
  },
  {
    type: "user-sent",
    id: "3",
    message: "Can you tell me more about your services?",
  },
  {
    type: "llm-response",
    id: "4",
    message:
      "Sure! We offer a wide range of services including web development, mobile app development, and AI integration.",
  },
  {
    type: "user-sent",
    id: "5",
    message: "What technologies do you specialize in?",
  },
  {
    type: "llm-response",
    id: "6",
    message:
      "We specialize in technologies such as React, Next.js, Node.js, Python, and more.",
  },
  {
    type: "user-sent",
    id: "7",
    message:
      "That sounds great! Can you provide an example of a recent project?",
  },
  {
    type: "llm-response",
    id: "8",
    message:
      "Of course! Recently, we developed a Progressive Web Application (PWA) with advanced notification handling and seamless offline functionality for a retail client, significantly enhancing their customer engagement.",
  },
  {
    type: "user-sent",
    id: "9",
    message:
      "I am interested in integrating AI into my current application. What kind of AI services do you offer?",
  },
  {
    type: "llm-response",
    id: "10",
    message:
      "We offer AI services including natural language processing, machine learning model development, and AI-driven analytics. Our team can help integrate AI capabilities into your existing applications to enhance functionality and provide valuable insights.",
  },
];
