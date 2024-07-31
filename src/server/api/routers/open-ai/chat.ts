import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { messages } from "~/server/db/schema";
import type { ChatMessage, ChatMessageStatus, ChatMessageType } from "./types";

export const openAIChatRouter = createTRPCRouter({
  getMessages: protectedProcedure.query(async ({ ctx }) => {
    const chatMessages = await ctx.db.query.messages.findMany({
      where: ({ userId }, { eq }) => eq(userId, ctx.session.user.id),
      orderBy: ({ createdAt }, { asc }) => asc(createdAt),
    });

    return chatMessages.map<ChatMessage>((m) => ({
      id: m.id,
      // Drizzle doesn't support strict typing on columns. Cast to avoid handling throughout the app
      type: m.type as ChatMessageType,
      status: m.status as ChatMessageStatus,
      message: m.message,
    }));
  }),

  sendChatMessage: protectedProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async function* ({ ctx, input }) {
      await ctx.db.insert(messages).values({
        userId: ctx.session.user.id,
        message: input.message,
        type: "user-sent",
        status: "success",
      });

      const fullConversation = await ctx.db.query.messages.findMany({
        where: ({ userId, status }, { eq, and, notLike }) =>
          and(eq(userId, ctx.session.user.id), notLike(status, "failed")),
        orderBy: ({ createdAt }, { asc }) => asc(createdAt),
      });

      try {
        const llmResponse = await ctx.openai.chat.completions.create({
          // TODO: would be nice to make this a configurable setting in the UI
          model: "gpt-3.5-turbo",
          messages: fullConversation.map((c) => ({
            role: c.type === "user-sent" ? "user" : "assistant",
            content: c.message,
          })),
          max_tokens: 4096,
          stream: true,
        });

        let fullResponse = "";
        for await (const part of llmResponse) {
          const partContent = part.choices[0]?.delta.content ?? "";
          fullResponse += partContent;
          yield partContent;
        }

        await ctx.db.insert(messages).values({
          userId: ctx.session.user.id,
          message: fullResponse,
          type: "llm-response",
          status: "success",
        });
      } catch (error) {
        await ctx.db.insert(messages).values({
          userId: ctx.session.user.id,
          message:
            error instanceof Error
              ? error.message
              : "Unexpected error retrieving LLM reponse",
          type: "llm-response",
          status: "failed",
        });

        throw error;
      }
    }),
});
