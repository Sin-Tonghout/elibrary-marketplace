import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function navLinkClass({ isActive }) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-secondary font-medium text-foreground'
      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
  ].join(' ')
}

function SidebarNav({ navItems, onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={navLinkClass} onClick={onNavigate}>
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

/**
 * Shared internal layout for sidebar-style account areas (reader, seller).
 * Not used directly in pages — configure via ReaderShell / SellerShell.
 */
export function DashboardShell({ title, homeTo, navItems, userLabel = 'Account' }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <Link to={homeTo} className="flex items-center gap-2 border-b border-border p-4 font-bold">
          <BookOpen className="h-5 w-5 text-primary" />
          {title}
        </Link>
        <SidebarNav navItems={navItems} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur"
          style={{ zIndex: 'var(--z-sticky-header)' }}
        >
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="border-b border-border p-4 text-left font-bold">
                {title}
              </SheetTitle>
              <SidebarNav navItems={navItems} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <h1 className="font-semibold">{title}</h1>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>{userLabel.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm sm:inline">{userLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/">Back to site</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}