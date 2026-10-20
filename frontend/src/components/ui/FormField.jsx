import { Label } from '@/components/ui/label'
import { cn } from 'cn'

export function FormField({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {hint && !error && (
        <p className="text-sm text-muted-foreground">{hint}</p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

export function FieldError({ className, children }) {
  return (
    <p role="alert" className={cn('text-sm text-destructive', className)}>
      {children}
    </p>
  )
}