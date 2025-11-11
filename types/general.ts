import { z } from "zod";
import { SUPPORTER_MODELS } from "../models/constants";

export interface Model {
  id: string;
  name?: string;
  provider?: ModelProvider;
  description?: string;
  maxTokens?: number;
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
  createdAt: Date
  updatedAt: Date
  role: ROLE,
  content: string
}

export enum ModelProvider {
  GOOGLE = "google",
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  OPENROUTER = "openrouter",
}

export enum ModelCapability {
  TEXT = "text",
  VISION = "vision",
  CODE = "code",
  FUNCTION_CALLING = "function_calling",
}
export type MODEL = typeof SUPPORTER_MODELS[number];




export type Message = {
  role: ROLE,
  content: string,
}

export type Messages = Message[];