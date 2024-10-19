"use client";
import React, { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { cn, convertToUpperCase } from "@/lib/utils";
import useDatabaseStore from "@/stores/databaseStore";
import { useToast } from "@/hooks/use-toast";
import { runQuery } from "@/actions/database/query.action";
import { Code, Highlighter, Loader, Play } from "lucide-react";

export default function DatabaseEditor() {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditor, setIsEditor] = useState<boolean>(true);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const { toast } = useToast();

  const {
    query,
    connectionStatus,
    connectionLoading,
    setQuery,
    setTerminalError,
    setTerminalResult,
    project,
    history,
    setHistory,
  } = useDatabaseStore();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleQueryRun = async () => {
    setIsLoading(true);
    const response = await runQuery(project?.id || "", query);
    if (response.success) {
      if (response.data.isQuerySuccessful) {
        setTerminalResult(response.data.oldQuery || "");
        setTerminalError("");
        const newHistory = response.data.history;
        if (newHistory.success) setHistory([newHistory.data, ...history]);
      } else {
        console.log(response);
        setTerminalError(response.data.oldQuery || "");
        setTerminalResult("");
        const newHistory = response.data.history;
        if (newHistory.success) setHistory([newHistory.data, ...history]);
      }
    } else if ("error" in response) {
      toast({
        variant: "destructive",
        title: response.error,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setHighlightedCode(query);
  }, [query, setHighlightedCode]);

  return (
    <div className="w-full relative flex gap-2 rounded-xl flex-grow h-full  ">
      {isEditor ? (
        <div className="relative overflow-auto flex-grow h-full rounded-xl no-scrollbar">
          <Textarea
            disabled={connectionLoading || !connectionStatus}
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            className="w-full h-full  whitespace-nowrap resize-none pt-3 text-[16px] no-scrollbar  focus-visible:ring-0  focus:border-violet-600"
            placeholder="Write your SQL query here..."
          />
        </div>
      ) : (
        <div className="relative overflow-auto no-scrollbar flex flex-grow h-full rounded-xl border hover:border-violet-600  py-2">
          <SyntaxHighlighter
            language="sql"
            style={theme === "dark" ? oneDark : oneLight}
            showLineNumbers={true}
            customStyle={{
              paddingTop: 0,
              whiteSpace: "wrap",
              backgroundColor: "transparent",
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
            className="custom-syntax-highlighter flex "
          >
            {highlightedCode}
          </SyntaxHighlighter>
        </div>
      )}
      <EditorActions
        isEditor={isEditor}
        setIsEditor={setIsEditor}
        isLoading={isLoading}
        handleQueryRun={handleQueryRun}
        query={query}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}

function EditorActions({
  isEditor,
  setIsEditor,
  isLoading,
  handleQueryRun,
  query,
  connectionStatus,
}: {
  isEditor: boolean;
  setIsEditor: (con: boolean) => void;
  isLoading: boolean;
  handleQueryRun: () => void;
  query: string;
  connectionStatus: boolean;
}) {
  return (
    <div
      className={` border  gap-2 z-10 p-2 flex-shrink    rounded-sm ${cn(connectionStatus && query.length !== 0 ? "block" : " hidden")} `}
    >
      <div className={"flex flex-col gap-2"}>
        {isLoading ? (
          <Loader className={"animate-spin"} />
        ) : (
          <Play onClick={handleQueryRun} />
        )}
        {isEditor ? (
          <Highlighter onClick={() => setIsEditor(false)} />
        ) : (
          <Code onClick={() => setIsEditor(true)} />
        )}
      </div>
    </div>
  );
}
