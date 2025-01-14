"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CraftEditor, JSONContent } from "@sergeysova/craft";
import {
  SendHorizontal,
  Trash2,
  Copy,
  Pencil,
  Check,
  FolderSyncIcon as Sync,
  Layout, // New import
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquare, Eye, FileText, HelpCircle } from 'lucide-react';

interface MessageProps {
  message: Message;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

function MessageComponent({
  message,
  onEdit,
  onDelete,
  onRegenerate,
}: MessageProps) {
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
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
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
          <Markdown remarkPlugins={[remarkGfm]} className="markdown-body">
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
          <>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:bg-[#2f2f2f]"
                    onClick={() => onRegenerate?.(message.id)}
                  >
                    <Sync className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Regenerate response</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:bg-[#2f2f2f]"
                    onClick={() => onDelete?.(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatInterface() {
  const [content, setContent] = useState<JSONContent>({})
  const [message, setMessage] = useState("");
  const [commandFilter, setCommandFilter] = useState("");
  const [splitView, setSplitView] = useState(false); // New state
  const [editorWidth, setEditorWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      let newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth < 25) newWidth = 25;
      if (newWidth > 75) newWidth = 75;
      setEditorWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  
  const handleCommandSelect = (action: string) => {
    // Implement the action handling logic here
    console.log(`Selected action: ${action}`);
  };
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

    if (newMessage.content.startsWith("/help") || newMessage.content === "/") { // if running help command
      // print help message to chat
      const helpMessage = "I can help you with the following commands:\n\n **/help** - Show available commands\n\n/**settings** - Configure options\n\n/**assisted** [filename] - Switch to Assisted View\n\n**/create** [filename] - Create new document\n\n**/open** [filename] - Open Editor Files";
      // 1.5 second delay
      await new Promise((resolve) => setTimeout(resolve, 1700));
      let currentMessage = "";
      const words = helpMessage.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentMessage += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, content: currentMessage },
        ];
          } else {
        return [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: currentMessage,
            role: "assistant",
            timestamp: Date.now(),
          },
        ];
          }
        });
      }
    } else if (newMessage.content.startsWith("/create")) {

      async function createFile(file_name: string) {
        console.log(`Creating file: ${file_name}`);
        const response = await fetch("http://localhost:3000/api/data/createFile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_name }),
        });
        const responseData = await response.json();
        console.log(responseData)
        if (!response.ok) {
          return { message: responseData.message };
        }
        return responseData.message;
      }

      const parts = newMessage.content.split(' ');
      if (parts.length !== 2 || !parts[1].endsWith('.md')) {
        await new Promise((resolve) => setTimeout(resolve, 950));
        let currentMessage = "";
        const words = "Invalid format: \n\n\ Please provide a single name for a file. \n\n\ -It must end in '.md' \n\n\ -Use dashes, underscores, and characters only \n\n\ -The file name cannot have spaces".split(' ');
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 45));
          currentMessage += (i === 0 ? "" : " ") + words[i];
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              return [
          ...prev.slice(0, -1),
          { ...lastMessage, content: currentMessage },
              ];
            } else {
              return [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: currentMessage,
            role: "assistant",
            timestamp: Date.now(),
          },
              ];
            }
          });
        }
      } else { // create file and return output
        const response = await createFile(parts[1]);
        let currentMessage = "";
        const words = response.split(' ');
        await new Promise((resolve) => setTimeout(resolve, 650));
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 95));
          currentMessage += (i === 0 ? "" : " ") + words[i];
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              return [
          ...prev.slice(0, -1),
          { ...lastMessage, content: currentMessage },
              ];
            } else {
              return [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: currentMessage,
            role: "assistant",
            timestamp: Date.now(),
          },
              ];
            }
          });
        }
      }
    } else if (newMessage.content.startsWith("/open")) {
      setSplitView(true);
      return;
    } else if (newMessage.content.startsWith("/exit")) {
      setSplitView(false);
      return;
    } else {
      await fetchAIResponse(newMessage);
    }
  };

  const fetchAIResponse = async (userMessage: Message) => {
    try {
      const response = await fetch("/api/finac", {
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
              role: userMessage.role,
              content: userMessage.content,
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

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (content) {
                aiResponseContent += content;
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

  const handleDeleteMessage = (id: string) => {
    const index = messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      setMessages((prev) => prev.slice(0, index));
    }
  };

  const handleRegenerateMessage = async (id: string) => {
    const index = messages.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      const previousUserMessage = messages[index - 1];
      if (previousUserMessage && previousUserMessage.role === "user") {
        setMessages((prev) => prev.slice(0, index));
        await fetchAIResponse(previousUserMessage);
      }
    }
  };

  return (
    splitView ? (
      <div className="flex h-screen overflow-hidden">
        {/* Left pane */}
        <div
          className="border-r screen border-black overflow-y-auto"
          style={{ flexBasis: `${editorWidth}%`, backgroundColor: '#1e1e1e' }}
        >
          <div className="">
            {/** <CraftEditor 
              content={content} 
              onUpdate={(editor: { getJSON: () => JSONContent }) => {
                const newContent = editor.getJSON();
                console.log('Editor content updated:', newContent);
                setContent(newContent);
              }}
              className="white-text"
            />
            **/}
          </div>
        </div>
        <div
          className="w-[3px] bg-black cursor-col-resize"
          onMouseDown={handleMouseDown}
        />
        {/* Right pane */}
        <div
          className="flex screen flex-col bg-[#1E1E1E] text-white overflow-y-auto"
          style={{ flexBasis: `${100 - editorWidth}%` }}
        >
          {/* The entire chat interface goes here */}
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
                      onDelete={handleDeleteMessage}
                      onRegenerate={handleRegenerateMessage}
                    />
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="">
                <div className="max-w-3xl mx-auto p-4">
                    <div className="relative sticky bottom-0 bg-[#1E1E1E] p-4">
                    <Input
                      value={message}
                      onChange={(e) => {
                      setMessage(e.target.value);
                      }}
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
      </div>
    ) : (
      <div className="h-screen bg-[#1E1E1E] text-white flex flex-col">
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
                    onDelete={handleDeleteMessage}
                    onRegenerate={handleRegenerateMessage}
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="">
              <div className="max-w-3xl mx-auto p-4">
                  <div className="relative sticky bottom-0 bg-[#1E1E1E] p-4">
                  <Input
                    value={message}
                    onChange={(e) => {
                    setMessage(e.target.value);
                    }}
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
    )
  );
}