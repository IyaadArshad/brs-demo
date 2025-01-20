'use client'

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { Markdown } from 'tiptap-markdown'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { BubbleMenu, Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Code, ChevronDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import TextAlign from '@tiptap/extension-text-align'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SettingsDialog } from './settings-dialog'
import { useState } from 'react'

interface BubbleMenuProps {
  editor: Editor
}

const MenuButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void
  isActive: boolean
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg text-sm ${
      isActive 
        ? 'bg-accent text-accent-foreground' 
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    }`}
  >
    {children}
  </button>
)

const colors = [
  { name: 'Default', color: 'currentColor' },
  { name: 'Purple', color: '#9333ea' },
  { name: 'Red', color: '#e11d48' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Blue', color: '#2563eb' },
  { name: 'Green', color: '#16a34a' },
  { name: 'Orange', color: '#ea580c' },
  { name: 'Pink', color: '#db2777' },
  { name: 'White', color: '#ffffff' },
  { name: 'Gray', color: '#a8a29e' },
  { name: 'Black', color: '#000000' },
]

const highlights = [
  { name: 'Default', color: 'var(--novel-highlight-default)' },
  { name: 'Purple', color: 'var(--novel-highlight-purple)' },
  { name: 'Red', color: 'var(--novel-highlight-red)' },
  { name: 'Yellow', color: 'var(--novel-highlight-yellow)' },
  { name: 'Blue', color: 'var(--novel-highlight-blue)' },
  { name: 'Green', color: 'var(--novel-highlight-green)' },
  { name: 'Orange', color: 'var(--novel-highlight-orange)' },
  { name: 'Pink', color: 'var(--novel-highlight-pink)' },
  { name: 'Gray', color: 'var(--novel-highlight-gray)' },
]

function ColorSelector({ editor }: { editor: Editor }) {
  const activeColor = editor.getAttributes('textStyle').color || 'currentColor'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
          <span
            className="text-sm font-medium"
            style={{ color: activeColor }}
          >
            A
          </span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl" align="start">
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
            Color
          </div>
          {colors.map(({ name, color }, index) => (
            <div
              key={index}
              onClick={() => {
                if (name === 'Default') {
                  editor.chain().focus().unsetColor().run()
                } else {
                  editor.chain().focus().setColor(color).run()
                }
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2 py-px font-medium" style={{ color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
            Background
          </div>
          {highlights.map(({ name, color }, index) => (
            <div
              key={index}
              onClick={() => {
                if (name === 'Default') {
                  editor.chain().focus().unsetMark('highlight').run()
                } else {
                  editor.chain().focus().setMark('highlight', { color }).run()
                }
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="rounded-sm border px-2 py-px font-medium" 
                  style={{ backgroundColor: color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AlignmentSelector({ editor }: { editor: Editor }) {
  const alignments = [
    { name: 'Left', value: 'left', icon: <AlignLeft className="h-4 w-4" /> },
    { name: 'Center', value: 'center', icon: <AlignCenter className="h-4 w-4" /> },
    { name: 'Right', value: 'right', icon: <AlignRight className="h-4 w-4" /> },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-1">
          {<AlignLeft className="h-4 w-4" />} {/* Just an icon placeholder */}
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="my-1 w-32 p-1 flex flex-col gap-1" align="start">
        {alignments.map(({ name, value, icon }, i) => (
          <button
            key={i}
            onClick={() => editor.chain().focus().setTextAlign(value).run()}
            className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-accent"
          >
            {icon}
            <span>{name}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export function FormattingMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null

  return (
    <BubbleMenu 
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 overflow-hidden rounded-lg border bg-background shadow-md p-1"
    >
      <MenuButton 
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <Bold className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <Italic className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        <Strikethrough className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
      >
        <Code className="h-4 w-4" />
      </MenuButton>

      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <ColorSelector editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <AlignmentSelector editor={editor} />
    </BubbleMenu>
  )
}

const editorWidths = {
  default: 'max-w-3xl',
  wide: 'max-w-5xl',
  ultraWide: 'max-w-full'
} as const

export default function Page() {
  const [editorWidth, setEditorWidth] = useState<keyof typeof editorWidths>('default')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'rounded-md px-1 py-0.5',
        },
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }
          return 'Start writing...'
        },
        includeChildren: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert focus:outline-none max-w-full prose-headings:mb-4 prose-headings:mt-6',
      },
    },
  })

  return (
    <main className="relative min-h-screen bg-background">
      <div className={`mx-auto ${editorWidths[editorWidth]} p-12`}>
        {editor && <FormattingMenu editor={editor} />}
        <EditorContent editor={editor} />
        <div className="fixed bottom-4 right-4">
          <SettingsDialog onWidthChange={setEditorWidth} />
        </div>
      </div>
    </main>
  )
}

