import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Settings, Moon, Sun } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
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

function NotesDialog({
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


const editorWidths = {
  default: 'max-w-2xl', // current width
  wide: 'max-w-[70%]',
  ultraWide: 'max-w-[90%]',
}

type EditorWidth = keyof typeof editorWidths

export function SettingsDialog({ 
  onWidthChange 
}: { 
  onWidthChange: (width: EditorWidth) => void 
}) {
  const [showNotes, setShowNotes] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editor Settings</DialogTitle>
          <DialogDescription>
            Configure your editor preferences.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Editor Width</Label>
              <Select onValueChange={(value: EditorWidth) => onWidthChange(value)} defaultValue="default">
                <SelectTrigger>
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="ultraWide">Ultra Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowNotes(true)}
              >
                View Development Notes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
      <NotesDialog open={showNotes} onOpenChange={setShowNotes} />
    </Dialog>
  )
}
