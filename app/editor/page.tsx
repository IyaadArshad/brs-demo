"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { BubbleMenu, Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  TextQuote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Text,
  Table as TableIcon,
  Pilcrow,
  Image as ImageIcon,
} from "lucide-react";
import TextAlign from "@tiptap/extension-text-align";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SettingsDialog } from "./settings-dialog";
import { useState, useCallback, useEffect } from "react";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import Image from "@tiptap/extension-image";
import { v4 as uuidv4 } from 'uuid'; // Add import for unique IDs

interface CommandPaletteProps {
  editor: Editor;
}

// Split commands into visible and hidden
const visibleCommands = [
  {
    title: "Paragraph",
    description: "Begin with a clean paragraph structure for your text.",
    icon: <Pilcrow className="h-6 w-6" />,
    command: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Create a primary heading to define main sections.",
    icon: <Heading1 className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Insert a subheading for organizing subsections.",
    icon: <Heading2 className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Use a third-level heading for detailed subsections.",
    icon: <Heading3 className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet List",
    description: "Generate a bullet-point list for unordered items.",
    icon: <List className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Generate a numbered list to organize items sequentially.",
    icon: <ListOrdered className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "Build a to-do list to manage and track your tasks.",
    icon: <List className="h-6 w-6" />,
    command: (editor: Editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Insert a blockquote to emphasize important quotes.",
    icon: <TextQuote className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Code Block",
    description: "Add a code block to showcase code snippets clearly.",
    icon: <Code className="h-6 w-6" />,
    command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Table",
    description: "Create a table to neatly organize and display your data.",
    icon: <TableIcon className="h-6 w-6" />,
    command: (editor: Editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    title: "Upload Image",
    description: "Insert an image from your device",
    icon: <ImageIcon className="h-6 w-6" />,
    command: async (editor: Editor) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        // Create a temporary URL for the skeleton
        const tempUrl = URL.createObjectURL(file);
        const img = new window.Image();
        
        img.onload = async () => {
          const tempId = uuidv4();
          
          // Insert skeleton with actual dimensions
          editor.chain().focus().insertContent([
            {
              type: 'image',
              attrs: {
                src: tempUrl,
                alt: file.name,
                'data-temp-id': tempId,
                width: img.naturalWidth,
                height: img.naturalHeight,
                class: 'skeleton',
              },
            },
            { type: 'paragraph' }
          ]).run();

          const formData = new FormData();
          formData.append('image', file);

          try {
            const response = await fetch('/api/editor/uploadImage', {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();
            if (data.url) {
              // Replace skeleton with actual image
              editor.chain().focus().command(({ tr, state }) => {
                state.doc.descendants((node, pos) => {
                  if (node.type.name === 'image' && node.attrs['data-temp-id'] === tempId) {
                    tr.setNodeMarkup(pos, undefined, {
                      ...node.attrs,
                      src: data.url,
                      class: undefined,
                      'data-temp-id': undefined,
                    });
                    return false;
                  }
                });
                return true;
              }).run();
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            // Remove failed upload
            editor.chain().focus().command(({ tr, state }) => {
              state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs['data-temp-id'] === tempId) {
                  tr.delete(pos, pos + node.nodeSize);
                  return false;
                }
              });
              return true;
            }).run();
          } finally {
            URL.revokeObjectURL(tempUrl);
          }
        };

        img.src = tempUrl;
      };

      input.click();
    },
  },
];

const hiddenCommands = [
  {
    title: "Heading 4",
    description: "Subsection heading for detailed content.",
    icon: <Heading3 className="h-6 w-6 scale-90" />,
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
  {
    title: "Heading 5",
    description: "Minor heading for specific topics.",
    icon: <Heading3 className="h-6 w-6 scale-75" />,
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
  },
  {
    title: "Heading 6",
    description: "Fine-grained heading for detailed breakdowns.",
    icon: <Heading3 className="h-6 w-6 scale-[0.65]" />,
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
  },
];

function CommandPalette({ editor }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  // Add this effect to handle scrolling
  React.useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = selectedRef.current;

      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const isAbove = elementRect.top < containerRect.top;
      const isBelow = elementRect.bottom > containerRect.bottom;

      if (isAbove) {
        element.scrollIntoView({ block: "nearest" });
      }
      if (isBelow) {
        element.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const filteredCommands = React.useMemo(() => {
    const allCommands = search ? [...visibleCommands, ...hiddenCommands] : visibleCommands;
    return allCommands.filter(
      command =>
        command.title.toLowerCase().includes(search.toLowerCase()) ||
        command.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "i") {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[650px] animate-scale-in"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIndex(
                (prev) =>
                  (prev - 1 + filteredCommands.length) % filteredCommands.length
              );
            } else if (e.key === "Enter") {
              e.preventDefault();
              const command = filteredCommands[selectedIndex];
              if (command) {
                command.command(editor);
                setOpen(false);
              }
            }
          }}
        >
          <div className="bg-background rounded-lg border shadow-2xl overflow-hidden">
            <input
              className="w-full px-4 py-4 outline-none bg-background text-foreground border-b"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div
              className="max-h-[400px] overflow-y-auto scroll-smooth"
              ref={containerRef}
            >
              {filteredCommands.map((command, index) => (
                <button
                  key={command.title}
                  ref={index === selectedIndex ? selectedRef : null}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left",
                    index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => {
                    command.command(editor);
                    setOpen(false);
                  }}
                >
                  <div className="p-1 rounded-md border bg-background">
                    {command.icon}
                  </div>
                  <div>
                    <div className="font-medium">{command.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {command.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface BubbleMenuProps {
  editor: Editor;
}

const MenuButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg text-sm ${
      isActive
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`}
  >
    {children}
  </button>
);

const colors = [
  { name: "Default", color: "currentColor" },
  { name: "Purple", color: "#9333ea" },
  { name: "Red", color: "#e11d48" },
  { name: "Yellow", color: "#eab308" },
  { name: "Blue", color: "#2563eb" },
  { name: "Green", color: "#16a34a" },
  { name: "Orange", color: "#ea580c" },
  { name: "Pink", color: "#db2777" },
  { name: "White", color: "#ffffff" },
  { name: "Gray", color: "#a8a29e" },
  { name: "Black", color: "#000000" },
];

const highlights = [
  { name: "Default", color: "var(--novel-highlight-default)" },
  { name: "Purple", color: "var(--novel-highlight-purple)" },
  { name: "Red", color: "var(--novel-highlight-red)" },
  { name: "Yellow", color: "var(--novel-highlight-yellow)" },
  { name: "Blue", color: "var(--novel-highlight-blue)" },
  { name: "Green", color: "var(--novel-highlight-green)" },
  { name: "Orange", color: "var(--novel-highlight-orange)" },
  { name: "Pink", color: "var(--novel-highlight-pink)" },
  { name: "Gray", color: "var(--novel-highlight-gray)" },
];

function ColorSelector({ editor }: { editor: Editor }) {
  const activeColor = editor.getAttributes("textStyle").color || "currentColor";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
          <span className="text-sm font-medium" style={{ color: activeColor }}>
            A
          </span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
        align="start"
      >
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
            Color
          </div>
          {colors.map(({ name, color }, index) => (
            <div
              key={index}
              onClick={() => {
                if (name === "Default") {
                  editor.chain().focus().unsetColor().run();
                } else {
                  editor.chain().focus().setColor(color).run();
                }
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ color }}
                >
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
                if (name === "Default") {
                  editor.chain().focus().unsetMark("highlight").run();
                } else {
                  editor.chain().focus().setMark("highlight", { color }).run();
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
  );
}

function AlignmentSelector({ editor }: { editor: Editor }) {
  const alignments = [
    { name: "Left", value: "left", icon: <AlignLeft className="h-4 w-4" /> },
    {
      name: "Center",
      value: "center",
      icon: <AlignCenter className="h-4 w-4" />,
    },
    { name: "Right", value: "right", icon: <AlignRight className="h-4 w-4" /> },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-1">
          {<AlignLeft className="h-4 w-4" />} {/* Just an icon placeholder */}
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="my-1 w-32 p-1 flex flex-col gap-1"
        align="start"
      >
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
  );
}

function ImageBubbleMenu({ editor }: BubbleMenuProps) {
  return (
    <BubbleMenu 
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor }) => editor.isActive('image')}
      className="flex items-center gap-1 overflow-hidden rounded-lg border bg-background shadow-md p-1"
    >
      <AlignmentSelector editor={editor} />
    </BubbleMenu>
  );
}

function FormattingMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null;

  const getCurrentNodeType = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("heading", { level: 4 })) return "Heading 4";
    if (editor.isActive("heading", { level: 5 })) return "Heading 5";
    if (editor.isActive("heading", { level: 6 })) return "Heading 6";
    if (editor.isActive("taskList")) return "To-do List";
    if (editor.isActive("bulletList")) return "Bullet List";
    if (editor.isActive("orderedList")) return "Numbered List";
    if (editor.isActive("blockquote")) return "Quote";
    if (editor.isActive("codeBlock")) return "Code Block";
    return "Paragraph";
  };

  const componentTypes = [
    {
      name: "Paragraph",
      icon: <Pilcrow className="h-4 w-4" />,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    {
      name: "Heading 1",
      icon: <Heading1 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      name: "Heading 2",
      icon: <Heading2 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      name: "Heading 3",
      icon: <Heading3 className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      name: "Heading 4",
      icon: <Heading3 className="h-4 w-4 scale-90" />,
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      name: "Heading 5",
      icon: <Heading3 className="h-4 w-4 scale-75" />,
      action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      name: "Heading 6",
      icon: <Heading3 className="h-4 w-4 scale-[0.65]" />,
      action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },
    {
      name: "To-do List",
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      name: "Bullet List",
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "Numbered List",
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: "Quote",
      icon: <TextQuote className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      name: "Code Block",
      icon: <Code className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <>
      <BubbleMenu 
        editor={editor}
        tippyOptions={{ duration: 100 }}
        shouldShow={({ editor }) => !editor.isActive('image') && !editor.state.selection.empty} // Updated condition
        className="flex items-center gap-1 overflow-hidden rounded-lg border bg-background shadow-md p-1"
      >
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
              <span>{getCurrentNodeType()}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1 mt-1" sideOffset={5}>
            {componentTypes.map((type, index) => (
              <button
                key={index}
                onClick={type.action}
                className="flex items-center justify-between w-full px-2 py-1 text-sm hover:bg-accent rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded border">{type.icon}</div>
                  <span>{type.name}</span>
                </div>
                {getCurrentNodeType() === type.name && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          <Code className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ColorSelector editor={editor} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <AlignmentSelector editor={editor} />
      </BubbleMenu>
      <ImageBubbleMenu editor={editor} />
    </>
  );
}

const editorWidths = {
  default: "max-w-3xl",
  wide: "max-w-5xl",
  ultraWide: "max-w-full",
} as const;

export default function Page() {
  const [editorWidth, setEditorWidth] =
    useState<keyof typeof editorWidths>("default");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {},
        orderedList: {},
        blockquote: {},
      }),
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "rounded-md px-1 py-0.5",
        },
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return "Start writing, or search components...";
        },
        includeChildren: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-gray-200 dark:border-gray-700",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-bold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-200 dark:border-gray-700 p-3",
        },
      }),
      Image,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-stone dark:prose-invert focus:outline-none max-w-full prose-headings:mb-4 prose-headings:mt-6 [&_ul[data-type='taskList']]:list-none prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:my-4 prose-blockquote:italic",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.storage.markdown.getMarkdown());
    },
    immediatelyRender: false,
  });

  return (
    <main className="relative min-h-screen bg-background">
      <div className={`mx-auto ${editorWidths[editorWidth]} p-12`}>
        {editor && (
          <>
            <FormattingMenu editor={editor} />
            <CommandPalette editor={editor} />
          </>
        )}
        <EditorContent editor={editor} />
        <div className="fixed bottom-4 right-4">
          <SettingsDialog onWidthChange={setEditorWidth} />
        </div>
      </div>
    </main>
  );
}