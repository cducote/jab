# Environment Variables Setup

## Location

Your `.env.local` file should be in one of these locations:
- **Root directory**: `/Users/chrissyd/jab/.env.local` (primary)
- **Storefront directory**: `/Users/chrissyd/jab/apps/storefront/.env.local` (symlink to root)

## Required Variables

Add these to your `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Configuration (optional - defaults shown)
ADMIN_USERNAME=adminjack
ADMIN_PASSWORD=your-secure-password-here
ADMIN_NAME=Admin

# For login placeholder (optional)
NEXT_PUBLIC_ADMIN_USERNAME=admin

# Shopify (if using)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Notes

- `ADMIN_USERNAME` should match the email/username of the user in your database
- If `ADMIN_USERNAME` is not set, it defaults to `"adminjack"`
- The `NEXT_PUBLIC_ADMIN_USERNAME` is only for the login placeholder text
- Make sure `NEXTAUTH_SECRET` is set (generate with: `openssl rand -base64 32`)
