import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-glow',
        ghost: 'glass text-white hover:bg-white/20',
        outline: 'border border-cyan-300/50 text-cyan-200 hover:bg-cyan-400/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Button({ className, variant, ...props }) {
  return <button className={cn(buttonVariants({ variant, className }))} {...props} />
}

export { Button, buttonVariants }
