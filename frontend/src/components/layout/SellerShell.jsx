import {
  LayoutDashboard,
  BookPlus,
  Library,
  Wallet,
  Banknote,
  MessageSquare,
  UserCog,
} from 'lucide-react'
import { DashboardShell } from './DashboardShell.jsx'

const navItems = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/seller/listings', label: 'My Listings', icon: Library },
  { to: '/seller/listings/new', label: 'Create Listing', icon: BookPlus },
  { to: '/seller/earnings', label: 'Sales & Earnings', icon: Wallet },
  { to: '/seller/payouts', label: 'Payout Requests', icon: Banknote },
  { to: '/seller/messages', label: 'Buyer Messages', icon: MessageSquare },
  { to: '/seller/profile', label: 'Seller Profile', icon: UserCog },
]

export function SellerShell() {
  return (
    <DashboardShell
      title="Seller Workspace"
      homeTo="/seller"
      navItems={navItems}
      userLabel="Seller"
    />
  )
}