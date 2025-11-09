import { z } from "zod";
import { MODELS } from "./constants";

export interface Model {
  id: string;
  name?: string;
  provider?: ModelProvider;
  description?: string;
  maxTokens?: Number;
  pricePer1kTokens?: number;
  capabilities: ModelCapability[];
  isAvailable?: boolean;
  isPremium?: boolean;
}

export enum ROLE {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

export interface ChatSchema {
  id: string
  conversationId: string
  createdAt: Date
  updatedAt: Date
  role: ROLE,
  content: string
}

export enum ModelProvider {
  GOOGLE = "google",
  OPENAI = "openai",
  ANTHROPIC = "anthropics",
  OPENROUTER = "openrouter",
}

export enum ModelCapability {
  TEXT = "text",
  VISION = "VISION",
  CODE = "code",
  FUNCTION_CALLING = "function_calling",
}

export const SUPPORTER_MODELS = MODELS.map(model => model.id)
export type MODEL = typeof SUPPORTER_MODELS[number];

export const CreateChatSchema = z.object({
  conversationId: z.uuid().optional(),
  message: z.string().max(1000),
  model: z.enum(SUPPORTER_MODELS)
})

export type Message = {
  role: ROLE,
  content: string,
}

export type Messages = Message[];