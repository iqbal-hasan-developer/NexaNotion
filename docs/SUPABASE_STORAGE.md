# NexaNotion Supabase Storage

Phase 5 uses Supabase Storage for admin-managed product and category images.

## Bucket

- Bucket name: `products`
- Public read access: enabled
- Writes: admin-only through protected NexaNotion server routes

## Recommended Images

- Format: WEBP preferred
- Product card ratio: 4:5
- Recommended size: 1200 x 1500 px
- Maximum upload size in the app: 5 MB
- Use real product photos before launch. Avoid generic starter imagery on public product listings.

## Storage Paths

The app writes safe object paths like:

```txt
products/{slug}/{timestamp}-{filename}
categories/{slug}/{timestamp}-{filename}
```

The public URL is stored in the database as `image_url` or inside `gallery_urls`.

## Security

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Admin uploads go through `/api/admin/upload`, which checks the admin session and `ADMIN_EMAILS` allowlist.
- Public users should only read public product/category image URLs.

## Pre-Launch Checks

- Upload at least one production image for each active product.
- Upload category images that match the public category names.
- Confirm all product detail galleries render without broken images.
- Confirm mobile product images do not crop key product details.
- Confirm the `products` bucket exists before Vercel production QA.
