export interface Model {
  id?: string;
  name?: string;
  provider?: ModelProvider;
  description?: string;
  maxTokens?: Number;
  pricePer1kTokens?: number;
  capabilities: ModelCapability[];
  isAvailable?: boolean;
  isPremium?: boolean;
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
