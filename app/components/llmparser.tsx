"use client";

import React, { Children, createElement, Fragment, useMemo } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

const CodeBlock = ({ children, language }: any) => {
  const code =
    typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.join("")
      : children?.[0] || "";

  return (
    <div>
      <pre className="bg-black text-gray-400 p-3 rounded-md overflow-auto text-sm">
        <code className={language ? "language-${language}" : ""}>{code}</code>
      </pre>
    </div>
  );
};


const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeReact, {
    createElement: React.createElement,
    Fragment,
    components: {
      pre: CodeBlock, // 🔥 Override fenced code blocks
    },
  });


const handleCopy = ()=> {

  return (
    <div className="relative group my-3">
      <pre className="bg-[#0a0a0a] text-green-400 p-3 rounded-md overflow-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-gray-700 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded"
      >
        Copy
      </button>
    </div>
  );
};





export default function LLMResponseParser({ content }: Props) {
  const sanitizedContent = content?.replace(/\u0000/g, "") ?? "";

  const compiled = useMemo(() => {
    if (!sanitizedContent.trim()) return null;

    try {
      const result = processor.processSync(sanitizedContent).result;
      return result;
    } catch (err) {
      console.error("Markdown compile error:", err);

      // 🛡 Safety fallback: never crash UI
      return (
        <pre className="whitespace-pre-wrap bg-red-950/30 border border-red-600/40 text-red-300 p-2 rounded">
          {sanitizedContent}
        </pre>
      );
    }
  }, [sanitizedContent]);

  return <div className="prose prose-invert max-w-none">{compiled}</div>;
}
