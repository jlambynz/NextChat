import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { chatSettings, messages } from "~/server/db/schema";
import { type ChatMessage, ChatMessageStatus, ChatMessageType } from "./types";
import { type ProtectedCtx } from "../../types";
import { eq } from "drizzle-orm";

export const openAIChatRouter = createTRPCRouter({
  getChatMessages: protectedProcedure.query(async ({ ctx }) =>
    getChatMessages(ctx),
  ),

  getChatModels: protectedProcedure.query(async ({ ctx }) =>
    getChatModels(ctx),
  ),

  getChatSettings: protectedProcedure.query(async ({ ctx }) =>
    getChatSettings(ctx),
  ),

  sendChatMessage: protectedProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async function* ({ ctx, input }) {
      await ctx.db.insert(messages).values({
        userId: ctx.session.user.id,
        message: input.message,
        type: ChatMessageType.UserSent,
        status: ChatMessageStatus.Success,
      });

      const [fullConversation, chatSettings] = await Promise.all([
        getChatMessages(ctx),
        getChatSettings(ctx),
      ]);

      try {
        const llmResponse = await ctx.openai.chat.completions.create({
          model: chatSettings.model,
          messages: fullConversation.map((c) => ({
            role: c.type === ChatMessageType.UserSent ? "user" : "assistant",
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
          type: ChatMessageType.LLMResponse,
          status: ChatMessageStatus.Success,
        });
      } catch (error) {
        await ctx.db.insert(messages).values({
          userId: ctx.session.user.id,
          message:
            error instanceof Error
              ? error.message
              : "Unexpected error retrieving LLM reponse",
          type: ChatMessageType.LLMResponse,
          status: ChatMessageStatus.Failed,
        });

        throw error;
      }
    }),

  updateChatSettings: protectedProcedure
    .input(z.object({ model: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      if (input.model) {
        await upsertChatModel(ctx, input.model);
      }
    }),

  clearChatHistory: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .delete(messages)
      .where(eq(messages.userId, ctx.session.user.id));
  }),
});

async function getChatMessages(ctx: ProtectedCtx) {
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
}

async function getChatModels(ctx: ProtectedCtx) {
  const { data: models } = await ctx.openai.models.list();
  return models
    .filter((model) => model.owned_by === "openai")
    .sort((m1, m2) => (m1.created < m2.created ? 1 : -1));
}

async function getChatSettings(ctx: ProtectedCtx) {
  const settings = await ctx.db.query.chatSettings.findFirst({
    where: ({ userId }, { eq }) => eq(userId, ctx.session.user.id),
  });

  const model = settings?.model ?? (await getChatModels(ctx))[0]?.id;
  if (!model) {
    throw new Error("No models available");
  }

  if (!settings?.model) {
    await upsertChatModel(ctx, model);
  }

  return {
    model,
    ...settings,
  };
}

async function upsertChatModel(ctx: ProtectedCtx, model: string) {
  await ctx.db
    .insert(chatSettings)
    .values({ userId: ctx.session.user.id, model })
    .onConflictDoUpdate({
      target: chatSettings.userId,
      set: { model },
    });
}
