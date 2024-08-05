import { type Session } from "next-auth";
import type OpenAI from "openai";
import { type db } from "../db";

export type ProtectedCtx = {
  session: Session;
  headers: Headers;
  db: typeof db;
  openai: OpenAI;
};
