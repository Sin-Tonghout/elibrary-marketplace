# E-Library Marketplace — Full-Stack Build Blueprint

> **Project goal:** Build a polished, responsive digital-library and e-book marketplace where readers buy books, approved sellers list their own books, and the platform operates as the marketplace intermediary. The deliverable includes a complete public/user experience and a separately secured admin experience.
>
> **Primary stack:** React + Vite + Tailwind CSS + Laravel API + MySQL (AMPPS locally).
>
> **Build rule:** Complete one small phase, run its checklist, fix all blocking issues, and only then continue. Treat payment, digital-file access, account permissions, and backups as security-critical features.
> **Update note (17 October 2026):** Includes explicit Privacy Policy, searchable FAQ/Q&A Help Center, support-ticket workflow, privacy-request handling, and removal of a dedicated Librarian role from the initial marketplace scope.

### Current local development environment (confirmed 17 October 2026)

The following tools are already available on the developer's Windows computer. Keep these versions as the starting baseline and re-check them if commands behave differently later.

| Tool | Detected version / setting | Notes |
|---|---|---|
| Operating system / shell | Windows PowerShell | Working directory shown: `C:\Users\USER\Documents\WEBSITE` |
| Node.js | `v24.21.0` | Used by Vite and frontend build tools |
| npm | `11.19.0` | Package manager for the React frontend |
| Laravel Installer | `5.32.0` | The global Laravel project-creation command is installed. This is **not** the version of the Laravel framework inside an application. |
| Local database environment | AMPPS / MySQL | Local MySQL password is configured in AMPPS; use the actual local credentials in the ignored backend `.env` file. |

**Still verify before creating the app:** run `php -v`, `composer --version`, and confirm AMPPS MySQL starts. After the Laravel project is created, run `php artisan --version` from the backend folder to see the actual framework version. Node/npm/Laravel installer being available does not by itself prove PHP extensions, Composer dependencies, MySQL connectivity, or frontend compatibility are all correct.

---

## 1. Product Scope and Operating Model

### 1.1 Main user types

- **Guest:** Browse public books, categories, authors, publisher pages, featured collections, and public reviews. Can search, preview samples, register, and sign in.
- **Reader / Buyer:** Manage profile, wishlist, bookmarks, reviews, orders, receipts, purchases, reading progress, notifications, chat conversations, and account security. Can read purchased books within the access rules.
- **Seller / Author:** Apply to sell, complete a seller profile, upload book metadata/files/covers/previews, submit books for moderation, view sales and fee calculations, request payouts if the approved settlement model supports them, and respond to buyer questions.
- **Moderator:** Review book listings, files, categories, reviews, comments, and reports within explicitly assigned permissions. A separate Librarian role is not part of the initial marketplace scope; add one later only if institutional collections or dedicated catalog-curation staff become necessary.
- **Support agent:** Handle support conversations, order inquiries, payment investigations, and reports without unrestricted access to security or financial controls.
- **Admin:** Manage operational settings, users, content, transactions, security events, analytics, and announcements.
- **Super admin:** Manage roles, permissions, high-risk system settings, admin accounts, backup/restore approvals, and danger-zone actions. Use a small number of super-admin accounts.

A person may hold more than one business role (for example, reader and seller). Model roles and permissions rather than hard-coding one mutually exclusive `role` field for every possible combination.

### 1.2 Marketplace transaction model

Use a platform-managed marketplace ledger:

1. Seller submits a listing and proves they have permission to sell the content.
2. Admin/moderator approves it; only approved, active listings are purchasable.
3. Buyer places an order. Laravel creates a pending order and a payment attempt.
4. Laravel initiates an ABA PayWay checkout using server-side credentials.
5. PayWay confirms the result using the documented server verification/callback mechanism. The backend validates the result, amount, currency, merchant, order reference, and payment status.
6. A successful payment is processed idempotently: mark the order paid, record the payment, write the ledger entries, and grant the buyer a book entitlement.
7. The buyer can read/access the book through an authenticated, authorized route.
8. Seller proceeds remain pending until the platform's stated refund/dispute/settlement rules allow them to become available.
9. Seller requests a payout; an authorized admin reviews and approves it. Automatically splitting or paying sellers must not be assumed until ABA confirms that the merchant account, marketplace structure, payout feature, and Cambodian legal/commercial requirements support it.

**Important:** Do not describe an ordinary account balance as spendable cash until the business, PayWay, accounting, and applicable legal requirements for holding/transferring user funds have been confirmed. For the first release, it is safer to show *sales earnings ledger* and *payout request status* rather than allow users to deposit, transfer, or withdraw an unrestricted wallet balance.

### 1.3 Book rights and safety

- Require sellers to confirm they own the rights or have permission to distribute each book.
- Create a takedown/report process for copyright disputes.
- Review uploaded files before publication; enforce file size, MIME type, extension, and malware-scanning policy.
- Do not publish private storage URLs or place paid PDF/EPUB files in the public web root.
- Understand that browser-based reading cannot provide perfect DRM: if a browser can render content, a determined user may still capture it. Use controlled access, expiring links, watermarking where appropriate, and clear terms rather than claiming piracy is impossible.

---

## 2. Recommended Technology Stack

### 2.1 Core

| Area | Recommended choice | Reason |
|---|---|---|
| Frontend | React + Vite | Fast development, component-based UI, simple static frontend deployment |
| Styling | Tailwind CSS | Design tokens, responsive layouts, consistent spacing and typography |
| Components | shadcn/ui + Radix UI where suitable | Accessible, reusable components that can be customized rather than locked into a rigid theme |
| Icons | `lucide-react` | Consistent built-in icon library; avoid emoji as interface controls |
| Motion | `motion` (Motion for React) for selected animations | Page transitions and refined interactions; keep reduced-motion support |
| Routes | React Router | Public, reader, seller, and admin route groups |
| Server state | TanStack Query | API caching, pending/error states, and invalidation after mutations |
| Forms | React Hook Form + Zod | Reusable field validation and clear error messages |
| HTTP | Axios or a small typed `fetch` wrapper; choose one | Centralized CSRF handling, timeouts, and API error mapping |
| Charts | Recharts | Admin analytics charts and responsive dashboard visuals |
| Toasts | Sonner | Consistent success/error/info feedback |
| Backend | Laravel API (select a supported stable release when starting) | Validation, authorization, migrations, queues, notifications, APIs, payment integration |
| Authentication | Laravel Sanctum SPA cookie authentication | Secure same-site web session approach when frontend/API domains are configured correctly |
| Database | MySQL locally through AMPPS; managed MySQL-compatible DB for deployment | Fits the requested development environment |
| RBAC | `spatie/laravel-permission` | Roles, permissions, and permission checks |
| Realtime | Laravel Broadcasting + Laravel Reverb + Laravel Echo | Realtime chat, online status, and notifications |
| Queue/cache/rate-limit | Redis in production where supported | Offload email, Telegram, document processing, and other slow jobs; shared rate-limit state |
| Digital storage | Private S3-compatible object storage (Cloudflare R2 is a candidate) | Keep PDFs/EPUBs outside the public application folder |
| Search | Start with indexed MySQL search; add Meilisearch/another dedicated search engine only if needed | Avoid extra infrastructure before the core catalogue is stable |
| Bot challenge | Cloudflare Turnstile on selected public forms, with server-side verification | Adds friction for automated abuse; does not replace rate limiting |
| Deployment protection/CDN | Cloudflare in front of the public site where compatible | TLS, DNS, caching, and available security controls |
| Testing | Pest or PHPUnit for Laravel, React Testing Library + Vitest, Playwright for critical end-to-end paths | Test authorization and money/access workflows, not only appearance |

> Version rule: use compatible supported versions at project creation and commit lockfiles. Do not blindly upgrade major framework versions mid-project.

### 2.2 Authentication boundary

Use Sanctum's session/cookie approach for the first-party React site if practical. Configure HTTPS, session cookie flags, the correct stateful domains, CORS, and CSRF protection. Do **not** store long-lived authentication tokens in `localStorage` just to avoid configuring cookies. If frontend and API are hosted on unrelated domains, carefully plan the session/CORS setup before deployment.

### 2.3 Keep the initial stack small

Do not add every framework at the beginning. First build the UI shell, Laravel API, MySQL schema, authorization tests, and simple catalogue. Add Redis, Reverb, search engine, and background processing when their phases begin. This keeps the beginner path easier to debug.

---

## 3. Free Development and Deployment Strategy

“Free” is suitable for learning, demos, and early validation; it is **not a reliable promise for 5,000 concurrent users**.

| Need | Development / starting option | Production note |
|---|---|---|
| Local environment | AMPPS MySQL (`localhost`; local password as configured in AMPPS) | Never reuse a local database password in production |
| Frontend hosting | Cloudflare Pages or another static React host with a free tier | Static hosting is usually the easiest part to keep free; check current limits |
| Free project domain | A provider subdomain such as `*.pages.dev` where available | A custom `.com` or other registered domain is generally paid, even if some promotions exist |
| Managed MySQL-compatible database | TiDB Cloud Starter has a free MySQL-compatible quota, subject to current quotas/regions/features | Verify Laravel/MySQL feature compatibility and current terms. Hitting quotas may block new connections; free-tier backups/retention are limited |
| Book/file storage | Cloudflare R2 has a monthly free allowance for some storage and operations | Meter PDF/EPUB download and reader traffic. Keep paid book objects private; use server-authorized access or short-lived signed URLs |
| Email | A development mail catcher / sandbox; later choose a transactional mail provider | Do not rely on a personal Gmail account as high-volume production transactional mail. Provider sending limits and domain verification matter |
| CAPTCHA / bot checks | Cloudflare Turnstile free plan | Always validate the challenge on the server and also apply endpoint rate limits |
| Realtime chat | Run Reverb locally; consider a managed WebSocket service or properly sized Reverb server later | Hosting must support long-running processes, WebSockets, process supervision, and enough file descriptors/connections |
| Laravel API / queue workers | Local AMPPS/PHP for development | Select a PHP hosting service that supports the chosen Laravel/PHP version, queue workers, scheduled jobs, private storage, and WebSockets. Many hobby/free web services sleep or do not support required worker features |
| Payments | ABA PayWay sandbox | Production merchant credentials and live processing are subject to ABA onboarding/approval and applicable fees |

### Practical starter combination

- **Frontend:** Cloudflare Pages (free subdomain for development/demo).
- **Backend:** Local Laravel during implementation; then a PHP-capable deployment target selected after verifying queues, storage, scheduler, WebSockets, and scaling needs.
- **Database:** AMPPS MySQL locally. For a free remote development database, evaluate TiDB Cloud's MySQL-compatible Starter quota, but run migrations and integration tests against it before relying on it.
- **Files:** Local private storage locally, then a private R2 bucket or another S3-compatible service.
- **Payments:** ABA sandbox until end-to-end tests pass and the merchant is approved for production.

Do not commit secrets into GitHub. Keep `.env` out of source control, commit `.env.example` with placeholders, and set production secrets in the deployment provider.

---

## 4. UX/UI Design System

### 4.1 Product visual direction

**Direction:** Editorial digital library — calm, readable, premium, and modern. The books should be visually dominant; dashboards should be clear rather than decorative.

Suggested starting palette (change only after testing contrast):

- **Primary:** deep forest green `#176B52`
- **Primary hover:** `#115541`
- **Secondary:** sage `#DDECE4`
- **Accent:** warm amber `#E8AD55` for limited highlights
- **Page background:** `#F7F8F5`
- **Surface/card:** `#FFFFFF`
- **Main text:** `#1E2924`
- **Muted text:** `#66736C`
- **Border:** `#E2E8E3`
- **Success:** `#1F7A4D`
- **Warning:** `#A96512`
- **Danger:** `#B42318`

Use a 60/30/10 approach: about 60% neutral backgrounds, 30% primary/surface structure, and 10% accent/highlight. Status colors must retain meaning and contrast in both themes. Do not use color as the only status indicator.

### 4.2 Typography and layout tokens

- Font: `Inter` or another legible sans-serif for UI; keep body and headings consistent.
- Body: 16px base; line height around 1.5–1.7 for reading-related text.
- Small supporting text: usually at least 12–14px; do not use tiny text for critical errors or prices.
- Main content maximum width: approximately 1200–1440px depending on the page.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Card radius: 12–16px; input radius: 8–12px; button height typically 40–48px.
- Book covers should use a consistent portrait ratio, preserve cover art, and have fallback covers.
- Use responsive grids that adapt to available width; do not force desktop columns onto mobile.
- Define z-index tokens for sticky header, popovers, modal, toast, reader toolbar, and chat launcher to prevent layering bugs.

### 4.3 Required UI states for every data component

Every page and reusable component that loads or mutates data must account for:

1. Initial loading state.
2. Skeleton state when useful for repeated content such as book cards and dashboard tables.
3. Empty state with a relevant explanation and next action.
4. Error state with a retry path and a non-sensitive message.
5. Success/complete state for forms and transactions.
6. Disabled/pending state to prevent duplicate submissions.
7. Responsive behavior and keyboard accessibility.
8. Permission-denied state where a user lacks access.

Never show fake progress indefinitely. For screen-level boot loading, use a short branded loading shell only when it reflects real initialization; use skeletons for page content. Respect `prefers-reduced-motion` and do not animate every element.

### 4.4 Animation rules

- Short transitions, usually around 150–250ms for small interactions.
- Use page transitions sparingly; avoid delaying navigation for decoration.
- Animate skeleton shimmer only if it does not cause excessive motion; offer a reduced-motion alternative.
- Use small hover/focus states on cards, buttons, tabs, dropdowns, and menus.
- For reader mode, prioritize reading comfort and avoid distracting movement.
- For charts, animate on initial entry only where it helps understanding.
- Keep loading indicators and errors visible to assistive technology.

### 4.5 Component library to create before pages

Create shared components rather than copying markup across pages:

- `AppShell`, `PublicHeader`, `PublicFooter`, `ReaderShell`, `SellerShell`, `AdminShell`, `MobileBottomNav`.
- `PolicyPageLayout`, `PrivacyPolicySection`, `PolicyLastUpdated`, `FAQSearch`, `FAQCategoryTabs`, `FAQAccordion`, `HelpfulVote`, `SupportTicketForm`, `SupportTicketStatus`, `ContactSupportCard`.
- `PageHeader`, `Breadcrumbs`, `SectionHeading`, `Container`, `ResponsiveGrid`.
- `Button`, `IconButton`, `Input`, `PasswordInput`, `SearchInput`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `FileUpload`, `FormField`, `FieldError`.
- `Dialog`, `ConfirmDialog`, `Drawer`, `DropdownMenu`, `Tabs`, `Tooltip`, `Popover`, `CommandPalette`.
- `BookCard`, `BookCover`, `BookListItem`, `BookCarousel`, `AuthorCard`, `PublisherBadge`, `RatingStars`, `PriceLabel`, `AvailabilityBadge`.
- `Table`, `DataTable`, `Pagination`, `FilterBar`, `SortMenu`, `BulkActionToolbar`.
- `Skeleton`, `BookCardSkeleton`, `TableSkeleton`, `DashboardCardSkeleton`, `PageLoader`, `InlineLoader`, `EmptyState`, `ErrorState`, `ErrorBoundary`.
- `Toast`, `NotificationBell`, `UnreadCounter`, `Avatar`, `UserMenu`, `ThemeToggle`, `LanguageToggle` (if multilingual support is in scope).
- `StatCard`, `ChartCard`, `DateRangeFilter`, `DownloadButton`, `ExportMenu`.
- `ChatLauncher`, `ConversationList`, `MessageBubble`, `MessageComposer`, `TypingIndicator`, `OnlineBadge`.
- `ReaderToolbar`, `ReaderSettings`, `ReadingProgress`, `BookmarkButton`, `TableOfContents`, `PreviewWatermark`.

Each component must have a clear prop contract and be independently usable. Avoid a single enormous component with many unrelated boolean props. Keep primitive UI components in one layer and domain-specific book/order components in another.

---

## 5. Public Site, Reader Site, Seller Site, and Admin Site

### 5.1 Public discovery pages

- Home: search-first hero, featured books, new arrivals, popular titles, categories, trusted seller/author highlights, latest news, footer.
- Catalogue/search: keyword search, filters for category, author, publisher, language, format, price, rating, release year, and availability.
- Book details: cover, title, authors, publisher, ISBN/identifier where appropriate, description, categories/DDC number, rating/reviews, format, price, preview samples, rights/licence statement, seller details, related titles, and CTA.
- Author and publisher profiles.
- Category and DDC browsing pages.
- About, Developer, Contact/Support, searchable FAQ / Help Center (Q&A), Privacy Policy, Terms of Service, Refund Policy, Seller Agreement, and Copyright/Takedown Policy. Privacy and help pages must have readable mobile layouts, accessible navigation, and useful empty/error states.
- Login, sign-up, forgot password, reset password, and account verification pages.

### 5.2 Reader account

- Overview/profile settings.
- Purchased library with filters and last-read information.
- Online reader for authorized PDF/EPUB content.
- Reading history, bookmarks, favorites, and reading progress.
- Orders, payment status, receipts, refunds/disputes (according to policy).
- Notifications, announcements, and realtime support chat.
- Review/rating/comment management for the reader's own content.
- Security settings: active sessions, password update, optional passkey/MFA, account recovery.

### 5.3 Seller workspace

- Seller onboarding and identity/business verification fields appropriate to the business.
- Listing list with draft, under review, approved, rejected, archived states.
- Book creation wizard split into metadata, cover, preview, full file, licence confirmation, pricing, and submit.
- File processing/progress and validation feedback.
- Sales dashboard, orders/sales history, commission breakdown, pending and available earnings, payout requests, statements, and payout status.
- Buyer questions/support conversations and moderation messages.
- Do not expose personal buyer data to sellers beyond what is necessary for a lawful transaction.

### 5.4 Admin shell and navigation

Use an admin-specific shell with a collapsible sidebar, clear active route, breadcrumb, top bar, global search, notification center, admin profile, theme toggle, and confirmation for dangerous actions. On small screens, turn the sidebar into a drawer. Avoid showing every module at once; group it into well-named navigation sections.

**Admin overview:** key metrics, sales and payment trend, orders, user/seller growth, books pending review, reports/complaints, failed payment callbacks, queued jobs, suspicious authentication activity, storage consumption, and system health. Dashboard numbers must come from real API data, with a time range and empty states.

### 5.5 Privacy Policy, FAQ / Q&A Help Center, and Support

#### Privacy Policy page

Create a public `/privacy` page that does not require sign-in. It should be readable on mobile, searchable if the policy becomes long, accessible by keyboard and screen reader, and linked from the public footer, registration, checkout, and account settings where relevant. Show the policy's **last updated** date and version. Keep published policy changes auditable in the CMS.

The policy must describe the actual implementation rather than copy generic legal text. Before launch, replace all placeholders and get suitable legal review for the business's operating jurisdictions. Cover, as applicable:

- What data the service collects: account/contact details, seller-submitted identity/business details, book listings/uploads, purchase and payment references, support messages, reading progress/history, device/session data, and security/IP logs.
- Why each category is used: account access, book delivery, payments/refunds, seller operations, support, abuse prevention, service reliability, and optional analytics/marketing if implemented.
- Which providers receive data and why, such as Google sign-in, ABA PayWay, email delivery, hosting/database/storage, realtime chat, and anti-bot services. Do not claim the platform stores card details if the payment provider handles them.
- Data retention, deletion and backup-retention limits; security practices and their limits; international data transfers if applicable; minors/age rules if applicable; policy changes; and a privacy contact channel.
- Available user choices and requests, such as correcting account details, requesting an export, closing an account, or asking about personal data. Explain that legally required transaction/audit records may need to be retained after account closure where applicable.
- Cookie/session explanations. Add a preference control for non-essential analytics/marketing cookies only if those technologies are actually used and consent is required. Essential authentication/session cookies must be explained accurately.

Do not present a checkbox saying “I consent to the Privacy Policy” as a substitute for a proper notice or for legally required, separate consent. Record acceptance of Terms/Seller Agreement versions when needed; collect consent separately for optional purposes where required. Never publish internal security procedures, secrets, private keys, unredacted logs, or personal information in the policy.

#### FAQ / Q&A Help Center

Create a public `/help` or `/faq` page with searchable questions grouped by categories such as Accounts & Login, Buying Books, Reading & Downloads, Selling Books, Payments & Receipts, Refunds & Disputes, Payouts, Copyright/Reporting, Privacy & Security, and Technical Problems.

- Each FAQ entry has a clear question, concise answer, category, publication status, sort order, updated date, and optional related links.
- Support search, category filtering, accordion expansion, keyboard access, mobile layout, no-results guidance, and useful loading/error states.
- Add “Was this helpful?” feedback and an “Still need help?” next step that opens a support form or authenticated ticket/chat. Do not expose names or private ticket details publicly.
- Provide a contact/support entry point even when a search returns no answer. Public forms need server-side validation, spam protection, rate limiting, a safe reply channel, and a generic success response that does not reveal account existence.
- Signed-in users can view only their own tickets and replies, their status, ticket number, and expected response guidance. Staff access must be role-limited and audited. Use a separate ticket workflow for cases that need assignment, status, and resolution; realtime chat can remain available for conversations.

#### Admin and data workflow

- CMS staff with the right permissions can draft, preview, publish, archive, and version FAQs and policy pages. Changes to policy content and publication status are audited.
- Support staff can assign, categorize, prioritize, respond to, and close tickets. They should see only personal data needed to resolve the case; finance/security actions require separate permissions.
- Users can submit privacy requests from account settings. Verify the requester, track status, enforce access checks, respond within the policy-defined process, and audit completion. Never allow a ticket or privacy request to bypass account ownership checks.
- Telegram notifications may alert staff to a new high-priority ticket, but must not include full private message bodies, passwords, reset links, personal data dumps, or private book URLs.

---

## 6. Admin Modules — Required Feature Groups

All admin APIs need backend authorization, validation, pagination, audit logging for sensitive changes, and tests. A hidden URL is not an authorization system.

### A. Dashboard and analytics
- Revenue, gross order value, platform commission, refunds, seller payable ledger, and order counts.
- New users/sellers, active readers, popular books, reader engagement, and conversion indicators.
- Date filters, chart legends, CSV export with permission checks, and clear definitions for every metric.
- System health indicators for queue failures, payment callback errors, WebSocket status where available, storage usage, and error rates.

### B. User and organization management
- Reader/member profiles, seller accounts, organizations if needed, user status, verification, suspension, account deletion workflow, and support notes.
- Search/filter by status, role, date, seller status, and risk flags.
- Admins must not see passwords or raw reset tokens. Mask personal data by default when it is not needed.

### C. Role-based access control (RBAC)
- Roles such as Super Admin, Admin, Catalog Manager, Moderator, Finance, Support, and Analyst.
- Fine-grained permissions such as `books.approve`, `payments.refund`, `payouts.approve`, `roles.manage`, `backups.restore`.
- Check permissions on the Laravel backend for every protected action; frontend hiding is only a usability detail.
- Require elevated confirmation and ideally reauthentication for high-risk changes.

### D. Book and catalogue management
- Digital Book Management, Categories, Author Management, Publisher Management, DDC Classification, Book Catalog Management.
- PDF/EPUB file metadata, checksums, file version, storage state, upload scan state, and file replacement history.
- Book Covers, Preview Management, featured books, new arrivals, popular books, book recommendations, content warnings, language, ISBN/identifiers, license/rights records, publishing status, and moderation notes.
- Bulk import/export with strict validation and preview-before-apply.

### E. Reading and engagement management
- Member management, Reading Access Management, Online Reader Management, Download Management, Reading History, Bookmarks, Favorites, Reviews & Ratings, Comments, and moderation queues.
- Borrowing/Digital Access Management only if the business later adds temporary loans, lending periods, renewals, and limits. Do not make purchased access behave like an unrequested borrowing system.
- Show privacy-aware aggregate analytics; limit staff access to private reading history.

### F. Sales, payments, billing, and subscriptions
- Orders, Payment Management, transaction status, failed/retried callbacks, refunds, disputes, platform commissions, seller earnings ledger, payout requests, payout reconciliation, receipts, and audit history.
- Billing/subscription management if subscriptions are introduced. Implement it as a separate entitlement model so it does not break one-time purchases.
- All money movements are ledger-based and auditable; do not edit a posted transaction in place. Use reversing/adjustment entries with reason and actor.
- Finance permissions must be distinct from book moderation permissions.

### G. Notifications, content management, and support
- Notifications Management, Announcements & News, Website Content Management, FAQ, email templates, legal/policy content, user reports, support chat assignment, canned replies, and contact form management.
- Telegram alerts for important operational events, not every event. Never send full passwords, reset links, private book URLs, access tokens, or card/payment secrets into Telegram.

### H. Security, audit logs, and operations
- Admin Activity Logs, Security Management, login/session events, suspicious IPs, rate-limit events, failed payment verification, permission changes, data exports, backup jobs, restore records, system settings, and Profile Settings.
- Database Backup & Restore with offsite encrypted backups, access control, retention policy, test-restore drills, and explicit confirmation for restore. Do not allow an admin browser request to execute arbitrary shell/database commands.
- Danger Zone: disable/delete account, revoke sessions, unpublish catalog items, initiate approved refunds, or request restore. Require permission + reason + confirmation and log the action.
- Profile settings, admin security settings, and logout.

---

## 7. Authentication and Account Security Design

### 7.1 Reader sign-in requirements

- Support username **or** email + password, and Google sign-in.
- Sign-up with email/password or Google account, with verified email before sensitive features (for example, seller onboarding or payout changes).
- Add a four-digit visual challenge beneath the username/email field only if desired, but treat it as a **small anti-bot challenge, not an authentication factor**. Four digits have only 10,000 combinations and do not prove identity.
- Generate and validate the challenge on the server, bind it to a short-lived session/challenge ID, expire it quickly, cap attempts, and consume it after success. Refresh and failed validation may issue a new challenge as requested. Do not generate the answer only in React, because users can inspect client-side code.
- Prefer Cloudflare Turnstile on suspicious/repeated attempts or on public auth forms. Validate the token server-side. Always apply backend rate limits regardless of challenge type.
- Use generic login failure messages such as “The details could not be verified” to reduce account enumeration. Show field-level guidance without revealing whether an email exists.

### 7.2 Admin sign-in

- A non-obvious dedicated path (for example `/control-room/sign-in`) can reduce casual discovery, but it is only an extra obscurity layer.
- Keep administrator role/permission records on the backend. The normal public sign-in endpoint must not grant admin panel access. A user signing in through the normal form remains a normal user unless the backend verifies an authorized admin role and the request is authenticated appropriately.
- Use a separate admin route group, backend middleware, separate authorization tests, and optional separate admin guard/session policy if it fits the selected architecture.
- Do not show the reader's four-digit challenge on the admin form as requested; compensate with mandatory MFA/passkeys or TOTP for admin users, stricter rate limits, alerts, and login-session controls.
- Never depend on hidden links, route names, React route guards, or a secret path alone. Direct API requests must still receive 401/403 when unauthorized.

### 7.3 Password reset and Google sign-in

- Forgot-password flow sends a short-lived, single-use reset link by email; response should not confirm whether an account exists.
- Store reset tokens securely (hashed if the implementation allows) and invalidate old tokens on reset. Notify the user after password change and optionally revoke other sessions.
- Google OAuth must validate the returned identity on the server, including signature/issuer/audience and verified-email claims as appropriate. Link accounts carefully to avoid account takeover when emails conflict.
- Google sign-in and Gmail/transactional email sending are separate integrations. Configure a transactional mail provider with SPF/DKIM/DMARC for production deliverability; a personal Gmail SMTP setup is not a long-term bulk-email architecture.

### 7.4 Required protections

- Password hashing with Laravel's supported password hasher; no plaintext or reversible passwords.
- Secure, HttpOnly, SameSite cookies; HTTPS in production; CSRF protection for cookie-authenticated requests.
- Brute-force rate limits by account identifier and IP/network signal, progressive cooldown, Turnstile challenge escalation, and monitored lockout behavior that attackers cannot abuse to permanently lock out victims.
- Server-side validation and authorization on every write/read of protected data.
- Parameterized database access via Eloquent/query builder; escape/sanitize rich content where necessary; secure file uploads and downloads.
- Secrets in environment/secret manager; rotate any credential that was committed or shared.
- Avoid verbose production errors, stack traces, directory listings, permissive CORS, wildcard credentialed origins, and debug mode.
- Keep Laravel/React dependencies patched and run dependency/security checks regularly.

---

## 8. Realtime Chat and Notifications

### Chat behavior

- Private one-to-one conversations for reader/support and buyer/seller where enabled.
- Server-side conversation membership checks for joining, reading, and sending messages.
- Message states: sent, delivered/read if implemented; pagination; retry; offline state; unread count; typing indicator only if it does not overload the system.
- File attachments should be optional and delayed until text chat is secured. If added, scan and limit file type/size.
- Users may block/report conversations. Admin/moderator access must be governed by a documented support/privacy policy and audit logs.

### Architecture

- Use Laravel Broadcasting + Reverb + Laravel Echo for WebSocket events.
- Save messages to the database before broadcasting. Broadcasting is a notification channel, not the source of truth.
- Use private/presence channels with backend authorization; never broadcast private message content to a public channel.
- Persist notifications; WebSockets should update the UI quickly, while an inbox endpoint provides recovery after reconnect.
- Use queues for notification email and Telegram delivery, with retry/backoff and failure monitoring.

### Telegram bot alerts

Alert examples: repeated payment callback failures, new payout request, suspicious login spike, critical backup failure, severe application error, new seller submitted for review.

- Store bot token in environment secrets.
- Use a dedicated private admin group with restricted membership.
- Include event ID, severity, timestamp, and a link to the authenticated admin dashboard; avoid leaking secrets or excessive personal data.
- Add deduplication/throttling so one incident does not produce thousands of Telegram messages.

---

## 9. Payment, Orders, Platform Commission, and Seller Earnings

### 9.1 Data/state flow

Suggested order states: `pending_payment`, `paid`, `payment_failed`, `cancelled`, `refund_pending`, `partially_refunded`, `refunded`, `disputed`.

Suggested listing states: `draft`, `pending_review`, `approved`, `rejected`, `unpublished`, `archived`.

Suggested earnings states: `pending`, `available`, `payout_requested`, `payout_processing`, `paid_out`, `held`, `reversed`.

Use explicit state transitions in backend services; do not let frontend forms set arbitrary status strings.

### 9.2 Core payment rules

- Calculate price, fee, commission, currency, and payable totals on the backend.
- Store integer minor currency units (for example, cents where applicable) or a fixed-precision decimal strategy; never use binary floating-point for financial arithmetic.
- Each order/payment attempt has a unique server-generated reference.
- Verify callback signatures/fields and use the PayWay documentation's exact server-verification mechanism. Do not assume the browser redirect is proof of payment.
- Make the callback idempotent. Repeated successful callbacks must not create multiple entitlements, ledger entries, or notifications.
- Record raw callback payload only if permitted and necessary; redact secrets and limit access/retention.
- Reconcile internal transactions against PayWay's transaction reporting.
- Handle timeout, cancel, duplicate notification, late success, amount mismatch, currency mismatch, and refunded payment cases.
- Unlock books only after confirmed server-side payment. On failed/unknown status, keep access locked and show a clear pending/retry state.
- Never store card details unless an explicitly compliant, approved requirement demands it; use the payment provider's secure flow.

### 9.3 Platform commission and seller settlements

- Store the commission-rate snapshot on each order/ledger transaction so future rate changes do not rewrite history.
- Use append-only ledger entries, with original order reference and adjustment reason.
- Maintain seller earnings as calculated ledger balances rather than a single editable balance column.
- Before launch, define refund windows, chargebacks/disputes, buyer protection, seller payout schedules, tax/accounting treatment, seller identity checks, and what happens when a seller account is suspended.
- Confirm with ABA whether the specific merchant account can support marketplace sales, automatic confirmation, and seller payouts/multi-party settlement. Build the payout automation only after this is confirmed and tested in the correct environment.

---

## 10. Digital Reading and File Access

### Upload pipeline

1. Seller creates metadata draft.
2. Browser requests an upload policy or signed upload URL for a private object.
3. Server checks seller permission, quota, file type, size, and listing ownership.
4. File is stored privately with a generated key, not a user-provided path.
5. Background job checks integrity and optional malware scan, extracts metadata where safe, and generates previews/thumbnails.
6. Listing enters moderation only when required files are processed.
7. Admin approves; then the listing may become searchable/purchasable.

### Reading/download route

- Verify authenticated user + paid entitlement + active listing/access status on the backend.
- Return a short-lived signed URL or proxy the content through a protected delivery route depending on access-control and performance requirements.
- Do not expose storage credentials or permanent private object URLs.
- Record privacy-aware access events for fraud/support, with retention limits.
- For previews, store separate preview assets with the allowed pages/sections and a visible preview mark if appropriate.
- PDF viewer: select a maintained React PDF/PDF.js integration compatible with your build. EPUB viewer: use an established EPUB rendering library. Test large files, mobile view, table of contents, font size, progress saving, page/section navigation, and inaccessible/corrupt files.
- Consider range requests/streaming for large PDFs and EPUBs, and CDN strategy for authorized delivery.

---

## 11. Suggested Repository and Folder Structure

```text
elibrary-marketplace/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/                 # app setup, providers, router
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/              # reusable primitives
│   │   │   ├── layout/          # shells, nav, footer
│   │   │   ├── books/
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   ├── feedback/        # skeleton, empty, error, toast
│   │   │   └── chat/
│   │   ├── features/
│   │   │   ├── help-center/
│   │   │   ├── privacy/
│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── reader/
│   │   │   ├── seller/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   └── admin/
│   │   ├── hooks/
│   │   ├── lib/                 # API client, helpers
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── types/
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── Actions/             # focused business actions
│   │   ├── Events/
│   │   ├── Http/Controllers/Api/
│   │   ├── Http/Middleware/
│   │   ├── Http/Requests/        # validated request objects
│   │   ├── Jobs/
│   │   ├── Listeners/
│   │   ├── Mail/
│   │   ├── Models/
│   │   ├── Notifications/
│   │   ├── Policies/
│   │   └── Services/             # ABA, Telegram, file access
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/api.php
│   ├── routes/channels.php
│   ├── storage/
│   ├── tests/Feature/
│   ├── tests/Unit/
│   └── .env.example
├── docs/
│   ├── design-system.md
│   ├── database-schema.md
│   ├── api-contract.md
│   ├── security-model.md
│   ├── privacy-data-inventory.md
│   ├── help-center-and-support.md
│   ├── payment-state-machine.md
│   ├── deployment.md
│   └── test-plan.md
├── .gitignore
└── README.md
```

Keep the React and Laravel projects separated so the app can be built/deployed independently. The code may use `frontend/` and `backend/` in one Git repository.

---

## 12. Database Design — First-Pass Entity List

Use migrations and foreign keys. This is an entity inventory, not a command to create every table before the corresponding feature phase.

### Identity and access

- `users`: id, username, name, email, email_verified_at, password, status, avatar_path, locale, theme, timestamps.
- `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions` (or package-managed equivalent).
- `user_profiles` if profile fields become too large for `users`.
- `seller_profiles`: user_id, public display name, verification/status fields, agreement acceptance, timestamps.
- `sessions`/auth device metadata only as needed; never save secrets or raw reset tokens.
- `login_events`: user_id nullable, event type, IP/network metadata, user agent, success, risk signal, timestamp, retention rules.
- `email_verification`/password reset structures according to Laravel's supported implementation.

### Catalogue and content

- `books`: seller_id, slug, title, subtitle, description, language, publication_year, ISBN/identifier, status, price_minor, currency, licence/rights confirmation, approved_by, approved_at.
- `book_authors`, `authors`, `publishers`, `categories`, `book_categories`, `ddc_classifications`.
- `book_assets`: book_id, asset type (`cover`, `preview`, `pdf`, `epub`), private object key, MIME type, size, checksum, scan/processing status, version.
- `book_previews` or a well-defined preview asset relationship.
- `book_moderation_events` with moderator, decision, reason, and timestamp.
- `featured_books`, editorial collections, CMS pages, announcements, versioned terms/policies.
- `faq_categories`, `faq_items` (question, answer, status, category, sort order, helpful-count metadata, publication timestamps).

### Commerce and financial records

- `orders`, `order_items`, `payment_attempts`, `payments`, `refunds`, `disputes` where in scope.
- `commission_rules` and per-order commission snapshots.
- `ledger_accounts`, `ledger_entries`, `payout_requests`, `payout_attempts`, `payout_reconciliation_items`.
- `entitlements` or `book_access_grants`: user_id, book_id/order_item_id, access type, grant status, granted_at, revoked_at.
- `subscriptions`, `subscription_plans`, and subscription entitlements only if recurring subscriptions are approved for the product.

### Reading/social

- `reading_progress`, `reading_history`, `bookmarks`, `favorites`, `reviews`, `comments`, `reports`.
- Keep unique constraints for one active favorite/bookmark record where appropriate; enforce review rules through validation and database constraints where possible.

### Chat, help center, privacy, alerts, and operations

- `conversations`, `conversation_participants`, `messages`, `message_attachments` (only if attachments are added), `notifications`, `notification_preferences`.
- `support_tickets` and `support_ticket_messages` for non-realtime case tracking, ticket number, category, priority, status, assigned staff member, related order/payment where applicable, and resolution timestamps. Do not duplicate every chat message into a ticket table; link records where useful.
- `privacy_requests` for authenticated data-access, data-export, correction, and account-deletion requests, including status, requester, reviewer, outcome, and timestamps. Avoid storing unnecessary copies of sensitive personal data in the request record.
- `policy_versions` or versioned CMS records for policy type, version, publication/effective date, content, and status. Record user acceptance only for terms or agreements where a recorded acceptance is actually required.
- `admin_audit_logs`, `security_events`, `webhook_events`, `failed_jobs`, `backup_runs`, and system settings.

### Data rules

- Use UTC in storage and localize for display.
- Index foreign keys, slugs, order reference, payment reference, statuses, and frequent filter/search columns.
- Add unique constraints to prevent duplicate payment processing and duplicate entitlement grants.
- Use soft deletes only where appropriate; financial/audit records usually need append-only history rather than ordinary deletion.
- Avoid storing computed balances as the only financial truth. Use ledger entries and reconcile their sum.
- Design retention and deletion rules for personal data and chat/reading history.

---

## 13. API Design Conventions

Base path example: `/api/v1`. Use consistent JSON response shapes, validation errors, pagination metadata, and status codes. Document requests/responses in `docs/api-contract.md`.

Suggested route groups (not the complete implementation):

```text
GET    /api/v1/books
GET    /api/v1/books/{slug}
GET    /api/v1/categories
GET    /api/v1/authors/{slug}
GET    /api/v1/help/faqs
GET    /api/v1/help/faqs/{slug}
POST   /api/v1/support/contact              # public contact form; validate and rate-limit
POST   /api/v1/me/support/tickets            # authenticated support ticket
GET    /api/v1/me/support/tickets
GET    /api/v1/me/support/tickets/{ticket}
POST   /api/v1/me/privacy-requests           # authenticated data/account request
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/google
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/me
GET    /api/v1/me/library
GET    /api/v1/me/orders
GET    /api/v1/me/notifications
POST   /api/v1/orders
GET    /api/v1/orders/{order}
POST   /api/v1/payments/aba/checkout
POST   /api/v1/payments/aba/callback   # configure exactly as ABA documents require
GET    /api/v1/reader/books/{book}/access
GET    /api/v1/seller/books
POST   /api/v1/seller/books
POST   /api/v1/seller/books/{book}/submit
GET    /api/v1/seller/earnings
POST   /api/v1/seller/payout-requests
GET    /api/v1/conversations
POST   /api/v1/conversations/{conversation}/messages

# Admin routes must be protected by backend auth + permission middleware
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
GET    /api/v1/admin/books/pending-review
POST   /api/v1/admin/books/{book}/approve
POST   /api/v1/admin/books/{book}/reject
GET    /api/v1/admin/orders
GET    /api/v1/admin/payments
POST   /api/v1/admin/refunds
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/security-events
GET    /api/v1/admin/faqs
POST   /api/v1/admin/faqs
PATCH  /api/v1/admin/faqs/{faq}
GET    /api/v1/admin/support/tickets
PATCH  /api/v1/admin/support/tickets/{ticket}
GET    /api/v1/admin/privacy-requests
PATCH  /api/v1/admin/privacy-requests/{request}
```

Never rely on IDs from the browser without checking ownership. Use policies or authorization services consistently. Return 404 instead of confirming a record exists when that improves privacy and does not conflict with the API's needs.

---

## 14. Build Plan — Small Phases with Exit Criteria

**Phase rule:** Do not move forward until the phase's exit criteria are met and its tests are green. UI-only placeholders can be used early, but mark them clearly and never treat a mock as completed business logic.

### Phase 0 — Scope, policies, and setup

**0.1** Confirm MVP: reader, seller listing, moderation, one-time purchase, authorized reader, order history, admin management.

**0.2** Write marketplace rules: seller eligibility, copyright, commission, refunds, payout timing, complaints, subscription scope, and content policy.

**0.3** Decide whether seller payouts are manual at launch; obtain ABA answers about the merchant/marketplace use case.

**0.4** Draw public, reader, seller, admin, and payment flows in `docs/`.

**0.5** Create a data inventory showing what personal data is collected, why it is needed, who receives it, retention/deletion rules, and which staff roles can access it. Decide how privacy requests are handled.

**0.6** Define FAQ categories, support contact/ticket workflow, response expectations, escalation rules, and staff access boundaries. Draft Privacy Policy, Terms, Refund Policy, Seller Agreement, and Copyright/Takedown Policy from the actual product behavior; mark them as drafts until reviewed.

**0.7** Create Git repository, branch strategy, `.gitignore`, `.env.example`, and README. Ensure real secrets are never committed.

**Exit checklist:** Scope and transaction flow are written; no unresolved assumption about whether the platform can legally/contractually receive marketplace payments is hidden in the code plan.

### Phase 1 — Install and validate the development environment

**Known starting point:** Node.js `v24.21.0`, npm `11.19.0`, and Laravel Installer `5.32.0` are already installed in Windows PowerShell. Do not reinstall them unless a project requirement or a confirmed error makes that necessary.

**1.1** From `C:\Users\USER\Documents\WEBSITE`, run `node -v`, `npm -v`, and `laravel --version` (or `laravel` if that is the command that displays the installer version). Confirm the output matches the baseline above.

**1.2** Run `php -v` and `composer --version`. If either command is not found, fix the PHP/Composer PATH or use the PHP/Composer installation provided by your AMPPS setup before continuing. Confirm the PHP version and required extensions meet the requirements of the Laravel framework version you choose.

**1.3** Start AMPPS MySQL and verify a connection. Create a local database named `elibrary_marketplace`; keep the username/password in the backend `.env`, not in source code.

**1.4** Use the installed Laravel Installer to create the backend project. After scaffolding, enter the backend folder and run `php artisan --version`; this reports the framework version, which may differ from installer version `5.32.0`. Configure `.env` for the local database and run the initial migration.

**1.5** Create the React + Vite frontend with npm and install Tailwind CSS using the official setup that matches the selected Vite/Tailwind versions. Keep `package-lock.json` committed so dependencies can be reproduced.

**1.6** Add React Router, TanStack Query, React Hook Form, Zod, `lucide-react`, and the selected component library. Add dependencies in small groups and run the frontend after each group.

**1.7** Add the Laravel `/up` health check and a simple `GET /api/v1/health` response.

**Exit checklist:** Node/npm/Laravel installer are verified; PHP and Composer are available; frontend starts; Laravel starts; actual Laravel framework version is recorded; database connection works; a test migration succeeds; health endpoints respond; and Git shows no `.env` files tracked.

### Phase 2 — Design system and visual foundations

**2.1** Create `design-system.md` with colors, typography, scale, radius, shadows, z-index, breakpoints, and reduced-motion rules.

**2.2** Add light and dark theme tokens and persist the chosen theme safely as a preference (not a security setting).

**2.3** Build button, input, select, textarea, form field, checkbox, tooltip, dialog, tabs, dropdown, toast, skeleton, empty/error state, and spinner.

**2.4** Build PublicHeader, Footer, ReaderShell, SellerShell, and AdminShell.

**2.5** Build `PolicyPageLayout`, FAQ search/accordion, helpful vote, support form/ticket status, and contact-support entry components.

**2.6** Test components at mobile, tablet, desktop, keyboard-only, zoom, and reduced-motion settings.

**Exit checklist:** No major horizontal overflow at 360px width; all controls have focus/disabled/error states; theme works; typography and spacing use tokens.

### Phase 3 — Public landing and catalogue UI using mock data

**3.1** Build home-page sections and shared book cards.

**3.2** Build category, search results, author, publisher, and book detail layouts.

**3.3** Add filter/sort UI, page skeletons, no-results state, and error/retry state.

**3.4** Make responsive navigation and mobile filters.

**3.5** Build public Privacy Policy, Terms, Refund Policy, Seller Agreement, Copyright/Takedown, FAQ/Help Center, Contact Support, and About/Developer page layouts using clearly marked mock content.

**3.6** Replace emoji controls with Lucide icons and ensure semantic labels.

**Exit checklist:** All public layouts are responsive, keyboard navigable, and visually consistent. Privacy/help links work without sign-in, mock content is clearly isolated from real policy text, and FAQ search has loading, no-results, and error states.

### Phase 4 — Database schema and seed data

**4.1** Implement users, roles/permissions, categories, authors, publishers, books, and book assets.

**4.2** Add foreign keys, unique constraints, indexes, factories, and seeders.

**4.3** Seed realistic sample books, authors, categories, and test accounts; use fake files, not copyrighted books.

**4.4** Add FAQ, support-ticket, privacy-request, and policy-version entities only as needed for the agreed workflow; add ownership foreign keys, status indexes, and retention notes.

**4.5** Create `database-schema.md` and document how to reset local development data safely.

**Exit checklist:** Fresh database migration and seeding succeed from an empty DB; foreign keys and unique constraints are verified; rollback/reset instructions work locally.

### Phase 5 — Authentication and account recovery

**5.1** Implement registration, email verification, login with username/email, logout, and current-user endpoint.

**5.2** Add server-validated four-digit visual challenge if retained; refresh generates a new challenge and failed attempts consume/invalidate the previous one.

**5.3** Add server-side throttling by account identifier and IP, lockout/cooldown policy, and Turnstile where appropriate.

**5.4** Implement Google sign-in with server-side identity validation and account-linking rules.

**5.5** Implement forgot/reset password using short-lived email links and a mail sandbox for local development.

**5.6** Add session revocation/password-changed notifications and security settings.

**5.7** Write tests for account enumeration, expiry, reuse, invalid codes, brute-force limits, and unauthorized API access.

**Exit checklist:** Authentication passes tests with direct API calls, not only React pages. Password reset tokens are single-use and expiration is enforced.

### Phase 6 — Admin authentication boundary and RBAC

**6.1** Create role/permission matrix and seed minimum roles.

**6.2** Create admin-specific sign-in URL and UI; keep it out of normal navigation.

**6.3** Enforce admin auth and permissions on backend routes/controllers/policies.

**6.4** Configure MFA/passkey/TOTP approach for admins; do not show the reader challenge on admin sign-in.

**6.5** Add audit events for admin login, permission changes, user suspension, book approval, payment/refund actions, and exports.

**6.6** Test access as guest, normal user, seller, moderator, finance admin, admin, and super admin.

**Exit checklist:** A normal user cannot gain admin access through the normal form, a direct URL, a modified React state, or a direct API request. Every tested role has only the intended permissions.

### Phase 7 — Catalogue API and public search

**7.1** Implement paginated book/category/author/publisher endpoints.

**7.2** Implement filters, sort allow-list, search validation, and safe query building.

**7.3** Connect React Query to real endpoints with loading/error/retry states.

**7.4** Cache stable public queries and invalidate cache when catalogue items change.

**7.5** Add not-found, unapproved, unpublished, and removed listing behavior.

**Exit checklist:** Search/filter/pagination matches API results; unapproved books never appear in public search; no unbounded “return all books” endpoint.

### Phase 8 — Admin catalogue and CMS

**8.1** Create admin tables for books, categories, authors, publishers, DDC classifications, and status filters.

**8.2** Build forms with server validation, preview, and clear field errors.

**8.3** Add approval/rejection flow with moderator reason and history.

**8.4** Add featured/new/popular collections and book recommendation management.

**8.5** Add versioned CMS pages for Privacy Policy, Terms, Refund Policy, Seller Agreement, and Copyright/Takedown policy. Each page shows last-updated/version information and supports preview before publishing.

**8.6** Add FAQ categories and questions with draft/published/archived states, ordering, related links, and helpful/not-helpful feedback.

**8.7** Add support ticket administration: assignment, category, priority, status, private staff notes, response history, and closure. Add a privacy-request queue with limited access and auditable completion.

**Exit checklist:** Every mutation has permission checks and audit records. Published FAQ and policy updates appear on the public site, versions are retained, and caches are invalidated.

### Phase 9 — Seller onboarding and book upload

**9.1** Create seller application and seller agreement confirmation.

**9.2** Build step-by-step book listing form: metadata → cover → preview → full book file → rights confirmation → price → review.

**9.3** Validate upload size/MIME/extension server-side, use generated storage keys, and keep original book files private.

**9.4** Add upload status, processing status, file checksum, and version tracking.

**9.5** Add moderation queue and seller-visible rejection feedback.

**Exit checklist:** Seller A cannot update seller B's listing/files by altering an ID. Unapproved books cannot be purchased or downloaded. Invalid and oversized uploads fail safely.

### Phase 10 — Buyer library, reader, bookmarks, and reviews

**10.1** Build purchased library and empty state.

**10.2** Build authorized access check and an initial PDF reader with a small test file.

**10.3** Add EPUB reader in a separate tested step.

**10.4** Implement reading progress, history, bookmarks, favorites, and search within the catalogue.

**10.5** Add ratings/reviews/comments with ownership checks, moderation, and spam controls.

**10.6** Test access after logout, after entitlement revoke, with expired links, and as a non-buyer.

**Exit checklist:** Direct storage URL cannot bypass the intended access rules; readers see only books they are allowed to access; progress/bookmarks persist correctly.

### Phase 11 — Orders and receipts (without live payment)

**11.1** Create order and order-item tables/services and a price snapshot.

**11.2** Implement cart or buy-now flow, confirmation screen, order history, and order detail.

**11.3** Use a fake payment adapter in automated tests to simulate success, failure, timeout, duplicate callback, and refund.

**11.4** Build printable/custom receipt view with order reference, items, currency, totals, commission not necessarily visible to buyer, payment state, and seller/platform details as policy requires.

**Exit checklist:** Order totals are computed server-side, duplicate submissions do not create duplicate paid orders, and a fake success redirect alone does not unlock a book.

### Phase 12 — ABA PayWay sandbox integration

**12.1** Create/verify a PayWay developer sandbox account and read the current official integration guide for the selected checkout and callback method.

**12.2** Keep merchant credentials on the backend only; configure sandbox environment values.

**12.3** Build a payment provider service/adapter with methods for checkout creation, result verification, and status normalization.

**12.4** Implement pending payment attempts with unique references and expected amount/currency.

**12.5** Validate server-to-server callback/verification exactly as the official guide specifies; verify signature/checksum when applicable.

**12.6** Make webhook processing idempotent and record a safe event ID/hash for deduplication.

**12.7** Test success, decline/failure, cancel, callback retry, late callback, amount mismatch, invalid signature, duplicated callback, and provider timeout.

**12.8** Grant book entitlement only after trusted backend confirmation; queue receipt/email/Telegram notifications after the transaction commits.

**Exit checklist:** Sandbox transactions reconcile in the PayWay dashboard; browser redirect cannot fake payment success; repeated callbacks never duplicate grants or ledger entries. Do not launch live payment yet.

### Phase 13 — Commission, ledger, refunds, and payout requests

**13.1** Define platform commission and store the snapshot per order.

**13.2** Implement append-only ledger entries with paired debit/credit semantics and invariant tests.

**13.3** Add pending versus available seller earnings, with a configured hold/review period.

**13.4** Add refund request/approval flow and reversal ledger entries.

**13.5** Add seller payout requests and finance review; begin with manual off-platform settlement only after the business process and records are documented.

**13.6** Add reconciliation screens/reports comparing internal orders/payments to provider statements.

**13.7** Confirm ABA marketplace/payout capabilities, contracts, settlement timings, fees, and compliance before any automated seller payout implementation.

**Exit checklist:** No user/admin can edit a balance directly to create money. All adjustments have reason and actor, double-processing is prevented, and accounting invariants pass tests.

### Phase 14 — User and seller account dashboards

**14.1** Build reader profile, avatar, preferences, order list, library, and security settings.

**14.2** Build seller overview, listing states, sales history, commission breakdown, earnings, statements, and payout requests.

**14.3** Add skeleton/empty/error states and responsive table-to-card behavior on mobile.

**14.4** Add date/time/currency formatting rules and make statuses accessible without color alone.

**14.5** Add privacy settings entry points for data/access requests, account closure, and privacy contact information; show request status without exposing staff-only notes.

**Exit checklist:** Account information is scoped to the authenticated user; export and statement endpoints respect permissions; UI handles large lists through server pagination.

### Phase 15 — Realtime chat and notifications

**15.1** Create conversations, participants, messages, persistent notifications, and read-state schema.

**15.2** Implement text-only chat over authorized API endpoints before adding WebSockets.

**15.3** Add Reverb broadcasting and Echo subscriptions; authorize private channels on the server.

**15.4** Add unread counts, delivery/reconnect behavior, offline state, typing indicator if needed, and pagination.

**15.5** Add support assignment, report/block, and staff privacy audit requirements.

**15.6** Test unauthorized channel joins, reconnects, duplicate sends, message ordering, and database/broadcast failure cases.

**Exit checklist:** Messages persist without a socket, private conversations are inaccessible to nonparticipants, and reconnecting clients recover unread notifications.

### Phase 16 — Telegram and email notifications

**16.1** Create notification event list and severity/priority rules.

**16.2** Configure Telegram bot secrets via environment and private admin group.

**16.3** Queue notifications with deduplication, retry/backoff, and a failed-job view.

**16.4** Create email templates for verification, password reset, purchase receipt, seller review status, payout status, and security notices.

**16.5** Add delivery status/logs without exposing secrets or full personal data.

**Exit checklist:** Failures retry safely, alert storms are throttled, and Telegram messages contain no reset URLs, tokens, or private file links.

### Phase 17 — Full admin operations

**17.1** Complete user/member and seller management.

**17.2** Complete RBAC role/permission manager with guarded high-risk permission changes.

**17.3** Complete catalog and engagement moderation.

**17.4** Complete order/payment/refund/payout management and reconciliation reports.

**17.5** Complete notifications, CMS, analytics, exports, profile, and logout.

**17.6** Complete FAQ management, versioned legal/policy publishing, support-ticket queues, and privacy-request processing with separate permissions.

**17.7** Complete security events, admin activity logs, operational alerts, danger-zone confirmations, and backup/restore runbook.

**Exit checklist:** All requested modules are reachable only by authorized roles, paginated, validated, responsive, and audited where sensitive.

### Phase 18 — Search and recommendation quality

**18.1** Improve database indexes and search ranking using actual catalogue use cases.

**18.2** Add filters and search-result state persistence in URL query parameters.

**18.3** Start recommendations with transparent rules such as category, author, tags, and popularity.

**18.4** Add a dedicated search engine only if relevance/latency measurements justify it.

**Exit checklist:** Query latency is measured with realistic data; search handles typo/empty/special characters safely; recommendations do not expose hidden/unapproved books.

### Phase 19 — Accessibility, internationalization, and visual polish

**19.1** Audit keyboard navigation, focus order, screen-reader labels, dialog focus trapping, and contrast.

**19.2** Verify mobile breakpoints from 360px to large desktop; test touch targets.

**19.3** Audit loading, skeleton, empty, error, offline, permission, and slow-network states.

**19.4** Add language switching (for example Khmer/English) if required, using translation keys rather than duplicated page code.

**19.5** Verify theme preference, reduced motion, date/currency formats, and reader accessibility.

**Exit checklist:** No critical accessibility issues in primary flows; no page relies on color only; mobile checkout and reader flows are usable.

### Phase 20 — Automated test and security gates

**20.1** Unit-test price/commission/ledger calculations and order/payment state transitions.

**20.2** Feature-test authentication, account ownership, RBAC, seller moderation, protected book routes, and callback verification.

**20.3** Test React components for validation/errors/pending/empty states.

**20.4** Use Playwright for sign up → purchase sandbox/fake payment → entitlement → reader, plus seller upload → admin approval → listing visible.

**20.5** Run dependency audit, static analysis, secret scanning, and lint/format checks.

**20.6** Review OWASP-style web risks: injection, XSS, CSRF, IDOR/BOLA, SSRF where relevant, unsafe uploads, broken access control, session fixation, and sensitive logging.

**Exit checklist:** CI is green, no known critical/high blockers remain, and high-risk endpoints have automated negative tests.

### Phase 21 — Performance engineering for 5,000 concurrent users

**21.1** Define the exact target: 5,000 connected sessions, 5,000 active users per minute, 5,000 simultaneous page loads, or 5,000 concurrent WebSocket connections are different workloads.

**21.2** Set measurable service-level targets (for example, p95 API latency, error rate, checkout latency, and WebSocket connection success) based on product needs.

**21.3** Add query profiling and indexes; remove N+1 queries; paginate every large list.

**21.4** Cache public catalogue data and use CDN caching for static assets and public covers where rights allow.

**21.5** Move email, image processing, Telegram, exports, and heavy report generation into queues.

**21.6** Use Redis/shared cache and rate-limit storage across app instances; do not use per-instance in-memory state for sessions or throttling in a scaled deployment.

**21.7** Load test using anonymized realistic data and staged ramps (for example, 100 → 500 → 1,000 → 2,500 → 5,000 connections/clients); test read-heavy, checkout spikes, login abuse, and socket reconnect storms separately.

**21.8** Scale from measurements: stateless Laravel instances behind a load balancer, managed MySQL with adequate connection management, Redis, queue workers, private object storage/CDN, and Reverb with horizontal scaling where required.

**21.9** Monitor database connections, p95/p99 latency, memory, CPU, queue depth, failed jobs, cache hit rate, socket connections, callback lag, storage operations, and 4xx/5xx rates.

**Exit checklist:** A documented load test reaches the agreed target without exceeding error/latency budgets; failures and bottlenecks are recorded; scaling is not claimed based only on local testing.

### Phase 22 — IP abuse, security monitoring, and incident response

**22.1** Configure CDN/WAF protections and challenge suspicious login/signup behavior.

**22.2** Add Laravel per-route rate limiting and shared counters; monitor both IP-based and account-based abuse.

**22.3** Record detected IP/network signals, timestamps, affected endpoint, outcome, and risk score with privacy/retention controls.

**22.4** Admin Security page shows suspicious events, repeated failed login spikes, banned/blocked IP rules, and review status.

**22.5** Add escalation policy: slow down → challenge → temporary block → manual review. Avoid permanent bans on a single false-positive signal.

**22.6** Document incident response: disable compromised credentials, revoke sessions, temporarily restrict a route, preserve evidence, notify stakeholders, restore service, and review.

**Exit checklist:** Attack simulations trigger expected controls and appear in the admin security view; normal users can recover from false positives; sensitive event data is access-controlled.

### Phase 23 — Backup, restore, and data recovery

**23.1** Automate scheduled database backups and offsite encrypted copies.

**23.2** Back up object metadata and ensure book-file retention/lifecycle rules are understood.

**23.3** Define retention, access, encryption/key management, restore approvals, RPO, and RTO.

**23.4** Perform a restore into a non-production environment and verify login, catalogue, orders, entitlements, and ledger consistency.

**23.5** Restrict restore permissions to a very small role set and require a reason plus second-person review for production restore where possible.

**Exit checklist:** A restore drill is documented and successful; backup jobs alert on failure; backup copies are not stored only on the production server.

### Phase 24 — Production deployment and release checklist

**24.1** Choose hosts that support the required PHP/Laravel version, queue worker, cron/scheduler, private file storage, logs, and WebSockets.

**24.2** Configure production secrets, HTTPS, domain/DNS, CORS, cookie settings, mail domain verification, storage credentials, Redis, queue worker, and scheduler.

**24.3** Run migrations safely, seed only required system data, execute Laravel production optimization, and disable debug output.

**24.4** Configure health checks, application error monitoring, uptime alerts, queue alerts, and provider callback monitoring.

**24.5** Run smoke tests on sign-in, password reset, catalogue, seller submission, book access authorization, payment sandbox/live-approved configuration, admin roles, chat, email, and Telegram.

**24.6** Roll out gradually if the host supports it; keep a rollback plan and a known-good backup.

**24.7** Use custom domain only when purchased/configured; a provider's free subdomain is sufficient for early demo/testing.

**Exit checklist:** Production smoke tests pass; secrets and debug settings are checked; backups and monitoring are active; payment mode is explicitly verified as sandbox or approved live mode.

### Phase 25 — Documentation and developer page

**25.1** Build public About/Developer page with project mission, product scope, developer profile/credits, tech stack, and contact method that does not expose private credentials.

**25.2** Write setup documentation, environment variable reference, database reset guide, migrations/seed instructions, API conventions, payment state diagram, role-permission matrix, and deployment checklist.

**25.3** Document third-party licenses and attribution for icons, book covers, sample texts, fonts, and libraries.

**25.4** Create admin handbook for moderation, refunds, payouts, account suspensions, support tickets, FAQ/policy publishing, privacy requests, security incidents, and backup restore.

**25.5** Document the privacy data inventory, retention/deletion process, support escalation path, and the person/team responsible for policy updates. Keep the public policy text aligned with actual production behavior.

**Exit checklist:** A new developer can set up a fresh local environment from README, an administrator can operate the application using documented procedures, and the published Privacy Policy/Help Center match the real product behavior.

---

## 15. Core Acceptance Test Matrix

| Scenario | Expected result |
|---|---|
| Guest calls `/api/v1/admin/users` | 401/403; no user data returned |
| Normal reader changes a frontend role flag to `admin` | No privilege changes; backend still denies admin APIs |
| Seller A changes book ID to Seller B's book | Denied; no metadata/file disclosure |
| User guesses a four-digit challenge repeatedly | Server expires challenge and rate-limits attempts; challenge is not the only security control |
| User requests password reset for unknown email | Generic response; no account enumeration |
| Expired or reused password-reset token is submitted | Rejected |
| Google callback has wrong audience/invalid identity | Rejected by backend validation |
| Payment browser redirect says success but callback/verification is absent | Order remains pending; book stays locked |
| ABA callback is sent twice | One payment transition, one entitlement, one set of ledger entries |
| Payment amount/currency/order reference does not match | Quarantined/rejected and logged; no book access granted |
| Non-buyer requests protected PDF/EPUB URL | Denied or expired link cannot be reused beyond its permitted window |
| Book is unpublished/revoked after a policy decision | Access behavior follows documented entitlement/refund policy; storage remains private |
| Nonparticipant joins chat channel | Denied server-side |
| Telegram sends fail temporarily | Queue retries; application transaction still succeeds; duplicate alerts are controlled |
| Admin exports user/payment data without permission | Denied and audited |
| Backup task fails | Operational alert is generated |
| Privacy Policy page is opened by a guest | Public page renders, shows current published version/date, and has no private data |
| Unauthenticated visitor searches FAQ | Published FAQs only are searchable; drafts/archived items are not exposed |
| User submits a support ticket and changes ticket ID | Only the owner's ticket and permitted replies are returned |
| Public contact form is spammed | Server-side validation, rate limits, and anti-spam checks apply without leaking account existence |
| Support agent opens an unrelated user's privacy request | Denied unless explicitly authorized; access is audited |
| Privacy request is submitted | Request status is tracked, ownership is verified, and completion follows documented retention/deletion rules |
| Admin edits or publishes policy/FAQ content | Permission is checked, version/history is retained, and the change is audited |
| Load test ramps to target | Metrics are recorded; no scale claim without measured result |

---

## 16. Recommended MVP Release Order

Do not build every admin menu as a fully complex module before the first working purchase. Recommended delivery sequence:

1. Beautiful responsive public catalogue + component system.
2. Secure authentication and admin RBAC.
3. Catalogue/admin moderation + seller upload.
4. Private reader + entitlement model.
5. Order workflow using fake payment adapter.
6. ABA sandbox payment and idempotent callback verification.
7. Seller earnings ledger and manual payout-request workflow.
8. User/admin analytics, reports, CMS, and audit logs.
9. Realtime chat, notifications, and Telegram alerts.
10. Security review, load testing, backups, deployment, and production payment approval.

This order gives you a real end-to-end product early while postponing risky financial automation until the order and ledger model has been tested.

---

## 17. Critical Decisions to Remember

- **5,000 concurrent users:** an architectural target that must be proven by load testing and supported infrastructure, not something React/Laravel alone guarantees. Budget for production hosting, database capacity, cache, object storage, queue workers, monitoring, and WebSocket capacity.
- **Free hosting:** use it for learning/staging, not as the production availability promise for the full product. Some free hosts sleep, have ephemeral storage, lack scaling, or restrict persistent workers. Check each provider's current limits before choosing it.
- **Hidden admin URL:** useful as a secondary obstacle, not security. Server-side role checks and MFA are required.
- **Four-digit login challenge:** a bot-friction feature, not a second factor. Server-side generation/validation and strict throttling are mandatory; consider Turnstile instead or in addition.
- **Automatic ABA payments:** checkout and confirmation can be automated after a correct integration, but live credentials and merchant approval are separate requirements. Marketplace seller payouts may require a different approved flow.
- **Paid books:** private storage + server-checked entitlement + short-lived access. A public PDF path is not acceptable.
- **Wallet/balance:** calculate from ledger entries. Do not build unrestricted stored value or automated withdrawals without validating legal, accounting, and provider requirements.
- **Security dashboards:** show signals and investigation tools, not the illusion that every attack can be automatically identified or blocked perfectly.
- **Design quality:** every API-backed page needs loading, skeleton, empty, error, pending, and permission states—not only a pretty default screen.

---

## 18. Official References

Check current version requirements and plan limits when you implement each phase; provider features, free quotas, and payment APIs can change.

- [React — Versions](https://react.dev/versions)
- [Laravel — Deployment](https://laravel.com/framework/docs/deployment)
- [Laravel — Rate Limiting](https://laravel.com/framework/docs/rate-limiting)
- [Laravel — Queues](https://laravel.com/framework/docs/13.x/queues)
- [Laravel — Broadcasting](https://laravel.com/framework/docs/broadcasting)
- [Laravel Reverb](https://laravel.com/framework/docs/reverb)
- [Google Identity Services — Web authorization](https://developers.google.com/identity/oauth2/web/guides/overview)
- [ABA PayWay Developer Suite](https://developer.payway.com.kh/)
- [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)
- [Cloudflare — Stop malicious bots](https://developers.cloudflare.com/use-cases/solutions/stop-malicious-bots/)
- [Cloudflare R2 pricing and free tier](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [TiDB Cloud Starter quotas](https://docs.pingcap.com/tidbcloud/serverless-limitations/)
- [Render free-service limitations](https://render.com/docs/free)

---

## 19. The First Coding Session

Start only with the following tasks:

1. Open Windows PowerShell at `C:\Users\USER\Documents\WEBSITE` and verify the already-installed tools: `node -v` → `v24.21.0`, `npm -v` → `11.19.0`, and `laravel` → Laravel Installer `5.32.0`.
2. Verify `php -v` and `composer --version`; record the actual versions in `docs/development-environment.md`.
3. Create the project folder `elibrary-marketplace/` with `frontend/`, `backend/`, and `docs/`.
4. Verify AMPPS MySQL is running and create a local database named `elibrary_marketplace`.
5. Use the installed Laravel Installer to scaffold the app in `backend/`; record `php artisan --version`, configure `.env`, and run the initial migration.
6. Create the React + Vite app in `frontend/`, configure Tailwind, and install the small initial dependency set: React Router, TanStack Query, `lucide-react`, React Hook Form, and Zod.
7. Create a simple health endpoint in Laravel and call it from React.
8. Commit the working skeleton only after confirming secrets are excluded.

**Stop here and verify it works before starting the design system.** Build in layers rather than generating the entire project in one giant code dump.
