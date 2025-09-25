# Admin Role — Complete Prompt & Spec
| Action / Resource         |   Buyer |           Seller |      RepairCenter |       Admin |
| ------------------------- | ------: | ---------------: | ----------------: | ----------: |
| Register / Login          |       ✅ |                ✅ |                 ✅ |           ✅ |
| Create product listing    |       ❌ |                ✅ |                 ❌ |           ✅ |
| Edit own product          |       ❌ |                ✅ |                 ❌ |           ✅ |
| Approve seller KYC        |       ❌ |                ❌ |                 ❌ |           ✅ |
| Request repair            |       ✅ |    ✅ (on behalf) |  ✅ (accept/quote) |           ✅ |
| Manage orders             | ✅ (own) | ✅ (seller items) | ✅ (repair orders) |     ✅ (all) |
| Moderate products/reports |       ❌ |                ❌ |                 ❌ |           ✅ |
| Payouts / refunds         |       ❌ |         ✅ (view) |          ✅ (view) | ✅ (process) |



## Overview (short)

Role: **Admin** — full platform control for an Amazon-like electronics marketplace (Repair • Reuse • Reduce).
Goal: Provide admin features for user & content moderation, KYC, product & repair center approvals, financials (refunds/payouts), analytics, system configuration, audit logging, and security management. Also include core public auth flows (register/login/verify/forgot-password) implemented securely.


## 1 — Admin responsibilities / high-level features

1. **User management**

   * Search, filter, view user profiles (Buyer, Seller, RepairCenter).
   * Change user roles; suspend/reactivate users; force password reset; view activity logs.
   * Approve/reject seller & repair center KYC documents.
2. **Product moderation**

   * View product moderation queue (flagged listings).
   * Approve/reject/soft-delete products; ban users and remove all listings.
3. **Repair requests & RepairCenter management**

   * View all repair requests, manage statuses, reassign to repair centers, approve quotes, intervene in disputes.
   * Approve/decline repair center registrations and manage repair centers’ visibility.
4. **Orders, refunds & payouts**

   * View orders across platform, issue manual refunds, trigger/adjust payouts to sellers, view payout history.
5. **Reports & analytics**

   * Sales, refunds, repairs completed, active sellers/buyers, category performance, regional metrics.
6. **Platform settings**

   * Configure commission rates, payout schedule, tax rules, return policy windows, allowed shipping regions, image upload limits.
7. **Content & CMS**

   * Manage static pages (Terms, Privacy, FAQs), banners, category taxonomy, featured products, promotional coupons.
8. **Security & access**

   * View login history, force logout users, manage admin accounts, configure MFA for admins, role-based granular permissions.
9. **Audit & logs**

   * View immutable audit trail of admin actions & critical user events.
10. **System operations**

    * Manage scheduled tasks (thumbnails generation), run backup & restore, schedule maintenance windows.
11. **Notifications**

    * Send global email / in-app notifications or targeted messages to users; view notification history.

---

## 2 — Basic website auth flows (secure, required for every role)

These are core flows the admin will use and must exist platform-wide.

### Features

* Register (Buyer/Seller/RepairCenter) — email verification required.
* Login — JWT (access + refresh) or session cookie option.
* Password reset (email token).
* Refresh tokens with rotation and server-side revocation.
* Logout — revoke refresh token.
* Optional: Two-Factor Authentication (2FA) via TOTP (admin mandatory), SMS/Email OTP for sensitive actions.
* Account lockout after configurable failed attempts with exponential backoff and admin unlock option.

### Security controls (auth)

* Passwords hashed with Argon2/Bcrypt (pref Argon2) with secure parameters.
* Token lifetimes: access token \~15min, refresh token \~30d (rotate on use).
* Store refresh tokens server-side (DB) with `device_id`, `ip`, `user_agent`.
* Use `httpOnly`, `secure`, `SameSite=Strict` cookies if storing tokens in cookie.
* CSRF protection if cookies are used for auth flows.
* Enforce HTTPS always; HSTS header.
* Rate-limit auth endpoints (e.g., 5 attempts / 15 minutes per IP for login endpoints).
* CAPTCHA on registration and sensitive flows (optional).

---

## 3 — Admin UI pages & components (per-file rule)

Each page/component must be its own file.

### Pages

* `AdminLoginPage` — separate from standard login (MFA prompt).
* `AdminDashboard` — overview cards (users, orders, repairs, revenue), charts & alerts.
* `UsersPage` — table with filters, search, bulk actions (suspend/promote/email).
* `UserDetailPage` — profile, KYC docs, activity log, orders, refunds, last login.
* `SellersKYCQueue` — queue of pending KYC submissions with view/download and approve/reject controls.
* `ProductsModerationPage` — flagged items, product detail preview, approve/reject/edit.
* `RepairsAdminPage` — list + detail of repair requests, quoted amounts, assigned repair centers, dispute tools.
* `OrdersPage` — full order management (search by order ID, buyer, seller), refund button, manual update.
* `PayoutsPage` — pending payouts, history, trigger payout.
* `ReportsPage` — date range selector, export CSV, charts (sales, refunds, repairs).
* `PlatformSettingsPage` — commission, payout settings, image limits, allowed categories, return policy settings.
* `NotificationsPage` — create global/targeted notifications, history.
* `AuditLogsPage` — time-filterable immutable logs.
* `SystemOpsPage` — backups, DB snapshot, run background jobs, maintenance mode toggle.

### Reusable components (each in own files)

* `AdminTable`, `FilterPanel`, `UserCard`, `ProductPreviewModal`, `KycDocumentViewer`, `OrderTimeline`, `PayoutModal`, `CSVExportButton`, `ConfirmationModal`, `AuditEntry`.

---

## 4 — Backend Admin API endpoints (grouped by resource)

All admin endpoints must require `role: admin` and strong auth middleware plus audit logging.

### Auth / Admin session

* `POST /api/admin/login` — admin login (returns access + refresh tokens). (MFA flow: `POST /api/admin/mfa/verify`)
* `POST /api/admin/logout` — revoke admin refresh token.

### Users

* `GET /api/admin/users` — query: `q, role, status, kyc_status, createdFrom, createdTo, page, limit`
* `GET /api/admin/users/:id` — detailed user payload including last 50 actions and KYC docs.
* `PUT /api/admin/users/:id/role` — change role (log & require confirmation).
* `PUT /api/admin/users/:id/suspend` — { reason, until }.
* `POST /api/admin/users/:id/force-password-reset` — send reset email.
* `DELETE /api/admin/users/:id` — soft delete (archive) only after confirmation + audit.

### KYC

* `GET /api/admin/kyc/pending` — list pending KYC documents.
* `GET /api/admin/kyc/:kycId` — view docs.
* `POST /api/admin/kyc/:kycId/approve` — approve with notes.
* `POST /api/admin/kyc/:kycId/reject` — reject with reason.

### Products & Moderation

* `GET /api/admin/products/moderation` — flagged/draft/blocked listings.
* `GET /api/admin/products/:id` — product + seller summary.
* `POST /api/admin/products/:id/approve` — publish product.
* `POST /api/admin/products/:id/reject` — reject with reason.
* `POST /api/admin/products/:id/ban-seller` — ban user and remove listings.

### Orders & Refunds

* `GET /api/admin/orders` — search by orderId/buyer/seller/status/date range.
* `GET /api/admin/orders/:id` — order detail and payment logs.
* `POST /api/admin/orders/:id/refund` — initiate refund (manual or via gateway).
* `POST /api/admin/orders/:id/force-update-status` — for exceptional cases.

### Repairs

* `GET /api/admin/repairs` — list with filters (status, center, created range).
* `GET /api/admin/repairs/:id` — repair detail and quotes.
* `PUT /api/admin/repairs/:id/assign` — assign to repair center.
* `PUT /api/admin/repairs/:id/resolve-dispute` — admin resolution (refund/partial/credit).

### Payouts & Finance

* `GET /api/admin/payouts` — pending/completed payouts.
* `POST /api/admin/payouts/:sellerId/trigger` — trigger manual payout.
* `GET /api/admin/finance/reports` — revenue, commissions, payment provider fees (CSV export).

### Reports & Exports

* `GET /api/admin/reports/sales` — params: from, to, groupBy.
* `GET /api/admin/reports/repairs` — repairs completed, average time, center performance.
* `GET /api/admin/reports/export` — returns presigned CSV.

### System & Ops

* `POST /api/admin/system/backup` — trigger DB backup to S3.
* `POST /api/admin/system/maintenance` — toggle maintenance mode (requires confirmation & scheduled window).
* `GET /api/admin/audit-logs` — fetch logs (filterable).

### Notifications

* `POST /api/admin/notifications` — send targeted/global notifications (email + in-app).
* `GET /api/admin/notifications/history` — list sent notifications.

---

## 5 — Sample request/response shapes (admin)

> Example: approve KYC
> **POST** `/api/admin/kyc/123/approve`
> Request body:

```json
{ "approved_by": "adminId", "notes": "Documents verified against govt id", "effective_date": "2025-09-15T10:00:00Z" }
```

Response:

```json
{ "error": false, "data": { "kycId": 123, "status":"approved", "approvedBy":"adminId", "approvedAt":"2025-09-15T10:01:02Z" } }
```

**Error format** (consistent across admin APIs):

```json
{ "error": true, "code":"KYc_VALIDATION_FAILED", "message":"KYC document missing pages", "details": { "document":"front" } }
```

---

## 6 — Audit & immutability rules

* Every admin action must be recorded in `audit_logs` with: `id, admin_id, action, target_type (user/product/order/repair), target_id, before_snapshot (JSON), after_snapshot (JSON), ip, user_agent, timestamp`.
* Audit logs are append-only; only super-admin with DB access can export or archive logs (never delete).
* Critical operations (role change, bulk delete, payout triggers, refunds) require two-step confirmation in UI and are logged with reason.

---

## 7 — UI/UX & safety flows for admin

* Admin actions affecting money, user roles, or data deletion must require confirmation modal showing consequences and request typed confirmation (`Type "DELETE" to confirm`) or second-factor (MFA).
* Admin pages should have activity timeline and quick-revert actions when possible (e.g., undo recent suspension within 15 minutes).
* Provide "impersonate user" feature (view-as) for troubleshooting — log every impersonation event to audit and require MFA and separate permission to use.

---

## 8 — Security checklist (Admin-specific + general)

* Admin-only endpoints: require role-check middleware and additional admin token claims (e.g., `isAdmin=true`, `adminLevel`).
* MFA/TOTP for all admin accounts (mandatory).
* IP allowlist option (restrict admin console access to known IPs) — optional but recommended for production.
* CSP, X-Frame-Options, X-XSS-Protection, HSTS enabled (via helmet).
* Rate limit admin login endpoints more strictly than public ones.
* Session management: expire admin sessions more aggressively (access token shorter, force logout on role change).
* Protect file downloads (KYC docs) with signed presigned URLs with short expiration and audit logging.
* Duplicate admin accounts detection; enforce strong passwords and rotate secrets.
* Admin actions over Web UI require CSRF protection if cookies used.
* Protect against privilege escalation: changes to role/permissions must be logged and require `super-admin` confirmation if promoting to admin.
* Ensure the frontend does not render sensitive data (full card numbers); show masked versions and require separate action to view full info with reason.

---

## 9 — DB conceptual additions for admin features

* `admin_accounts`: `id, user_id, admin_level, created_at, last_login, mfa_enabled`
* `audit_logs`: fields noted earlier
* `kyc_submissions`: `id, user_id, docs:[]`, `status`, `submitted_at`, `reviewed_by`, `review_notes`
* `notifications`: `id, target, channels, payload, sent_by, sent_at, status`
* `payouts`: `id, seller_id, gross, commission, net, status, scheduled_at, executed_at, provider_ref`
* `backups`: metadata for stored DB backups with presigned URLs
* `maintenance_windows`: record of scheduled maintenance

---

## 10 — Acceptance criteria & tests (Admin)

**Unit / Integration tests**

* Admin login with MFA flows; invalid credentials rate-limit enforced.
* KYC approve/reject workflow: documents validated and seller status updated.
* Product moderation: flagged product cannot be listed until approved; admin reject moves to `status=blocked`.
* Refund endpoint: refund processed triggers payment provider call + audit log entry.
* Payout trigger: creates payout entry and logs action.

**E2E tests**

* Admin approves seller KYC → seller publishes a new `new` product → product visible in marketplace.
* Admin rejects repair quote → buyer receives notification; status flows to `rejected`.
* Admin triggers backup → backup stored & entry added to `backups` table.

**Security tests**

* Attempt impersonation without permission → denied and logged.
* Admin endpoints inaccessible to non-admin tokens (403).
* CSRF attempt blocked on admin sensitive actions.

---

## 11 — File & module organization (server & client admin subset)

> All admin modules in their own files.

### Server

```
/server/src/routes/admin/
  auth.routes.js
  users.routes.js
  kyc.routes.js
  products.routes.js
  orders.routes.js
  repairs.routes.js
  payouts.routes.js
  reports.routes.js
  system.routes.js

/server/src/controllers/admin/
  auth.controller.js
  users.controller.js
  kyc.controller.js
  products.controller.js
  orders.controller.js
  repairs.controller.js
  payouts.controller.js
  reports.controller.js
  system.controller.js

/server/src/services/
  adminAuth.service.js
  audit.service.js
  backup.service.js
  notification.service.js

/server/src/middleware/
  auth.middleware.js
  adminRole.middleware.js
  rateLimit.middleware.js
  ipAllowlist.middleware.js
  audit.middleware.js
```

### Client (React admin app — separate folder)

```
/client/src/admin/pages/
  Dashboard.jsx
  Users.jsx
  UserDetail.jsx
  KycQueue.jsx
  ProductsModeration.jsx
  Orders.jsx
  Repairs.jsx
  Payouts.jsx
  Reports.jsx
  SystemOps.jsx
  Notifications.jsx

/client/src/admin/components/
  AdminTable.jsx
  KycViewer.jsx
  ConfirmationModal.jsx
  AuditLogViewer.jsx
  CsvExportButton.jsx

/client/src/admin/api/
  adminAuth.api.js
  adminUsers.api.js
  adminKyc.api.js
  adminProducts.api.js
  adminReports.api.js

/client/src/admin/hooks/
  useAdminAuth.js
  useAudit.js
```

---

## 12 — Monitoring, alerts & observability (Admin-focused)

* Expose metrics on admin actions: number of KYC approvals per day, number of products moderated, manual refunds initiated.
* Alert: abnormal spike in admin logins from new IPs, repeated failed admin login attempts (possible attack).
* Track admin impersonation usage; alert if used outside business hours or from unexpected IP.

---

## 13 — CI/CD & deployment considerations for admin app

* Admin UI should be served under a different subdomain (e.g., `admin.example.com`) with stricter firewall rules.
* Separate client builds for admin (smaller, role-specific).
* Deploy admin backend endpoints behind a WAF; consider separate app/service for admin APIs to isolate surface area.
* Ensure secrets (MFA secrets, admin keys) stored in vault and not in repo.

---

## 14 — Nightly & emergency operational flows

* Emergency access process: require multi-person approval to perform high-impact actions (refund > threshold, manual DB access).
* Maintenance mode page for users; admins can see queue and emergency bypass for critical tasks.
* Rollback checklist: how to rollback a payout/manual change with audit trail.

---

## 15 — Deliverables (for Admin module)

* API docs for admin endpoints (OpenAPI / Postman collection).
* Admin UI wireframes and component prop sheets.
* Acceptance test scripts (unit, integration, E2E).
* Security checklist & runbook for admin account incidents.
* README: setup admin app, create first admin user, enable MFA.
* Migration plan for admin DB objects (kyc, audit logs, payouts).

---

## 16 — Quick priority checklist (what to build first)

1. Secure Admin auth (login + MFA + audit logs).
2. Admin dashboard skeleton with counts & charts.
3. Users list + user detail + suspend/role-change endpoints.
4. KYC queue approve/reject flow.
5. Product moderation queue with approve/reject.
6. Orders & refunds basic view + refund trigger (dry-run first).
7. Audit logs with filtering and export.
8. Platform settings UI (commission & payouts).
9. Notifications & backup controls.
10. Reports + CSV exports.

---

## 17 — Final notes / Developer prompt (copyable)

```
Role: Senior Full-Stack JavaScript Developer
Task: Implement Admin Console and Admin APIs for the Repair•Reuse•Reduce marketplace.
Requirements:
- Build secure admin auth (MFA mandatory), JWT + refresh tokens with rotation, and audit logging on all admin actions.
- Implement user management (search, role change, suspend/reactivate), KYC approval queue, product moderation, repair management, order/refund handling, payout triggers, platform settings, notifications, backups, and audit logs.
- All admin pages and components in separate files (per module-per-file). All admin endpoints require admin middleware and are logged.
- Harden security: IP allowlist, rate limiting, CSRF, strict CSP, short token lifetimes, presigned KYC downloads, and mandatory TOTP for admin accounts.
- Provide API docs (OpenAPI or Postman), unit/integration tests & E2E tests for critical admin flows, and CI config.
Deliverables:
- Admin client (React) and server modules (Node/Express), API docs, security runbook, migration scripts for new DB objects (kyc, audit_logs, payouts), and acceptance test results.
```

---

If you want, I’ll now:

1. Generate the **Admin API\_SPEC.md** (full endpoint-by-endpoint with request/response examples).
2. Produce **Admin UI component prop sheets** (props, events, sample data).
3. Produce **security runbook** (step-by-step admin incident response).

Which one should I generate **now**?





