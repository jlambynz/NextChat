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

      let llmReponseMessage = "";
      try {
        const response = await ctx.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: input.message }],
        });

        llmReponseMessage = response.choices[0]?.message.content ?? "";
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unexpected error retrieving LLM reponse";

        await ctx.db.insert(messages).values({
          userId: ctx.session.user.id,
          message: errorMessage,
          type: "llm-response",
          status: "failed",
        });

        throw error;
      }

      const res = await ctx.db
        .insert(messages)
        .values({
          userId: ctx.session.user.id,
          message: llmReponseMessage,
          type: "llm-response",
          status: "success",
        })
        .returning();

      return res;
    }),
});
