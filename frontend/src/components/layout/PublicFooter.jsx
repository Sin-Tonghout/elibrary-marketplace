import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { to: '/catalogue', label: 'Catalogue' },
      { to: '/categories', label: 'Categories' },
      { to: '/seller/apply', label: 'Sell your books' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/help', label: 'Help Center' },
      { to: '/contact', label: 'Contact Support' },
      { to: '/about', label: 'About / Developer' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
      { to: '/refund-policy', label: 'Refund Policy' },
      { to: '/seller-agreement', label: 'Seller Agreement' },
      { to: '/copyright-policy', label: 'Copyright / Takedown' },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              E-Library
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A digital library and e-book marketplace.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} E-Library Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  )
}