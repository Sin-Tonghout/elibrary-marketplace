# Project Scope and Marketplace Rules — DRAFT

> Status: draft, not legally reviewed. Replace placeholders before launch.

## 0.1 MVP scope (confirmed)
- Reader registration/login, browsing, purchase (one-time, not subscription).
- Seller listing submission and moderation (approve/reject).
- Authorized online reader for purchased books (PDF/EPUB).
- Order history and receipts.
- Admin management: users, catalogue, orders, RBAC, audit logs.
- No dedicated Librarian role in this scope (per 17 Oct 2026 update).
- No live payment yet — ABA PayWay sandbox only, until Phase 12+ confirms production readiness.

## 0.2 Marketplace rules (draft — needs business sign-off)
- **Seller eligibility:** seller must complete a seller profile, accept the Seller Agreement, and confirm rights/permission to distribute each book before submission.
- **Copyright:** sellers self-certify rights; platform provides a takedown/report process; repeated violations suspend the seller.
- **Commission:** rate to be defined (placeholder: TBD %), snapshotted per order so later changes don't rewrite history.
- **Refunds:** window and conditions TBD — must be defined before Phase 13.
- **Payout timing:** manual payout requests reviewed by finance admin at launch (per 0.3); automated split payouts deferred until ABA confirms marketplace/multi-party settlement support.
- **Subscriptions:** out of scope for MVP; may be added later as a separate entitlement model.
- **Content policy:** no infringing, illegal, or malicious file uploads; files are scanned/validated before publication.

## 0.3 Payout decision
Seller payouts are **manual at launch**. Automated split/payout via ABA PayWay is not implemented until ABA confirms the merchant account supports marketplace settlement. This is tracked as an open item — do not build payout automation before it is resolved.

## 0.5 Privacy data inventory (initial pass — expand in docs/privacy-data-inventory.md during Phase 4+)
| Data category | Why collected | Who can access | Retention |
|---|---|---|---|
| Account/contact details | Login, communication | User, Admin, Support (masked by default) | Until deletion request, minus legally required records |
| Seller identity/business details | Seller verification | Seller, Admin/Finance | Per verification policy |
| Book uploads/metadata | Catalogue, delivery | Seller, Moderator, Admin | Life of listing + audit history |
| Purchase/payment references | Orders, refunds | User, Finance, Support (limited) | Per accounting/legal requirement |
| Support messages / tickets | Issue resolution | User, assigned Support staff | Per support retention policy |
| Reading progress/history | Reader features | User, limited aggregate analytics for staff | Per retention policy |
| Device/session, security/IP logs | Security, fraud prevention | Security/Admin | Per retention policy |

Privacy requests (export, correction, deletion) are handled via an authenticated `privacy_requests` workflow (Phase 4+, Phase 8).

## 0.6 FAQ categories and support workflow (draft)
**FAQ categories:** Accounts & Login, Buying Books, Reading & Downloads, Selling Books, Payments & Receipts, Refunds & Disputes, Payouts, Copyright/Reporting, Privacy & Security, Technical Problems.

**Support workflow:** public contact form (validated, rate-limited, generic success response) → authenticated support ticket for signed-in users → staff assignment/categorization/priority → resolution. Realtime chat remains available separately for buyer/seller and reader/support conversations.

**Escalation:** unresolved/urgent tickets can trigger a Telegram alert to staff (no private message bodies, tokens, or personal data in the alert).

**Policy documents to draft and mark "DRAFT" until legal review:** Privacy Policy, Terms of Service, Refund Policy, Seller Agreement, Copyright/Takedown Policy.

## Open decisions still needed before later phases
- [ ] Final commission rate
- [ ] Refund window and dispute process details
- [ ] Legal jurisdiction(s) for policy review
- [ ] Whether multi-language (Khmer/English) is required for MVP or later (Phase 19)
- [ ] ABA PayWay merchant account marketplace/payout capability confirmation