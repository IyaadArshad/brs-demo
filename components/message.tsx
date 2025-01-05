'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Pencil, Check } from 'lucide-react'
import { Message } from '../types'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface MessageProps {
  message: Message
  onEdit?: (id: string, content: string) => void
}

export function MessageComponent({ message, onEdit }: MessageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setIsCopied(true)
  }

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(message.id, editedContent)
    }
    setIsEditing(!isEditing)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex items-start gap-4 px-4 py-3 hover:bg-[#2A2A2A] relative ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div 
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === 'assistant' ? 'bg-black' : 'bg-white'
        }`}
      />
      <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-[#2f2f2f] border-none text-white px-3 py-1 rounded focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit()
              if (e.key === 'Escape') setIsEditing(false)
            }}
          />
        ) : (
          <p className="text-white whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
      <div className={`opacity-0 group-hover:opacity-100 transition-opacity absolute ${
        message.role === 'user' ? 'left-4' : 'right-4'
      }`}>
        {message.role === 'assistant' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:bg-[#2f2f2f]"
                  onClick={handleCopy}
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isCopied ? 'Copied!' : 'Copy message'}</TooltipContent>
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
                  {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isEditing ? 'Save edit' : 'Edit message'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </motion.div>
  )
}

