import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { messages } from "~/server/db/schema";

export const openAIRouter = createTRPCRouter({
  getMessages: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.messages.findMany({
      where: ({ userId }, { eq }) => eq(userId, ctx.session.user.id),
      orderBy: ({ createdAt }, { asc }) => asc(createdAt),
    });
  }),

  sendChatMessage: protectedProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
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
        });

        return await ctx.db
          .insert(messages)
          .values({
            userId: ctx.session.user.id,
            message: llmResponse.choices[0]?.message.content ?? "",
            type: "llm-response",
            status: "success",
          })
          .returning();
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
