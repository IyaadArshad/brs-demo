'use client'

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { Markdown } from 'tiptap-markdown'
import { FormattingMenu } from './bubble-menu'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function Page() {
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
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert focus:outline-none max-w-full prose-headings:mb-4 prose-headings:mt-6',
      },
    },
  })

  return (
    <main className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-2xl p-12">
        {editor && <FormattingMenu editor={editor} />}
        <EditorContent editor={editor} />
        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
      </div>
    </main>
  )
}

