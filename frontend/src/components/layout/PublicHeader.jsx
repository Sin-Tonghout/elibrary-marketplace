import { Link, NavLink } from 'react-router-dom'
import { BookOpen, Menu, Search, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navLinks = [
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/categories', label: 'Categories' },
  { to: '/help', label: 'Help' },
]

function navLinkClass({ isActive }) {
  return isActive
    ? 'text-primary font-medium'
    : 'text-muted-foreground hover:text-foreground transition-colors'
}

export function PublicHeader() {
  return (
    <header
      className="sticky top-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ zIndex: 'var(--z-sticky-header)' }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">E-Library</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative ml-auto hidden max-w-sm flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search books, authors…" className="pl-9" />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/login">Sign in</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/register">Create account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/seller/apply">Become a seller</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}