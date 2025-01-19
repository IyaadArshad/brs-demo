import { BubbleMenu, Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Code, Link } from 'lucide-react'

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

export function FormattingMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null

  return (
    <BubbleMenu 
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex overflow-hidden rounded-lg border bg-background shadow-md"
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
    </BubbleMenu>
  )
}
