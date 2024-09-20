"use client";
import React, { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Textarea } from "@/components/ui/textarea";
import { Code, Highlighter, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { convertToUpperCase } from "@/lib/utils";
import { useQueryContext } from "@/app/(admin)/dashboard/projects/_components/queryProvider";

export default function DatabaseEditor() {
  const { query, setQuery, handleQueryRun } = useQueryContext();

  const { theme } = useTheme();

  const [highlightedCode, setHighlightedCode] = useState<string>(query);
  const [isEditor, setIsEditor] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const transformedInput = convertToUpperCase(input);
    setQuery(transformedInput);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = cursorPosition;
        textareaRef.current.selectionEnd = cursorPosition;
      }
    }, 0);
  }

  useEffect(() => {
    setHighlightedCode(query);
  }, [query]);

  return (
    <div className="w-full relative rounded-xl h-60">
      {isEditor ? (
        <div className="relative w-full h-full rounded-xl">
          <div className="absolute right-4 top-4">
            {isEditor && query.length !== 0 && (
              <div className="flex gap-2">
                <Highlighter onClick={() => setIsEditor(false)} />
                <Play onClick={() => handleQueryRun()} />
              </div>
            )}
          </div>
          <Textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            className="w-full h-full resize-none pt-3 text-[16px] no-scrollbar"
            placeholder="Write your SQL query here..."
          />
        </div>
      ) : (
        <div className="relative w-full h-full rounded-xl">
          <div className="absolute right-4 top-4 flex gap-2 z-10">
            {!isEditor && <Code onClick={() => setIsEditor(true)} />}
            <Play onClick={() => handleQueryRun()} />
          </div>
          <div className="w-full h-full border rounded-md overflow-hidden py-2">
            <SyntaxHighlighter
              language="sql"
              style={theme === "dark" ? oneDark : oneLight}
              showLineNumbers={true}
              customStyle={{
                paddingTop: 0,
                whiteSpace: "pre-wrap",
                backgroundColor: "transparent",
                height: "100%",
                width: "100%",
                overflow: "auto",
                scrollbarWidth: "none",
                borderRadius: "10px",
                boxSizing: "border-box",
              }}
              codeTagProps={{
                style: {
                  fontSize: "16px",
                  fontFamily: "monospace",
                },
              }}
              className="custom-syntax-highlighter"
            >
              {highlightedCode}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}