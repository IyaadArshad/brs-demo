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
import { useTheme } from "next-themes"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'

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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
