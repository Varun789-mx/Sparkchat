import { useMemo } from "react";

export const useMarkdown = () => {
  const preprocessMarkdown = (text: string) => {
    return text;
  };

  const markDownComponent = useMemo(
    () => ({
      p: ({ children }: any) => (
        <p className="mb-3 text-foreground">{children}</p>
      ),
      h1: ({ children }: any) => (
        <h1 className="text-6xl mt-6 mb-3 font-bold text-foreground">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl  font-semibold mt-5 mb-2 text-foreground">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">
          {children}
        </h3>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-3 italic opacity-80">
        {children}
        </blockquote>
      ),
    }),
    []
  );
  return {
    preprocessMarkdown,
    markDownComponent,
  };
};
