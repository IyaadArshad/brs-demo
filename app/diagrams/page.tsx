"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Layout,
  X,
  Search,
  PinIcon,
  LayoutIcon,
  ShapesIcon,
  TypeIcon,
  FormInputIcon,
  Pencil,
  Paintbrush,
  Trash,
  Download,
  Upload,
  ArrowLeft,
  Check,
  ChevronRight,
  Circle,
  Settings as SettingsIcon,
} from "lucide-react";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { Input as InputComponent } from "@/components/ui/input";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import "./globals.css";

// Utility function
const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// Button component
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Input component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Slider component
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

// Dialog component
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// ContextMenu component
const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset ? "pl-8" : undefined,
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset ? "pl-8" : undefined,
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset ? "pl-8" : undefined,
      className
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// Types
interface Tab {
  id: string;
  title: string;
  content?: React.ReactNode;
  isDirty?: boolean;
}

interface TabsWindowProps {
  className?: string;
  style?: React.CSSProperties;
  onError?: (message: string) => void;
}

type Component = {
  id: string;
  type: string;
  position: { x: number; y: number };
  content?: string;
  isEditing?: boolean;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  tabs?: {
    id: string;
    title: string;
  }[];
  label?: string;
  placeholder?: string;
  borderColor?: string;
  labelColor?: string;
  labelFontSize?: number;
  inputLength?: number;
  isReadOnly?: boolean; // Added property
  borderThickness?: number; // Added property
  placeholderFontSize?: number; // Added property
  height?: number; // Added property
  width?: number; // new property
};

// Component data
const componentData = {
  pinned: [
    {
      id: "pinned1",
      name: "Pinned 1",
      description:
        "A frequently accessed pinned item, offering quick entry to essential features whenever needed.",
    },
    {
      id: "pinned2",
      name: "Pinned 2",
      description:
        "Another critical pinned item that helps streamline workflows by keeping core functions at hand.",
    },
  ],
  windows: [
    {
      id: "tabs",
      name: "Tabs Window",
      description:
        "A multi-tabbed container allowing structured organization of content or views for easier navigation.",
      icon: LayoutIcon,
    },
    {
      id: "blank",
      name: "Blank Window",
      description:
        "A simple, empty container that can be customized with various elements for building custom layouts.",
      icon: LayoutIcon,
    },
  ],
  shapes: [
    {
      id: "square",
      name: "Square",
      icon: ShapesIcon,
      description:
        "A foundational shape suited for flowcharts, diagrams, or highlighting key parts of a layout.",
    },
  ],
  text: [
    {
      id: "heading",
      name: "Heading",
      icon: TypeIcon,
      description:
        "A large, attention-grabbing text element designed for titles and key section headings.",
    },
    {
      id: "subheading",
      name: "Subheading",
      icon: TypeIcon,
      description:
        "A medium-sized text element typically used for subtitles or secondary headings.",
    },
    {
      id: "paragraph",
      name: "Paragraph",
      icon: TypeIcon,
      description:
        "A standard text block for detailed information, instructions, or descriptive content.",
    },
  ],
  forms: {
    fields: [
      {
        id: "number-input",
        name: "Number Input",
        icon: FormInputIcon,
        description:
          "A specialized field for entering numeric values, complete with built-in validation.",
      },
      {
        id: "custom-text-input",
        name: "Text Input",
        icon: FormInputIcon,
        description:
          "A basic text field for collecting user data, supporting a range of input scenarios.",
      },
    ],
    components: [
      {
        id: "checkbox",
        name: "Checkbox",
        icon: FormInputIcon,
        description:
          "An option selector that can be toggled on or off for multiple-choice input.",
      },
      {
        id: "radio",
        name: "Radio",
        icon: FormInputIcon,
        description:
          "A circular button for exclusive selection among multiple related options.",
      },
      {
        id: "select",
        name: "Select",
        icon: FormInputIcon,
        description:
          "A dropdown for picking a single choice from a predefined set of options.",
      },
      {
        id: "blank-form",
        name: "Blank Form",
        icon: FormInputIcon,
        description:
          "An empty form template suitable for creating custom input structures.",
      },
    ],
    pinned: [
      {
        id: "pinned-form1",
        name: "Pinned Form 1",
        icon: PinIcon,
        description:
          "A frequently used form blueprint, enabling swift creation of commonly needed interfaces.",
      },
      {
        id: "pinned-form2",
        name: "Pinned Form 2",
        icon: PinIcon,
        description:
          "Another often-accessed form template for swiftly adding user input functionality.",
      },
    ],
    templates: [
      {
        id: "login-form",
        name: "Login Form",
        icon: LayoutIcon,
        description:
          "A ready-to-use login interface template for authenticating user credentials efficiently.",
      },
      {
        id: "signup-form",
        name: "Signup Form",
        icon: LayoutIcon,
        description:
          "A pre-built signup interface template designed to streamline user registration.",
      },
    ],
  },
};

const componentCategories = [
  {
    id: "pinned",
    name: "Pinned",
    icon: PinIcon,
    description: "Quick access to your frequently used components",
  },
  {
    id: "windows",
    name: "Windows",
    icon: LayoutIcon,
    description: "Container components like tabs and blank windows",
  },
  {
    id: "shapes",
    name: "Shapes",
    icon: ShapesIcon,
    description: "Basic geometric shapes",
  },
  {
    id: "text",
    name: "Text",
    icon: TypeIcon,
    description: "Text elements including headings and paragraphs",
  },
  {
    id: "forms",
    name: "Forms",
    icon: FormInputIcon,
    description: "Form elements and input fields for user interaction",
  },
];

const formCategories = [
  {
    id: "fields",
    name: "Fields",
    icon: FormInputIcon,
    description: "Basic form fields",
  },
  {
    id: "components",
    name: "Components",
    icon: LayoutIcon,
    description: "Form components like checkboxes and radios",
  },
  {
    id: "pinned",
    name: "Pinned",
    icon: PinIcon,
    description: "Frequently used form components",
  },
  {
    id: "templates",
    name: "Templates",
    icon: LayoutIcon,
    description: "Form templates for quick setup",
  },
];

// Shape rendering function
function renderShape(type: string, comp?: Component) {
  switch (type) {
    case "square":
      return (
        <rect
          width={comp?.width || 40}
          height={comp?.height || 40}
          fill={comp?.color || "#4299e1"}
          stroke={comp?.borderColor || "none"}
          strokeWidth={comp?.borderThickness || 0}
        />
      );
    case "circle":
      return <circle cx="20" cy="20" r="20" fill="#48bb78" />;
    case "triangle":
      return <polygon points="20,0 40,40 0,40" fill="#ed8936" />;
    case "rectangle":
      return <rect width="60" height="40" fill="#9f7aea" />;
    case "oval":
      return <ellipse cx="30" cy="20" rx="30" ry="20" fill="#ed64a6" />;
    case "hexagon":
      return (
        <polygon points="30,0 60,20 60,50 30,70 0,50 0,20" fill="#667eea" />
      );
    case "octagon":
      return (
        <polygon
          points="20,0 60,0 80,20 80,60 60,80 20,80 0,60 0,20"
          fill="#f56565"
        />
      );
    case "pentagon":
      return <polygon points="50,0 100,38 81,100 19,100 0,38" fill="#68d391" />;
    case "diamond":
      return <polygon points="40,0 80,40 40,80 0,40" fill="#4fd1c5" />;
    case "star":
      return (
        <path
          d="M20,0 25,15 40,15 30,25 35,40 20,30 5,40 10,25 0,15 15,15 Z"
          fill="#f6e05e"
        />
      );
    case "heart":
      return (
        <path
          d="M20,10 C20,-10 60,0 40,20 C60,40 20,50 20,30 C20,50 -20,40 0,20 C-20,0 20,-10 20,10 Z"
          fill="#fc8181"
        />
      );
    case "trapezoid":
      return <polygon points="20,0 80,0 100,40 0,40" fill="#b794f4" />;
    case "parallelogram":
      return <polygon points="20,0 100,0 80,40 0,40" fill="#90cdf4" />;
    case "rhombus":
      return <polygon points="40,0 80,40 40,80 0,40" fill="#f687b3" />;
    case "arrow":
      return (
        <polygon
          points="0,20 60,20 60,0 100,40 60,80 60,60 0,60"
          fill="#a0aec0"
        />
      );
    case "cross":
      return (
        <path
          d="M20,0 V20 H0 V60 H20 V80 H60 V60 H80 V20 H60 V0 Z"
          fill="#cbd5e0"
        />
      );
    case "cloud":
      return (
        <path
          d="M20,60 C0,60 0,30 20,30 C20,10 50,10 50,30 C70,30 70,60 50,60 Z"
          fill="#63b3ed"
        />
      );
    case "cylinder":
      return (
        <g>
          <ellipse cx="40" cy="10" rx="40" ry="10" fill="#d53f8c" />
          <rect x="0" y="10" width="80" height="60" fill="#d53f8c" />
          <ellipse cx="40" cy="70" rx="40" ry="10" fill="#b83280" />
        </g>
      );
    case "cone":
      return <polygon points="50,0 100,100 0,100" fill="#f6ad55" />;
    case "pyramid":
      return (
        <g>
          <polygon points="50,0 100,100 0,100" fill="#ecc94b" />
          <polygon points="50,0 100,100 50,100" fill="#d69e2e" />
        </g>
      );
    default:
      return <rect width="40" height="40" fill="#a0aec0" />;
  }
}

// Components Dialog Component
function ComponentsDialog({
  className,
  theme,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  className?: string;
  theme: Theme;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData("application/reactflow", componentId);
    e.dataTransfer.effectAllowed = "move";
  };

  const filteredComponents = searchTerm
    ? (Object.values(componentData)
        .flatMap((category) =>
          Array.isArray(category) ? category : Object.values(category).flat()
        )
        .filter((component) =>
          component.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) as Array<{ id: string; name: string; icon?: React.ComponentType }>)
    : selectedCategory
    ? selectedCategory === "forms"
      ? componentData.forms.fields
      : (componentData[
          selectedCategory as keyof typeof componentData
        ] as Array<{ id: string; name: string; icon?: React.ComponentType }>)
    : [];

  const renderSettings = () => (
    <div className="flex-1 overflow-auto space-y-6 p-4">
      <h1 className="text-4xl font-semibold mb-8">Settings</h1>
      <div>
        <Label.Root className="block mb-1">Name</Label.Root>
        <Input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div>
        <Label.Root className="block mb-1">Email</Label.Root>
        <Input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedCategory(null)}
      >
        Back
      </Button>
    </div>
  );

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {selectedCategory === "settings" ? (
        renderSettings()
      ) : (
        <>
          <h1 className="text-4xl font-semibold mb-8">Components</h1>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 ${
                  theme === "dark"
                    ? "bg-[#18181a] border-[#27272a] hover:bg-[#27272a] focus:border-[#27272a] focus:ring-[#27272a]"
                    : "bg-white "
                }`}
                style={{
                  borderColor: theme === "dark" ? "#27272a" : undefined,
                }}
              />
            </div>
          </div>
          {searchTerm ? (
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                {filteredComponents.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.id)}
                    className="flex sidebar-category items-center justify-center p-4 rounded-lg bg-[#18181a] border-2 border-[#27272a] text-[#fafafa] cursor-move hover:border-blue-500 hover:bg-[#27272a] transition-colors"
                  >
                    {component.icon && (
                      <component.icon className="mr-2 h-4 w-4" />
                    )}
                    <span className="text-sm">{component.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedCategory ? (
            selectedCategory === "settings" ? (
              renderSettings()
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={`mb-4 ${theme === "dark" ? "shadcn-button" : ""}`}
                >
                  Back to Categories
                </Button>
                <div className="flex-1 overflow-auto">
                  <div className="grid grid-cols-1 gap-4">
                    {filteredComponents.map((component) => (
                      <div
                        key={component.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component.id)}
                        className={`flex items-center justify-center p-4 rounded-lg border-2 text-gray-800 cursor-move hover:border-blue-500 transition-colors ${
                          theme === "dark"
                            ? "bg-[#09090b] hover:bg-[#27272a] border-[#27272a]"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {component.icon && (
                              <component.icon className={`mr-2 h-4 w-4 ${theme === "dark" ? "dark-icon" : ""}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-lg font-semibold mb-2 ${
                                theme === "dark"
                                  ? "text-[#cfcfcf]"
                                  : "text-gray-700"
                              }`}
                            >
                              {component.name}
                            </h3>
                            {"description" in component && (
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {component.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {componentCategories.map((category) => (
                <div
                  key={category.id}
                  className={`${
                    theme === "dark"
                      ? "bg-[#09090b] hover:bg-[#27272a] border-[#27272a]"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  } border rounded-lg p-6 shadow-sm hover:shadow transition-all cursor-pointer`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <category.icon
                        className={`h-8 w-8 ${
                          theme === "dark" ? "text-[#cfcfcf]" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          theme === "dark" ? "text-[#cfcfcf]" : "text-gray-700"
                        }`}
                      >
                        {category.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {getCategoryDescription(category.id)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function getCategoryDescription(categoryId: string): string {
  switch (categoryId) {
    case "pinned":
      return "Quick access to your frequently used components";
    case "windows":
      return "Container components like tabs and blank windows";
    case "shapes":
      return "Basic shapes and geometric elements for diagrams";
    case "text":
      return "Text elements including headings and paragraphs";
    case "forms":
      return "Form elements and input fields for user interaction";
    default:
      return "";
  }
}

function SettingsDialog({
  open,
  onOpenChange,
  showTextWithIcons,
  setShowTextWithIcons,
  theme,
  onThemeChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTextWithIcons: boolean;
  setShowTextWithIcons: (show: boolean) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const handleSave = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Add the Theme dropdown without theming logic */}
          <div className="p-4 border rounded-lg">
            <Label.Root className="block mb-1">Theme</Label.Root>
            <Select.Root
              value={theme}
              onValueChange={(value: Theme) => onThemeChange(value)}
            >
              <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md bg-white border-gray-200">
                <Select.Value placeholder="Select theme" />
                <Select.Icon>
                  <ChevronRight className="w-4 h-4" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 mt-1 bg-white border rounded-md shadow-lg">
                  <Select.Viewport className="p-1">
                    <Select.Item
                      value="light"
                      className="px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <Select.ItemText>Light</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="dark"
                      className="px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <Select.ItemText>Dark</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            onClick={handleSave}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Modify TabsWindow to accept tabs and an onTabsChange callback instead of local state
function TabsWindow({
  className,
  style,
  onError,
  tabs,
  onTabsChange,
  activeTab,
  onActiveTabChange,
}: TabsWindowProps & {
  tabs: { id: string; title: string }[];
  onTabsChange: (newTabs: { id: string; title: string }[]) => void;
  activeTab: string;
  onActiveTabChange: (tabId: string) => void;
}) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [tabToRename, setTabToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTabName, setNewTabName] = useState("");

  const addTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTab = { id: `tab-${Date.now()}`, title: "New Tab" };
    onTabsChange([...tabs, newTab]);
    onActiveTabChange(newTab.id);
  };

  const removeTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabs.length === 1) {
      onError?.("Cannot close the last tab");
      return;
    }
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    onTabsChange(newTabs);
    if (activeTab === tabId) {
      onActiveTabChange(newTabs[newTabs.length - 1].id);
    }
  };

  const handleRename = (tab: { id: string; title: string }) => {
    setTabToRename(tab);
    setNewTabName(tab.title);
    setIsRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (!tabToRename) return;
    const updated = tabs.map((t) =>
      t.id === tabToRename.id ? { ...t, title: newTabName || "Untitled" } : t
    );
    onTabsChange(updated);
    setIsRenameDialogOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 flex flex-col bg-white rounded-lg overflow-hidden border",
          className
        )}
        style={style}
      >
        <div className="flex items-center h-10 flex-shrink-0 border-b bg-gray-50">
          <div className="flex-1 flex items-center overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <ContextMenu key={tab.id}>
                <ContextMenuTrigger>
                  <button
                    onClick={() => onActiveTabChange(tab.id)}
                    className={cn(
                      "group flex items-center h-10 px-6 border-r min-w-[120px] max-w-[200px]",
                      "hover:bg-gray-100 transition-colors",
                      activeTab === tab.id ? "bg-white" : undefined
                    )}
                  >
                    <span className="flex-1 truncate text-sm text-gray-600">
                      {tab.title}
                    </span>
                    {tabs.length > 1 && (
                      <X
                        className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => removeTab(tab.id, e)}
                      />
                    )}
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRename(tab)}>
                    Rename
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => removeTab(tab.id)}
                    disabled={tabs.length === 1}
                    className="text-red-600"
                  >
                    Close
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
            <button
              onClick={addTab}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 transition-colors border-r"
            >
              <Plus className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Tab</DialogTitle>
          </DialogHeader>
          <Input
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            placeholder="Enter tab name"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BlankWindow({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col bg-white rounded-lg overflow-hidden border",
        className
      )}
      style={style}
    >
      <div className="flex-1 bg-white"></div>
    </div>
  );
}

// Main Component
// Add theme type
type Theme = "light" | "dark";

export default function DiagramGenerator() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTextWithIcons, setShowTextWithIcons] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [diagramComponents, setDiagramComponents] = useState<Component[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(
    null
  );
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(
    null
  );
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [componentToCustomize, setComponentToCustomize] =
    useState<Component | null>(null);
  const [activeTabStates, setActiveTabStates] = useState<
    Record<string, string>
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const shapeIdRef = useRef(0);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [theme, setTheme] = useState<Theme>("light");

  // Add theme styles
  const themeStyles = {
    topBar: {
      background: theme === "dark" ? "#09090b" : "#fafafa", // dark:bg-[#09090b] : bg-[#fafafa]
      borderColor: theme === "dark" ? "rgb(31 41 55)" : "rgb(229 231 235)", // dark:border-gray-800 : border-gray-200
      text: theme === "dark" ? "#fafafa" : "rgb(75 85 99)", // dark:text-[#fafafa] : text-gray-500
    },
    sidebar: {
      background: theme === "dark" ? "#09090b" : "#fafafa", // dark:bg-[#09090b] : bg-[#fafafa]
      borderColor: theme === "dark" ? "rgb(31 41 55)" : "rgb(229 231 235)", // dark:border-gray-800 : border-gray-200
      text: theme === "dark" ? "#fafafa" : "inherit", // dark:text-[#fafafa]
    },
  };

  // Add new state variables for customization
  const [newFontFamily, setNewFontFamily] = useState<string>("");
  const [newFontSize, setNewFontSize] = useState<number>(14);
  const [newColor, setNewColor] = useState<string>("");
  const [newBorderColor, setNewBorderColor] = useState<string>("");
  const [newBorderThickness, setNewBorderThickness] = useState<number>(2);
  const [newWidth, setNewWidth] = useState<number>(40);
  const [newHeight, setNewHeight] = useState<number>(40);

  // 1) Add refs for tracking text input resize
  const resizingInputRef = useRef<string | null>(null);
  const inputStartWidthRef = useRef<number>(0);
  const inputStartHeightRef = useRef<number>(0);
  const inputStartXRef = useRef<number>(0);
  const inputStartYRef = useRef<number>(0);

  function exportDiagram() {
    const diagramData = { canvasSize, diagramComponents };
    console.log(JSON.stringify(diagramData));
  }

  function importDiagram() {
    const userInput = prompt("Paste your diagram JSON here:");
    if (!userInput) return;
    try {
      const cleaned = userInput.trim();
      const lastBrace = cleaned.lastIndexOf("}");
      if (lastBrace > -1) {
        const safeJson = cleaned.substring(0, lastBrace + 1);
        const data = JSON.parse(safeJson);
        setCanvasSize(data.canvasSize);
        setDiagramComponents(data.diagramComponents);
      }
    } catch (error) {
      console.error("Invalid diagram JSON", error);
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      setCanvasSize((prev) => {
        const newWidth = Math.max(200, prev.width + dx);
        const newHeight = Math.max(200, prev.height + dy);

        return { width: newWidth, height: newHeight };
      });

      startPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      resizingRef.current = false;
      document.body.style.cursor = "default";
      setDraggedComponentId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = "se-resize";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData("application/reactflow");
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    if (canvasRect) {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

      let defaultContent = "";
      switch (componentType) {
        case "heading":
          defaultContent = "Heading Text";
          break;
        case "subheading":
          defaultContent = "Subheading Text";
          break;
        case "paragraph":
          defaultContent = "This is a sample paragraph text.";
          break;
        case "custom-text-input": {
          const newComponent: Component = {
            id: `text-input-${shapeIdRef.current++}`,
            type: "custom-text-input",
            position: { x, y },
            label: "",
            placeholder: "Enter text...",
            borderColor: "#cccccc",
            labelColor: "#000000",
            labelFontSize: 14,
            inputLength: 200,
            isReadOnly: true, // Added property
          };
          setDiagramComponents((prev) => [...prev, newComponent]);
          return;
        }
        default:
          defaultContent = "";
      }

      const newComponent: Component = {
        id: `${componentType}-${shapeIdRef.current++}`,
        type: componentType,
        position: { x, y },
        content: defaultContent,
        isEditing: false,
      };

      if (componentType === "tabs") {
        newComponent.tabs = [{ id: "1", title: "New Tab" }];
        setActiveTabStates((prev) => ({ ...prev, [newComponent.id]: "1" }));
      }

      setDiagramComponents((prev) => [...prev, newComponent]);
    }
  };

  const handleError = (message: string) => {
    console.error(message);
  };

  const startDrag = (e: React.MouseEvent, componentId: string) => {
    if (e.button !== 0) return; // Only left-click
    e.stopPropagation();
    setDraggedComponentId(componentId);
    let startX = e.clientX;
    let startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setDiagramComponents((prev) =>
        prev.map((comp) => {
          if (comp.id === componentId) {
            let newX = comp.position.x + dx;
            let newY = comp.position.y + dy;

            const canvas = canvasRef.current;
            if (canvas) {
              const canvasWidth = canvas.clientWidth;
              const canvasHeight = canvas.clientHeight;

              const componentWidth = 100;
              const componentHeight = 100;

              newX = Math.max(0, Math.min(newX, canvasWidth - componentWidth));
              newY = Math.max(
                0,
                Math.min(newY, canvasHeight - componentHeight)
              );
            }

            return {
              ...comp,
              position: {
                x: newX,
                y: newY,
              },
            };
          }
          return comp;
        })
      );

      startX = moveEvent.clientX;
      startY = moveEvent.clientY;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateComponentContent = (componentId: string, newContent: string) => {
    setDiagramComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId ? { ...comp, content: newContent } : comp
      )
    );
  };

  const startEditing = (componentId: string) => {
    setDiagramComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId ? { ...comp, isEditing: true } : comp
      )
    );
  };

  const stopEditing = (
    componentId: string,
    save: boolean,
    newContent?: string
  ) => {
    setDiagramComponents((prev) =>
      prev.map((comp) => {
        if (comp.id === componentId) {
          return {
            ...comp,
            isEditing: false,
            content:
              save && newContent !== undefined ? newContent : comp.content,
          };
        }
        return comp;
      })
    );
  };

  const removeComponent = (componentId: string) => {
    setDiagramComponents((prev) =>
      prev.filter((comp) => comp.id !== componentId)
    );
  };

  const handleCustomize = (component: Component) => {
    setComponentToCustomize(component);
    setNewFontFamily(component.fontFamily || "");
    setNewFontSize(component.fontSize || 14);
    setNewColor(component.color || "");
    setNewBorderColor(component.borderColor || "");
    setNewBorderThickness(component.borderThickness || 2);
    setNewWidth(component.width || 40);
    setNewHeight(component.height || 40);
    setCustomizeDialogOpen(true);
  };

  // Apply Customization Function Modification
  const applyCustomization = (
    fontFamily: string,
    fontSize: number,
    color: string,
    borderColor: string,
    borderThickness: number,
    width?: number,
    height?: number
  ) => {
    if (componentToCustomize) {
      setDiagramComponents((prev) =>
        prev.map((comp) => {
          if (comp.id === componentToCustomize.id) {
            if (comp.type === "square") {
              return {
                ...comp,
                width: width || comp.width,
                height: height || comp.height,
                borderColor: borderColor || comp.borderColor,
                borderThickness: borderThickness || comp.borderThickness,
              };
            }
            return {
              ...comp,
              fontFamily,
              fontSize,
              color,
              borderColor,
              borderThickness,
            };
          }
          return comp;
        })
      );
      setCustomizeDialogOpen(false);
      setComponentToCustomize(null);
    }
  };

  function updateTabs(
    componentId: string,
    newTabs: { id: string; title: string }[]
  ) {
    setDiagramComponents((prev) =>
      prev.map((c) => (c.id === componentId ? { ...c, tabs: newTabs } : c))
    );
  }

  function updateActiveTab(componentId: string, tabId: string) {
    setActiveTabStates((prev) => ({ ...prev, [componentId]: tabId }));
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCloseConfirm(true);
    } else {
      setIsEditorOpen(false);
    }
  };

  const handleSidebarResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const doDrag = (e: MouseEvent) => {
      setSidebarWidth(
        Math.min(Math.max(startWidth + e.clientX - startX, 200), 400)
      );
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  useEffect(() => {
    if (diagramComponents.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [diagramComponents]);

  // 2) Add handlers for text-input resize
  const handleInputResizeStart = (
    e: React.MouseEvent<HTMLDivElement>,
    componentId: string,
    direction: "right" | "bottom" | "top"
  ) => {
    e.stopPropagation();
    resizingInputRef.current = componentId;
    const comp = diagramComponents.find((c) => c.id === componentId);
    if (comp) {
      inputStartWidthRef.current = comp.inputLength || 200;
      inputStartHeightRef.current = comp.height || 40;
      inputStartXRef.current = e.clientX;
      inputStartYRef.current = e.clientY;
      document.body.style.cursor =
        direction === "right" ? "col-resize" : "row-resize";
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingInputRef.current) return;
      const dx = e.clientX - inputStartXRef.current;
      const dy = e.clientY - inputStartYRef.current;
      setDiagramComponents((prev) =>
        prev.map((comp) => {
          if (comp.id === resizingInputRef.current) {
            return {
              ...comp,
              inputLength: Math.max(50, inputStartWidthRef.current + dx),
              height: Math.max(20, inputStartHeightRef.current + dy),
            };
          }
          return comp;
        })
      );
    };

    const handleMouseUp = () => {
      resizingInputRef.current = null;
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [diagramComponents]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Button
        variant="outline"
        size="lg"
        className="bg-black text-white border-white hover:bg-white hover:text-black transition-colors"
        onClick={() => setIsEditorOpen(true)}
      >
        <Plus className="mr-4 h-4 w-4" /> Generate New Screen
      </Button>

      {/* Fullscreen Editor */}
      <div
        className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
          isEditorOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Bar */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{
            background: themeStyles.topBar.background,
            borderColor: themeStyles.topBar.borderColor,
            color: themeStyles.topBar.text,
          }}
        >
          <Button
            variant="ghost"
            onClick={() => setIsEditorOpen(false)}
            className="flex items-center text-sm back-button"
            style={{ color: themeStyles.topBar.text }}
          >
            <ArrowLeft className="mr-4 h-4 w-4" />
            {showTextWithIcons && "Back"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={theme === "dark" ? "topbox" : ""}
              size="sm"
              onClick={() => {}}
            >
              <Layout className="mr-4 h-4 w-4" />
              {showTextWithIcons && "Layouts"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDiagramComponents([])}
            >
              <X className="mr-4 h-4 w-4" />
              {showTextWithIcons && "Clear"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={theme === "dark" ? "topbox" : ""}
              onClick={importDiagram}
            >
              <Download className="mr-4 h-4 w-4" />
              {showTextWithIcons && "Import"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={theme === "dark" ? "topbox" : ""}
              onClick={exportDiagram}
            >
              <Upload className="mr-4 h-4 w-4" />
              {showTextWithIcons && "Export"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className={theme === "dark" ? "topbox" : ""}
            >
              <SettingsIcon className="mr-4 h-4 w-4" />
              {showTextWithIcons && "Settings"}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar - Components */}
          <div
            className="h-full border-r flex flex-col relative"
            style={{
              width: `${sidebarWidth}px`,
              minWidth: "200px",
              maxWidth: "400px",
              background: themeStyles.sidebar.background,
              borderColor: themeStyles.sidebar.borderColor,
              color: themeStyles.sidebar.text,
            }}
          >
            <div className="flex-1 overflow-y-auto p-6">
              <ComponentsDialog
                open={true}
                onOpenChange={() => {}}
                triggerRef={useRef<HTMLButtonElement | null>(null)}
                className="h-full"
                theme={theme}
              />
            </div>
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-gray-300 transition-colors"
              onMouseDown={handleSidebarResize}
            />
          </div>

          {/* Right - Canvas */}
          <div
            className={`flex-1 p-4 overflow-auto flex items-center justify-center ${
              theme === "dark" ? "bg-[#151517]" : ""
            }`}
          >
            <div
              ref={canvasRef}
              className="bg-gray-100 border border-gray-200 rounded-lg cursor-se-resize relative"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
              }}
              onMouseDown={handleMouseDown}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {diagramComponents.map((component) => {
                let ComponentToRender;

                switch (component.type) {
                  case "tabs":
                    ComponentToRender = (
                      <TabsWindow
                        className="absolute inset-0"
                        onError={handleError}
                        tabs={component.tabs || []}
                        onTabsChange={(newTabs) =>
                          updateTabs(component.id, newTabs)
                        }
                        activeTab={activeTabStates[component.id] || "1"}
                        onActiveTabChange={(tabId) =>
                          updateActiveTab(component.id, tabId)
                        }
                      />
                    );
                    break;
                  case "blank":
                    ComponentToRender = (
                      <BlankWindow className="absolute inset-0" />
                    );
                    break;
                  case "blank-form":
                    ComponentToRender = (
                      <div
                        className="absolute p-4 border rounded bg-white"
                        style={{
                          left: `${component.position.x}px`,
                          top: `${component.position.y}px`,
                        }}
                      >
                        <h3 className="text-lg font-bold mb-2">Form Heading</h3>
                        <Input placeholder="Field 1" className="mb-2" />
                        <Input placeholder="Field 2" className="mb-2" />
                      </div>
                    );
                    break;
                  case "heading":
                  case "subheading":
                  case "paragraph":
                    ComponentToRender = (
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <div
                            onMouseEnter={() =>
                              setHoveredComponentId(component.id)
                            }
                            onMouseLeave={() => setHoveredComponentId(null)}
                            onMouseDown={(e) => startDrag(e, component.id)}
                            className={
                              "absolute p-2 rounded bg-transparent cursor-move " +
                              (draggedComponentId === component.id
                                ? "border-2 border-gray-600 select-none"
                                : hoveredComponentId === component.id
                                ? "border border-gray-300 select-none"
                                : "border-transparent select-none")
                            }
                            style={{
                              left: `${component.position.x}px`,
                              top: `${component.position.y}px`,
                              fontFamily: component.fontFamily || "Arial",
                              fontSize: `${component.fontSize || 16}px`,
                              color: component.color || "#000000",
                            }}
                            onDoubleClick={() => startEditing(component.id)}
                          >
                            {component.isEditing ? (
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  stopEditing(
                                    component.id,
                                    true,
                                    e.currentTarget.textContent || ""
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    stopEditing(
                                      component.id,
                                      true,
                                      (e.currentTarget as HTMLElement).innerText
                                    );
                                  } else if (e.key === "Escape") {
                                    stopEditing(component.id, false);
                                  }
                                }}
                                className="w-full outline-none"
                                style={{
                                  minHeight: "1.5em",
                                }}
                              >
                                {component.content}
                              </div>
                            ) : component.type === "heading" ? (
                              <h1
                                style={{
                                  fontFamily: component.fontFamily || "Arial",
                                  fontSize: `${component.fontSize || 24}px`,
                                  color: component.color || "#000000",
                                  fontWeight: "bold",
                                }}
                              >
                                {component.content}
                              </h1>
                            ) : component.type === "subheading" ? (
                              <h2
                                style={{
                                  fontFamily: component.fontFamily || "Arial",
                                  fontSize: `${component.fontSize || 20}px`,
                                  color: component.color || "#000000",
                                  fontWeight: "semi-bold",
                                }}
                              >
                                {component.content}
                              </h2>
                            ) : (
                              <p
                                style={{
                                  fontFamily: component.fontFamily || "Arial",
                                  fontSize: `${component.fontSize || 16}px`,
                                  color: component.color || "#000000",
                                }}
                              >
                                {component.content}
                              </p>
                            )}
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          {["heading", "subheading", "paragraph"].includes(
                            component.type
                          ) && (
                            <>
                              <ContextMenuItem
                                className="cursor-pointer"
                                onClick={() => startEditing(component.id)}
                              >
                                <Pencil className="mr-4 h-4 w-4" /> Edit
                              </ContextMenuItem>
                              <ContextMenuItem
                                className="cursor-pointer"
                                onClick={() => handleCustomize(component)}
                              >
                                <Paintbrush className="mr-4 h-4 w-4" />{" "}
                                Customize
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                onClick={() => removeComponent(component.id)}
                                className="flex items-center cursor-pointer text-red-600 hover:bg-red-500"
                              >
                                <Trash className="mr-4 h-4 w-4" /> Delete
                              </ContextMenuItem>
                            </>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                    break;
                  case "custom-text-input":
                    ComponentToRender = (
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <div
                            key={component.id}
                            style={{
                              position: "absolute",
                              left: component.position.x,
                              top: component.position.y,
                            }}
                            onMouseDown={(e) => {
                              startDrag(e, component.id);
                              e.preventDefault(); // Prevent default focus behavior
                            }}
                          >
                            {component.label ? (
                              <label
                                style={{
                                  display: "block",
                                  fontSize: component.labelFontSize,
                                  color: component.labelColor,
                                  marginBottom: 4,
                                }}
                              >
                                {component.label}
                              </label>
                            ) : null}
                            <InputComponent
                              type="text"
                              placeholder={component.placeholder}
                              style={{
                                width: component.inputLength,
                                height: component.height || "auto",
                                border: "none",
                                outline: `${
                                  component.borderThickness || 1
                                }px solid ${
                                  component.borderColor || "#cccccc"
                                }`,
                                padding: "4px",
                                fontSize: component.fontSize || 14,
                                fontFamily: component.fontFamily || "inherit",
                                color: component.color || "inherit",
                              }}
                              readOnly={component.isReadOnly}
                              className="cursor-move custom-input"
                              tabIndex={-1} // Make input unfocusable
                              onFocus={(e) => e.target.blur()} // Prevent focus
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "5px",
                                height: "100%",
                                cursor: "col-resize",
                              }}
                              onMouseDown={(e) =>
                                handleInputResizeStart(e, component.id, "right")
                              }
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "5px",
                                cursor: "row-resize",
                              }}
                              onMouseDown={(e) =>
                                handleInputResizeStart(
                                  e,
                                  component.id,
                                  "bottom"
                                )
                              }
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "5px",
                                cursor: "row-resize",
                              }}
                              onMouseDown={(e) =>
                                handleInputResizeStart(e, component.id, "top")
                              }
                            />
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => startEditing(component.id)}
                          >
                            <Pencil className="mr-4 h-4 w-4" /> Edit
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => handleCustomize(component)}
                          >
                            <Paintbrush className="mr-4 h-4 w-4" /> Customize
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onClick={() => removeComponent(component.id)}
                            className="flex items-center cursor-pointer text-red-600 hover:bg-red-500"
                          >
                            <Trash className="mr-4 h-4 w-4" /> Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                    break;
                  default:
                    if (
                      componentData.shapes.some(
                        (shape) => shape.id === component.type
                      )
                    ) {
                      ComponentToRender = (
                        <ContextMenu>
                          <ContextMenuTrigger>
                            <div
                              className="absolute"
                              style={{
                                left: `${component.position.x}px`,
                                top: `${component.position.y}px`,
                                cursor: "move",
                              }}
                              onMouseDown={(e) => startDrag(e, component.id)}
                            >
                              <svg width="80" height="80" viewBox="0 0 100 100">
                                {renderShape(component.type, component)}
                              </svg>
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem
                              onClick={() => handleCustomize(component)}
                            >
                              Customize
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={() => removeComponent(component.id)}
                            >
                              Delete
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      );
                    } else {
                      ComponentToRender = (
                        <ContextMenu>
                          <ContextMenuTrigger>
                            <div
                              className="absolute bg-white border rounded p-2 cursor-move"
                              style={{
                                left: `${component.position.x}px`,
                                top: `${component.position.y}px`,
                              }}
                            >
                              {component.type}
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem
                              onClick={() => removeComponent(component.id)}
                            >
                              Delete
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      );
                    }
                }

                return <div key={component.id}>{ComponentToRender}</div>;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Close Confirmation Dialog */}
      <Dialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Are you sure you want to close?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCloseConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowCloseConfirm(false);
                setIsEditorOpen(false);
                setHasUnsavedChanges(false);
              }}
            >
              Close without saving
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customize Dialog */}
      {componentToCustomize && (
        <Dialog
          open={customizeDialogOpen}
          onOpenChange={setCustomizeDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Component</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4">
              {componentToCustomize.type !== "square" && (
                <>
                  <div>
                    <label className="mb-1 text-sm font-medium">
                      Font Family
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Arial, sans-serif"
                      value={newFontFamily}
                      onChange={(e) => setNewFontFamily(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 text-sm font-medium">
                      Font Size: {newFontSize}px
                    </label>
                    <Slider
                      value={[newFontSize]}
                      onValueChange={(value) => setNewFontSize(value[0])}
                      min={8}
                      max={72}
                      step={1}
                      className="py-4"
                    />
                  </div>
                  <div>
                    <label className="mb-1 text-sm font-medium">Color</label>
                    <Input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                    />
                  </div>
                </>
              )}
              {componentToCustomize.type === "square" && (
                <>
                  <div>
                    <label className="mb-1 text-sm font-medium">
                      Width: {newWidth}px
                    </label>
                    <Slider
                      value={[newWidth]}
                      onValueChange={(val) => {
                        const v = val[0];
                        const pct = (v / 200) * 100;
                        let step = 30;
                        if (pct <= 33) step = 10;
                        else if (pct <= 49.5) step = 15;
                        else if (pct <= 66) step = 20;
                        const rounded = Math.round(v / step) * step;
                        setNewWidth(rounded);
                      }}
                      min={10}
                      max={200}
                      step={1}
                      className="py-4"
                    />
                  </div>
                  <div>
                    <label className="mb-1 text-sm font-medium">
                      Height: {newHeight}px
                    </label>
                    <Slider
                      value={[newHeight]}
                      onValueChange={(val) => {
                        const v = val[0];
                        const pct = (v / 200) * 100;
                        let step = 30;
                        if (pct <= 33) step = 10;
                        else if (pct <= 49.5) step = 15;
                        else if (pct <= 66) step = 20;
                        const rounded = Math.round(v / step) * step;
                        setNewHeight(rounded);
                      }}
                      min={10}
                      max={200}
                      step={1}
                      className="py-4"
                    />
                  </div>
                  <div>
                    <label className="mb-1 text-sm font-medium">
                      Border Color
                    </label>
                    <Input
                      type="color"
                      value={newBorderColor}
                      onChange={(e) => setNewBorderColor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 text-sm font-medium">
                      Border Thickness: {newBorderThickness.toFixed(1)}px
                    </label>
                    <Slider
                      value={[newBorderThickness]}
                      onValueChange={(value) =>
                        setNewBorderThickness(value[0])
                      }
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="py-4"
                    />
                  </div>
                </>
              )}
            </form>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCustomizeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  applyCustomization(
                    newFontFamily,
                    newFontSize,
                    newColor,
                    newBorderColor,
                    newBorderThickness,
                    newWidth,
                    newHeight
                  );
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        input[readOnly] {
          cursor: default;
        }
      `}</style>
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        showTextWithIcons={showTextWithIcons}
        setShowTextWithIcons={setShowTextWithIcons}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}