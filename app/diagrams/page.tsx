'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Layout, X, Search, PinIcon, LayoutIcon, ShapesIcon, TypeIcon, FormInputIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

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
}

type Shape = {
  id: string;
  type: string;
  position: { x: number; y: number };
}

// Component data
const componentData = {
  pinned: [{ id: 'pinned1', name: 'Pinned 1' }, { id: 'pinned2', name: 'Pinned 2' }],
  windows: [
    { 
      id: 'tabs', 
      name: 'Tabs Window',
      description: 'A window with multiple tabs',
      icon: LayoutIcon
    }
  ],
  shapes: [
    { id: 'square', name: 'Square', icon: ShapesIcon },
    { id: 'circle', name: 'Circle', icon: ShapesIcon },
    { id: 'triangle', name: 'Triangle', icon: ShapesIcon },
    { id: 'rectangle', name: 'Rectangle', icon: ShapesIcon },
    { id: 'oval', name: 'Oval', icon: ShapesIcon },
    { id: 'hexagon', name: 'Hexagon', icon: ShapesIcon },
    { id: 'octagon', name: 'Octagon', icon: ShapesIcon },
    { id: 'pentagon', name: 'Pentagon', icon: ShapesIcon },
    { id: 'diamond', name: 'Diamond', icon: ShapesIcon },
    { id: 'star', name: 'Star', icon: ShapesIcon },
    { id: 'heart', name: 'Heart', icon: ShapesIcon },
    { id: 'trapezoid', name: 'Trapezoid', icon: ShapesIcon },
    { id: 'parallelogram', name: 'Parallelogram', icon: ShapesIcon },
    { id: 'rhombus', name: 'Rhombus', icon: ShapesIcon },
    { id: 'arrow', name: 'Arrow', icon: ShapesIcon },
    { id: 'cross', name: 'Cross', icon: ShapesIcon },
    { id: 'cloud', name: 'Cloud', icon: ShapesIcon },
    { id: 'cylinder', name: 'Cylinder', icon: ShapesIcon },
    { id: 'cone', name: 'Cone', icon: ShapesIcon },
    { id: 'pyramid', name: 'Pyramid', icon: ShapesIcon },
  ],
  text: [{ id: 'text1', name: 'Text 1' }, { id: 'text2', name: 'Text 2' }],
  forms: {
    fields: [
      { id: 'text-input', name: 'Text Input', icon: FormInputIcon },
      { id: 'number-input', name: 'Number Input', icon: FormInputIcon },
      { id: 'textarea', name: 'Textarea', icon: FormInputIcon },
    ],
    components: [
      { id: 'checkbox', name: 'Checkbox', icon: FormInputIcon },
      { id: 'radio', name: 'Radio', icon: FormInputIcon },
      { id: 'select', name: 'Select', icon: FormInputIcon },
    ],
    pinned: [
      { id: 'pinned-form1', name: 'Pinned Form 1', icon: PinIcon },
      { id: 'pinned-form2', name: 'Pinned Form 2', icon: PinIcon },
    ],
    templates: [
      { id: 'login-form', name: 'Login Form', icon: LayoutIcon },
      { id: 'signup-form', name: 'Signup Form', icon: LayoutIcon },
    ],
  },
}

const componentCategories = [
  { id: 'pinned', name: 'Pinned', icon: PinIcon },
  { id: 'windows', name: 'Windows', icon: LayoutIcon },
  { id: 'shapes', name: 'Shapes', icon: ShapesIcon },
  { id: 'text', name: 'Text', icon: TypeIcon },
  { id: 'forms', name: 'Forms', icon: FormInputIcon },
]

const formCategories = [
  { id: 'fields', name: 'Fields', icon: FormInputIcon },
  { id: 'components', name: 'Components', icon: LayoutIcon },
  { id: 'pinned', name: 'Pinned', icon: PinIcon },
  { id: 'templates', name: 'Templates', icon: LayoutIcon },
]

// Shape rendering function
const renderShape = (type: string) => {
  switch (type) {
    case 'square':
      return <rect width="40" height="40" fill="#4299e1" />;
    case 'circle':
      return <circle cx="20" cy="20" r="20" fill="#48bb78" />;
    case 'triangle':
      return <polygon points="20,0 40,40 0,40" fill="#ed8936" />;
    case 'rectangle':
      return <rect width="60" height="40" fill="#9f7aea" />;
    case 'oval':
      return <ellipse cx="30" cy="20" rx="30" ry="20" fill="#ed64a6" />;
    case 'hexagon':
      return <polygon points="30,0 60,20 60,50 30,70 0,50 0,20" fill="#667eea" />;
    case 'octagon':
      return <polygon points="20,0 60,0 80,20 80,60 60,80 20,80 0,60 0,20" fill="#f56565" />;
    case 'pentagon':
      return <polygon points="50,0 100,38 81,100 19,100 0,38" fill="#68d391" />;
    case 'diamond':
      return <polygon points="40,0 80,40 40,80 0,40" fill="#4fd1c5" />;
    case 'star':
      return (
        <path
          d="M20,0 25,15 40,15 30,25 35,40 20,30 5,40 10,25 0,15 15,15 Z"
          fill="#f6e05e"
        />
      );
    case 'heart':
      return (
        <path
          d="M20,10 C20,-10 60,0 40,20 C60,40 20,50 20,30 C20,50 -20,40 0,20 C-20,0 20,-10 20,10 Z"
          fill="#fc8181"
        />
      );
    case 'trapezoid':
      return <polygon points="20,0 80,0 100,40 0,40" fill="#b794f4" />;
    case 'parallelogram':
      return <polygon points="20,0 100,0 80,40 0,40" fill="#90cdf4" />;
    case 'rhombus':
      return <polygon points="40,0 80,40 40,80 0,40" fill="#f687b3" />;
    case 'arrow':
      return <polygon points="0,20 60,20 60,0 100,40 60,80 60,60 0,60" fill="#a0aec0" />;
    case 'cross':
      return (
        <path
          d="M20,0 V20 H0 V60 H20 V80 H60 V60 H80 V20 H60 V0 Z"
          fill="#cbd5e0"
        />
      );
    case 'cloud':
      return (
        <path
          d="M20,60 C0,60 0,30 20,30 C20,10 50,10 50,30 C70,30 70,60 50,60 Z"
          fill="#63b3ed"
        />
      );
    case 'cylinder':
      return (
        <g>
          <ellipse cx="40" cy="10" rx="40" ry="10" fill="#d53f8c" />
          <rect x="0" y="10" width="80" height="60" fill="#d53f8c" />
          <ellipse cx="40" cy="70" rx="40" ry="10" fill="#b83280" />
        </g>
      );
    case 'cone':
      return <polygon points="50,0 100,100 0,100" fill="#f6ad55" />;
    case 'pyramid':
      return (
        <g>
          <polygon points="50,0 100,100 0,100" fill="#ecc94b" />
          <polygon points="50,0 100,100 50,100" fill="#d69e2e" />
        </g>
      );
    default:
      return <rect width="40" height="40" fill="#a0aec0" />;
  }
};

// Components Dialog Component
function ComponentsDialog({ 
  open, 
  onOpenChange,
  triggerRef,
  className
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  className?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState('pinned')
  const [selectedFormCategory, setSelectedFormCategory] = useState('fields')
  const dialogRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('application/reactflow', componentId)
    e.dataTransfer.effectAllowed = 'move'
  }

  useEffect(() => {
    if (open && triggerRef.current && dialogRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      dialogRef.current.style.position = 'fixed'
      dialogRef.current.style.top = `${triggerRect.top - 150}px`
      dialogRef.current.style.left = `${triggerRect.right + 8}px`
    }
  }, [open, triggerRef])

  if (!open) return null

  const filteredComponents = selectedCategory === 'forms'
      ? componentData.forms[selectedFormCategory as keyof typeof componentData.forms].filter(
          component => component.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : Array.isArray(componentData[selectedCategory as keyof typeof componentData])
        ? (componentData[selectedCategory as keyof typeof componentData] as Array<{ id: string; name: string; icon?: any }>).filter(
            component => component.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : []

  return (
    <div 
      ref={dialogRef}
      className={`z-50 bg-white rounded-lg shadow-lg border w-[600px] flex ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Categories</h2>
        </div>
        <ScrollArea className="h-[300px]">
          {componentCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedCategory(category.id)
                if (category.id === 'forms') {
                  setSelectedFormCategory('fields')
                }
              }}
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        {selectedCategory === 'forms' && (
          <div className="flex flex-wrap gap-2 p-4 border-b">
            {formCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedFormCategory === category.id ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedFormCategory(category.id)}
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        )}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component.id)}
                className="flex items-center justify-center p-4 rounded-lg bg-white border-2 border-gray-200 text-gray-800 cursor-move hover:border-blue-500 transition-colors"
              >
                {component.icon && <component.icon className="mr-2 h-4 w-4" />}
                <span className="text-sm">{component.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

// Tabs Window Component
function TabsWindow({ className, style, onError }: TabsWindowProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab' }
  ])
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [tabToRename, setTabToRename] = useState<Tab | null>(null)
  const [newTabName, setNewTabName] = useState('')
  const [shapes, setShapes] = useState<Shape[]>([])

  const addTab = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab'
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
  }

  const removeTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (tabs.length === 1) {
      onError?.('Cannot close the last tab')
      return
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id)
    }
  }

  const handleRename = (tab: Tab) => {
    setTabToRename(tab)
    setNewTabName(tab.title)
    setIsRenameDialogOpen(true)
  }

  const confirmRename = () => {
    if (!tabToRename) return
    
    setTabs(tabs.map(tab => 
      tab.id === tabToRename.id 
        ? { ...tab, title: newTabName || 'Untitled' }
        : tab
    ))
    setIsRenameDialogOpen(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const shapeType = e.dataTransfer.getData('application/reactflow')
    
    if (!shapeType || !componentData.shapes.some(shape => shape.id === shapeType)) {
      return
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newShape: Shape = {
      id: `${shapeType}-${Date.now()}`,
      type: shapeType,
      position: { x, y }
    }
    
    setShapes(prev => [...prev, newShape])
  }

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
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group flex items-center h-10 px-6 border-r min-w-[120px] max-w-[200px]",
                      "hover:bg-gray-100 transition-colors",
                      activeTab === tab.id && "bg-white"
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
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <div 
            className="w-full h-full max-w-3xl max-h-[calc(100%-2rem)] bg-white border-2 border-gray-200 rounded-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="relative w-full h-full">
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  className="absolute"
                  style={{
                    left: `${shape.position.x}px`,
                    top: `${shape.position.y}px`,
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    {renderShape(shape.type)}
                  </svg>
                </div>
              ))}
            </div>
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
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Main Component
export default function DiagramGenerator() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isComponentsDialogOpen, setIsComponentsDialogOpen] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })
  const [diagramComponents, setDiagramComponents] = useState<Component[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  const componentsButtonRef = useRef<HTMLButtonElement>(null)
  const resizingRef = useRef<boolean>(false)
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const tabIdRef = useRef(2)
  const shapeIdRef = useRef(1)

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      isComponentsDialogOpen &&
      componentsButtonRef.current &&
      !componentsButtonRef.current.contains(event.target as Node) &&
      !event.defaultPrevented &&
      !(event.target as HTMLElement).closest('.components-dialog')
    ) {
      setIsComponentsDialogOpen(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return
      
      const dx = e.clientX - startPosRef.current.x
      const dy = e.clientY - startPosRef.current.y
      
      setCanvasSize(prev => {
        const newWidth = Math.max(200, prev.width + dx)
        const newHeight = Math.max(200, prev.height + dy)
        
        if (dialogContentRef.current) {
          const dialogRect = dialogContentRef.current.getBoundingClientRect()
          const maxWidth = dialogRect.width - 40
          const maxHeight = dialogRect.height - 80
          return {
            width: Math.min(newWidth, maxWidth),
            height: Math.min(newHeight, maxHeight)
          }
        }
        
        return { width: newWidth, height: newHeight }
      })
      
      startPosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      resizingRef.current = false
      document.body.style.cursor = 'default'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true
    startPosRef.current = { x: e.clientX, y: e.clientY }
    document.body.style.cursor = 'se-resize'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('application/reactflow')
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    
    if (canvasRect) {
      const x = e.clientX - canvasRect.left
      const y = e.clientY - canvasRect.top
      
      const newComponent: Component = {
        id: `${componentType}-${shapeIdRef.current++}`,
        type: componentType,
        position: { x, y },
      }
      
      setDiagramComponents(prev => [...prev, newComponent])
      setIsComponentsDialogOpen(false)
    }
  }

  const handleError = (message: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    })
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-black text-white border-white hover:bg-white hover:text-black transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Generate New Screen
          </Button>
        </DialogTrigger>
        <DialogContent className="w-11/12 max-w-5xl h-5/6 bg-white p-6" ref={dialogContentRef} onClick={handleClickOutside}>
          <DialogHeader>
            <DialogTitle>Generate New Screen</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <Button 
              ref={componentsButtonRef}
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => setIsComponentsDialogOpen(!isComponentsDialogOpen)}
            >
              <Plus className="mr-1 h-4 w-4" /> Components
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Layout className="mr-1 h-4 w-4" /> Layouts
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center"
              onClick={() => setDiagramComponents([])}
            >
              <X className="mr-1 h-4 w-4" /> Clear
            </Button>
          </div>
          <ComponentsDialog 
            open={isComponentsDialogOpen} 
            onOpenChange={setIsComponentsDialogOpen}
            triggerRef={componentsButtonRef}
            className="components-dialog"
          />
          <div className="flex items-center justify-center h-[calc(100%-3rem)]">
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
                  case 'tabs':
                    ComponentToRender = (
                      <TabsWindow
                        className="absolute inset-0"
                        onError={handleError}
                      />
                    );
                    break;
                  default:
                    if (componentData.shapes.some(shape => shape.id === component.type)) {
                      return (
                        <div
                          className="absolute"
                          style={{
                            left: `${component.position.x}px`,
                            top: `${component.position.y}px`,
                          }}
                        >
                          <svg width="80" height="80" viewBox="0 0 100 100">
                            {renderShape(component.type)}
                          </svg>
                        </div>
                      )
                    }
                    ComponentToRender = (
                      <div
                        className="absolute bg-white border rounded p-2"
                        style={{
                          left: `${component.position.x}px`,
                          top: `${component.position.y}px`,
                        }}
                      >
                        {component.type}
                      </div>
                    );
                }
                
                return (
                  <div key={component.id}>
                    {ComponentToRender}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}