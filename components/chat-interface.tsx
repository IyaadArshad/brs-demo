'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendHorizontal } from 'lucide-react'
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageComponent } from './message'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isConversationStarted, setIsConversationStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setIsConversationStarted(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your message. How can I help further?',
        role: 'assistant',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleEditMessage = (id: string, newContent: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, content: newContent } : msg
      )
    )
  }

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
                if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                  e.preventDefault()
                  handleSendMessage()
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
                    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                      e.preventDefault()
                      handleSendMessage()
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
}

