import {
  LayoutDashboard,
  Library,
  History,
  Bookmark,
  Receipt,
  Bell,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { DashboardShell } from './DashboardShell.jsx'

const navItems = [
  { to: '/me', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/me/library', label: 'My Library', icon: Library },
  { to: '/me/history', label: 'Reading History', icon: History },
  { to: '/me/bookmarks', label: 'Bookmarks & Favorites', icon: Bookmark },
  { to: '/me/orders', label: 'Orders & Receipts', icon: Receipt },
  { to: '/me/notifications', label: 'Notifications', icon: Bell },
  { to: '/me/chat', label: 'Support Chat', icon: MessageSquare },
  { to: '/me/security', label: 'Security Settings', icon: ShieldCheck },
]

export function ReaderShell() {
  return (
    <DashboardShell
      title="My Account"
      homeTo="/me"
      navItems={navItems}
      userLabel="Reader"
    />
  )
}