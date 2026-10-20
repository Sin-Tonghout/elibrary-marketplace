import { NavLink } from 'react-router-dom'
import { Home, Search, Library, User } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/catalogue', label: 'Browse', icon: Search },
  { to: '/me/library', label: 'Library', icon: Library },
  { to: '/me', label: 'Account', icon: User },
]

function linkClass({ isActive }) {
  return [
    'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs',
    isActive ? 'text-primary' : 'text-muted-foreground',
  ].join(' ')
}

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 flex border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ zIndex: 'var(--z-sticky-header)' }}
      aria-label="Primary"
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={linkClass}>
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}