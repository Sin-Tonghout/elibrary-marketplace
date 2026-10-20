import { Outlet } from 'react-router-dom'
import { PublicHeader } from '../components/layout/PublicHeader.jsx'
import { PublicFooter } from '../components/layout/PublicFooter.jsx'
import { MobileBottomNav } from '../components/layout/MobileBottomNav.jsx'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  )
}