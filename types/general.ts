import { z } from "zod";
import { SUPPORTER_MODELS } from "../models/constants";
import { Conversation } from "@prisma/client";

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
  USER = "user",
  ASSISTANT = "assistant",
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

export type Message = {
  role: ROLE,
  content: string,
}
export interface ExecutionType {
  id?: string;
  title?: string;
}

export type Messages = Message[];

export interface Messagefields {
  id: string;
  conversationId?: string;
  role: ROLE;
  content: string;
  timestamp: Date;
}
export interface conversationsProp {
  id: string,
  createdAt: string,
  messages: Messagefields[]
}

export interface ChatStoreProps {
  conversationId: string,
  message: Messagefields[]
  conversations: conversationsProp[]
  isLoading: boolean

  setConversationId: (id: string) => void
  setMessages: (messages: Messagefields[]) => void
  setConversations: (Conversation: conversationsProp[]) => void
  loadingConversations: (id: string) => Promise<void>
}