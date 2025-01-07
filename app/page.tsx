"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { Copy, Pencil, Check } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@/types";

interface MessageProps {
  message: Message;
  onEdit?: (id: string, content: string) => void;
}

export function MessageComponent({ message, onEdit }: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(message.id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex items-start gap-4 px-8 py-3 hover:bg-[#2A2A2A] relative ${
        message.role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === "assistant" ? "bg-black" : "bg-white"
        }`}
      />
      <div
        className={`flex-1 min-w-0 px-4 ${
          message.role === "user" ? "text-right" : ""
        }`}
      >
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-[#2f2f2f] border-none text-white px-3 py-1 rounded focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
        ) : (
          <Markdown
          className="whitespace-pre-wrap"
          remarkPlugins={[remarkGfm]}
          >
          {message.content}
          </Markdown>
        )}
      </div>
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute ${
          message.role === "user" ? "left-8" : "right-8"
        }`}
      >
        {message.role === "assistant" ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:bg-[#2f2f2f]"
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied!" : "Copy message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:bg-[#2f2f2f]"
                  onClick={handleEdit}
                >
                  {isEditing ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isEditing ? "Save edit" : "Edit message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsConversationStarted(true);

    try {
      const response = await fetch("/api/testFetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: message.trim(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      let aiResponseContent = "";

      while (true) {
        const { done, value } = (await reader?.read()) || {};
        if (done) break;

        // Convert the stream to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content") {
                aiResponseContent += parsed.content;
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage.role === "assistant") {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: aiResponseContent },
                    ];
                  } else {
                    return [
                      ...prev,
                      {
                        id: (Date.now() + 1).toString(),
                        content: aiResponseContent,
                        role: "assistant",
                        timestamp: Date.now(),
                      },
                    ];
                  }
                });
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handleEditMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content: newContent } : msg))
    );
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
      {!isConversationStarted ? (
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl mb-8"
          >
            What can I help with?
          </motion.h1>

          <div className="w-full max-w-2xl relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && message.trim()) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full bg-[#2f2f2f] border-none text-white px-4 py-6 rounded-lg pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Message ChatGPT"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    disabled={!message.trim()}
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white/50 bg-transparent hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendHorizontal className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                {!message.trim() && (
                  <TooltipContent>
                    <p>Please enter a message</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          <footer className="p-4 text-center text-sm text-gray-400">
            <p>
              By messaging GPT, you do not agree to our{" "}
              <Link href="#" className="underline hover:text-white">
                Terms
              </Link>{" "}
              and have read our{" "}
              <Link href="#" className="underline hover:text-white">
                Privacy Policy
              </Link>
            </p>
          </footer>
        </main>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg) => (
                <MessageComponent
                  key={msg.id}
                  message={msg}
                  onEdit={handleEditMessage}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="">
            <div className="max-w-3xl mx-auto p-4">
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full bg-[#2f2f2f] border-none text-white px-4 py-6 rounded-lg pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Message ChatGPT"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        disabled={!message.trim()}
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white/50 bg-transparent hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SendHorizontal className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    {!message.trim() && (
                      <TooltipContent>
                        <p>Please enter a message</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                GPT can make mistakes. It is not a bug, it is a feature.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
