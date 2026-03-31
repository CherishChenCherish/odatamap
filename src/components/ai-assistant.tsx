"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const transport = new DefaultChatTransport({ api: "/api/chat" });

interface AIAssistantProps {
  initialContext?: string;
}

export function AIAssistant({ initialContext }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, status, sendMessage } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  const quickQuestions = [
    "哪些研究方向是蓝海领域？",
    "AI与生物交叉有什么机会？",
    "如何评估一个研究方向的前景？",
    "量子计算目前的瓶颈是什么？",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow flex items-center justify-center"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[520px] rounded-xl border border-border/50 bg-card/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div>
            <span className="text-sm font-medium">研究助手</span>
            <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">
              DeepSeek
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-7 w-7 p-0 text-muted-foreground"
        >
          ✕
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                我是你的AI研究助手，可以帮你分析研究方向、解读竞争格局、发现交叉领域机会。
              </p>
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">试试问我：</p>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      sendMessage({ text: q });
                    }}
                    className="block w-full text-left text-xs px-3 py-2 rounded-md border border-border/50 hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.parts
                    ?.filter((p) => p.type === "text")
                    .map((p) => p.text)
                    .join("") || ""}
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm">
                <span className="animate-pulse">思考中...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (!inputValue.trim() || isLoading) return;
          sendMessage({ text: inputValue });
          setInputValue("");
        }}
        className="shrink-0 p-3 border-t border-border/50"
      >
        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="问我任何科研问题..."
            disabled={isLoading}
            className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !inputValue.trim()}
            className="shrink-0"
          >
            发送
          </Button>
        </div>
      </form>
    </div>
  );
}
