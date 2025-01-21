import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'

const developmentNotes = `
## Features
- Rich markdown editor using Tiptap
- Dark mode support (default mode, dark mode only)
- Markdown support
- Customizable editor width
- Text formatting with bubble menu
- Text color and highlighting
- Text alignment options

## To Do
- [ ] Add image support
- [ ] Add table support
- [ ] Add link support
- [ ] Add more formatting options
- [ ] Add export options

## Known Issues
- Highlighting or changing text color does not save to the markdown file itself.
- Any highlighting or changing color is unsaved
`

export function NotesDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Development Notes</DialogTitle>
          <DialogDescription>
            Please read to be aware of limitations of this editor
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="prose dark:prose-invert">
            <ReactMarkdown>{developmentNotes}</ReactMarkdown>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
