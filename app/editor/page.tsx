'use client'

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useTheme } from 'next-themes'
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command'
import { MessageSquare, Type, ListTodo, List, Moon, Sun, Bold } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Markdown } from 'tiptap-markdown'

const commands = [
  {
    id: 'feedback',
    icon: MessageSquare,
    title: 'Send Feedback',
    subtitle: 'Let us know how we can improve.',
  },
  {
    id: 'text',
    icon: Type,
    title: 'Text',
    subtitle: 'Just start typing with plain text.',
  },
  {
    id: 'todo',
    icon: ListTodo,
    title: 'To-do List',
    subtitle: 'Track tasks with a to-do list.',
  },
  {
    id: 'h1',
    icon: () => <span className="font-semibold">H1</span>,
    title: 'Heading 1',
    subtitle: 'Big section heading.',
  },
  {
    id: 'h2',
    icon: () => <span className="font-semibold">H2</span>,
    title: 'Heading 2',
    subtitle: 'Medium section heading.',
  },
  {
    id: 'h3',
    icon: () => <span className="font-semibold">H3</span>,
    title: 'Heading 3',
    subtitle: 'Small section heading.',
  },
  {
    id: 'bullet',
    icon: List,
    title: 'Bullet List',
    subtitle: 'Create a simple bullet list.',
  },
  {
    id: 'bold',
    icon: Bold,
    title: 'Bold',
    subtitle: 'Make text bold.',
  },
]

function CommandMenu({ open, onClose, onSelect }: { 
  open: boolean
  onClose: () => void
  onSelect: (command: string) => void 
}) {
  if (!open) return null

  return (
    <Command className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[300px] rounded-lg border bg-[#18181B] text-white shadow-lg overflow-hidden">
      <CommandInput 
        placeholder="Type a command..." 
        className="border-none bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none"
      />
      <CommandList className="max-h-[400px] overflow-y-auto">
        <CommandGroup>
          {commands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => {
                onSelect(command.id)
                onClose()
              }}
              className="flex items-center gap-3 px-3 py-3 text-sm cursor-pointer hover:bg-white/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20">
                {typeof command.icon === 'function' ? (
                  <command.icon />
                ) : (
                  <command.icon className="h-5 w-5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white">{command.title}</span>
                <span className="text-xs text-zinc-400">{command.subtitle}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

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
  const [showCommands, setShowCommands] = React.useState(false)
  const { theme } = useTheme()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder: ({ node, pos, editor }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }
          
          // Check if we're in a list
          const parent = editor.state.doc.resolve(pos).parent
          if (parent.type.name === 'bulletList' || parent.type.name === 'orderedList') {
            return ''
          }
          
          return 'Press "/" for commands'
        },
        includeChildren: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert focus:outline-none max-w-full prose-headings:mb-4 prose-headings:mt-6',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/' && !showCommands) {
          event.preventDefault()
          setShowCommands(true)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      // Output markdown to console when document changes
      console.log(editor.storage.markdown.getMarkdown())
    },
  })

  const handleCommand = (command: string) => {
    if (!editor) return

    switch (command) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case 'bullet':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'todo':
        editor.chain().focus().toggleTaskList().run()
        break
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
    }
  }

  return (
    <main className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-2xl p-12">
        <EditorContent editor={editor} />
        <CommandMenu
          open={showCommands}
          onClose={() => setShowCommands(false)}
          onSelect={handleCommand}
        />
        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
      </div>
    </main>
  )
}

