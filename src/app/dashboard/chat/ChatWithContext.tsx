"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWithContextComponent() {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatWithContext = useAction(api.embeddings.chatWithContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    const newUserMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuery("");

    try {
      const result = await chatWithContext({ query });
      const newAssistantMessage: Message = {
        role: "assistant",
        content: result,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl h-[calc(100vh-2rem-72px)] flex flex-col">
      <Card className="flex-grow flex flex-col overflow-hidden">
        <CardContent className="flex-grow flex flex-col p-6 overflow-hidden">
          <h1 className="text-3xl font-bold mb-6">
            Chat with Warehouse Manager AI
          </h1>
          <div className="flex-grow overflow-y-auto mb-4 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose dark:prose-invert max-w-none"
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {error && (
            <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
