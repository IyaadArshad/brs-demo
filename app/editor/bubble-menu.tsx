import { BubbleMenu, Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Code, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

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
      <PopoverContent className="w-48 p-1 max-h-60 overflow-y-auto" align="start">
        {colors.map(({ name, color }, index) => (
          <button
            key={index}
            onClick={() => {
              if (name === 'Default') {
                editor.chain().focus().unsetColor().run()
              } else {
                editor.chain().focus().setColor(color).run()
              }
            }}
            className="flex w-full items-center gap-2 rounded-md p-1 px-2 text-sm hover:bg-accent"
            title={name}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border">
              <span
                className="text-xs font-medium"
                style={{ color }}
              >
                A
              </span>
            </div>
            <span className="text-sm">{name}</span>
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
    </BubbleMenu>
  )
}
