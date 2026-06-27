# NexaNotion Supabase Setup

NexaNotion uses Supabase for catalog data, checkout orders, stock decrementing, order tracking, contact messages, admin authentication, admin CRUD, and image upload support.

## Required Environment Variables

Copy `.env.example` to `.env.local` and fill these values from your Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client components, browser code, screenshots, or public repositories.
`ADMIN_EMAILS` is a comma-separated allowlist of Supabase Auth user emails that can access `/admin`.
`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `RESEND_API_KEY`, and `ADMIN_NOTIFICATION_EMAIL` are optional production integrations. Missing values must not block checkout or contact submissions.
Google Analytics should be configured after Vercel deployment and production domain setup. Use a GA4 Measurement ID in `G-XXXXXXXXXX` format.

## Create a Supabase Project

1. Create a new project in Supabase.
2. Open the SQL editor.
3. Run `supabase/migrations/202606250001_phase3_backend_foundation.sql`.
4. Run `supabase/migrations/202606250002_phase5_admin_catalog.sql`.
5. Run `supabase/migrations/202606260001_manual_payment_transaction_ids.sql`.
6. Run `supabase/seed.sql` only if you need to create/update the standard category set.
7. Add the environment variables to `.env.local`.
8. Create Supabase Auth email/password users for admins.
9. Add those admin user emails to `ADMIN_EMAILS`.
10. Restart the Next.js dev server.

## What The Supabase Setup Supports

- Categories and products schema with active public reads.
- Secure server-side order creation through `POST /api/orders`.
- Server-side price recalculation from active Supabase products.
- Manual COD, bKash, and Nagad order methods.
- Manual payment Transaction ID storage for bKash/Nagad.
- Stock validation and stock decrementing.
- Safe public order tracking through `POST /api/track-order`.
- Contact message persistence through `POST /api/contact`.
- Admin product/category CRUD.
- Admin order/message management.
- Public frontend fallback when Supabase env variables are missing.

## Manual Payment Note

COD, bKash, and Nagad are manual payment preferences. No payment gateway is connected. Customers submit Transaction IDs for bKash/Nagad, and admins manually verify payment status.

## Security Notes

- RLS is enabled on all Phase 3 tables.
- Public users can only read active categories and active products.
- Public users cannot directly insert, update, or delete orders, order items, contact messages, products, or categories.
- Order and contact writes happen through server API routes using the service role key after validation.
- The service role key must stay out of all `NEXT_PUBLIC_` variables.

## Production Recommendations

- Review `docs/PRODUCTION_LAUNCH_CHECKLIST.md` before deployment.
- Replace shared Panjabi category imagery with real category/product photos.
- Verify the WhatsApp number in `src/config/site.ts` before launch.
- Review live Supabase product names/descriptions for unofficial brand names.
- Add email/SMS/WhatsApp notifications.
- Consider payment gateway integration only after manual order operations are stable.
