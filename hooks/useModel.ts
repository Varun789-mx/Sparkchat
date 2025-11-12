import { useState } from "react";
import { DEFAULT_MODEL_ID } from "@/models/constants";
interface userModelOptions {
  initialModel?: string;
  storageKey?: string;
  persistTolocalStorage?: boolean;
}

export function useModel({
  initialModel = DEFAULT_MODEL_ID,
  storageKey = "PREFERRED_MODEL",
  persistTolocalStorage = true,
}: userModelOptions) {
  const [modelId, setModelID] = useState<string>(() => {
    if (typeof window === "undefined" || !persistTolocalStorage) {
      return initialModel;
    }
    const storedModel = localStorage.getItem(storageKey);
    return storedModel ?? initialModel;
  });
}
