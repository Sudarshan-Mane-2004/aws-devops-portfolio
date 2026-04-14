import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return <div className={cn('glass rounded-3xl p-6', className)} {...props} />
}
