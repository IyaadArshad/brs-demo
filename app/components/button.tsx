interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'icon'
    children: React.ReactNode
  }
  
  export function Button({ variant = 'default', size = 'md', className = '', children, ...props }: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2f81f7] disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      default: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d] hover:bg-[#30363d]',
      outline: 'border border-[#30363d] bg-transparent hover:bg-[#21262d] text-[#c9d1d9]',
      ghost: 'hover:bg-[#21262d] text-[#c9d1d9]'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      icon: 'h-9 w-9'
    }
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  
  