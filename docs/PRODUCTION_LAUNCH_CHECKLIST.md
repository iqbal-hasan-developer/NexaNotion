# NexaNotion Production Launch Checklist

Use this checklist before sending real customers to the live store.

## Required Environment Variables

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

- `NEXT_PUBLIC_SITE_URL`: production URL, for canonical links, robots sitemap reference, and absolute metadata.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public catalog reads and browser-side environment checks.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only API access for orders, stock, contact messages, admin CRUD, and uploads.
- `ADMIN_EMAILS`: comma-separated Supabase Auth emails allowed into `/admin`.
- `NEXT_PUBLIC_META_PIXEL_ID`: optional Meta Pixel ID. Leave blank to disable tracking safely.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional Google Analytics Measurement ID. Add after Vercel deployment and domain setup. Expected format: `G-XXXXXXXXXX`.
- `RESEND_API_KEY` and `ADMIN_NOTIFICATION_EMAIL`: optional admin email notifications. Leave blank to keep flows working without email.

## Supabase Migrations Checklist

- Run `supabase/migrations/202606250001_phase3_backend_foundation.sql`.
- Run `supabase/migrations/202606250002_phase5_admin_catalog.sql`.
- Run `supabase/migrations/202606260001_manual_payment_transaction_ids.sql`.
- Run `supabase/seed.sql` only if you need to create/update the standard category set.
- Confirm RLS remains enabled on customer, order, contact, product, and category tables.
- Confirm the `decrement_product_stock` RPC exists and works.

## Supabase Storage Checklist

- Create a public `products` bucket.
- Confirm admin uploads go through `/api/admin/upload`.
- Confirm public users can read product/category image URLs.
- Confirm uploaded files are under `products/{slug}/...` and `categories/{slug}/...`.

## Admin User Setup

- Create Supabase Auth email/password users for admins.
- Add each admin email to `ADMIN_EMAILS`.
- Test login at `/admin/login`.
- Confirm non-allowlisted users cannot access protected admin routes.

## Product And Category Setup

- Create or review categories: Ladies Bags, Gym Bags, Cosmetics, Bracelets, Couple Packages, Gift Packages, Panjabi.
- Review product names, prices, sale prices, descriptions, stock, tags, and active flags.
- Remove unofficial brand names from product names/descriptions unless products are genuinely official branded stock.
- Keep existing slugs unless redirects are added.
- Add real approved launch products and product photos through the admin panel.

## Product Image Requirements

- Use clear real product images, not generic placeholders.
- Prefer WEBP.
- Product card ratio: 4:5.
- Recommended size: 1200 x 1500 px.
- Keep files under 5 MB for admin upload.
- Write descriptive alt-friendly product names.

## Manual bKash/Nagad Workflow

- Current manual payment number: `01683158940`.
- Customer chooses bKash or Nagad at checkout.
- Customer sends money manually and enters Transaction ID.
- Admin checks the payment manually.
- Admin updates payment status to `verified` or `failed`.
- Admin then updates the order status through the order lifecycle.
- Do not expose transaction IDs in analytics events.

## Test Order Checklist

- Add product to cart.
- Checkout COD.
- Checkout bKash with Transaction ID.
- Checkout Nagad with Transaction ID.
- Confirm order appears in admin.
- Confirm stock decrements.
- Confirm customer sees order number.
- Copy order number.
- Track order from confirmation page.

## Order Tracking Checklist

- Track order with valid order number and phone.
- Confirm invalid order lookup shows a friendly error.
- Confirm manual payment status copy is clear.
- Confirm mobile tracking layout has no overflow.

## Meta Pixel Setup

- Add `NEXT_PUBLIC_META_PIXEL_ID` in Vercel.
- Verify PageView on route changes.
- Verify ViewContent on product detail pages.
- Verify AddToCart after add-to-cart clicks.
- Verify InitiateCheckout when checkout is visited.
- Verify Purchase after successful real order creation.
- Verify Lead after contact form success.
- Confirm no phone, address, customer details, or transaction IDs are sent.

## Google Analytics Post-Deployment Setup

- Google Analytics is optional for Phase 6A and is not required before deployment.
- Create a GA4 web stream after the Vercel production domain is connected.
- Copy the Measurement ID in `G-XXXXXXXXXX` format.
- Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel environment variables.
- Redeploy and verify page views in GA Realtime.
- Leave `NEXT_PUBLIC_GA_MEASUREMENT_ID` blank until the production domain is ready; no GA script loads when it is missing.

## Email Notification Setup

- Add `RESEND_API_KEY`.
- Add `ADMIN_NOTIFICATION_EMAIL`.
- Verify your sending domain in Resend for production.
- The current foundation uses `NexaNotion <onboarding@resend.dev>` until a verified sender is configured.
- Confirm a new order sends an admin notification.
- Confirm a new contact message sends an admin notification.
- Confirm order/contact flows still succeed if Resend is unavailable.

## Vercel Deployment Checklist

- Add all required env variables to Vercel.
- Keep `.env.local` out of source control.
- Build command: `npm run build`.
- Output framework preset: Next.js.
- Deploy from the production branch.
- Connect the production domain in Vercel.
- Set `NEXT_PUBLIC_SITE_URL` after the real domain is connected, for example `https://your-domain.com`.
- Add Google Analytics only after deployment/domain setup.
- Confirm Supabase Auth admin users exist and `ADMIN_EMAILS` matches those emails.
- Confirm Supabase Storage bucket `products` exists and is public.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` before deploy.
- Confirm `/sitemap.xml` loads.
- Confirm `/robots.txt` disallows admin routes.
- Confirm canonical URLs use the production domain.
- Place one production test order after deploy and verify it appears in admin.

## Post-Deployment QA Checklist

- Home page.
- Shop page.
- Product detail page.
- Gift Packages page.
- Offers page.
- Cart page.
- Checkout page.
- Track Order page.
- Contact page.
- Admin login.
- Admin dashboard.
- Admin products.
- Admin categories.
- Admin orders.
- Admin messages.
- Product CRUD.
- Category CRUD.
- Image upload.
- Admin order detail shows Transaction ID for bKash/Nagad.
- Admin payment status update.
- Contact form.
- Stock decrement.
- Mobile checkout.
- Mobile product detail.
- SEO metadata.
- Sitemap/robots.
- Meta Pixel event check.
- Google Analytics realtime check if configured.
- Email notification check if configured.
- No broken images.
- No incorrect alt text on key images.
- No horizontal overflow.
- No mobile bottom nav overlap.
- No obvious layout shift.
- No console errors.
- Reduced motion respected.
- Buttons and links have accessible names.

## Remaining Launch Notes

- Verify whether `siteConfig.whatsappDisplay` and `siteConfig.whatsappHref` are the final business WhatsApp number before launch.
- Replace shared Panjabi category imagery with real category/product photos.
- Update live Supabase product names/descriptions in the admin panel if any unofficial brand names are found in production data.
