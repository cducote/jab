# Headless E-commerce Storefront

A modern, performant headless e-commerce storefront built with Next.js 15, TypeScript, and Shopify Storefront API. Features a tactile UI design with deformable buttons, liquid glass effects, and smooth micro-interactions.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **E-commerce Backend**: Shopify Storefront API
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Hosting**: Railway
- **Deployment**: Auto-deploy for dev/test/prod environments

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Shopify store with Storefront API access
- NeonDB account (free tier available)
- Railway account (Hobby plan)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd jab

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Database (NeonDB)
DATABASE_URL=postgresql://user:password@host/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Environment
NODE_ENV=development
```

### Run Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
jab/
├── apps/
│   └── storefront/          # Next.js storefront application
│       ├── app/             # App Router pages and layouts
│       ├── components/      # React components
│       ├── lib/             # Utilities and helpers
│       ├── hooks/           # Custom React hooks
│       ├── store/           # Zustand stores
│       ├── types/           # TypeScript type definitions
│       └── public/          # Static assets
├── packages/                # Shared packages (if any)
├── .env.local              # Environment variables (gitignored)
├── package.json
└── README.md
```

## Deployment

### Railway Deployment

The project is configured for automatic deployment on Railway with three environments:

1. **Development**: Auto-deploys on push to `develop` branch
2. **Test**: Auto-deploys on push to `test` branch
3. **Production**: Auto-deploys on push to `main` branch

#### Setup Steps

1. Connect your GitHub repository to Railway
2. Create three separate services for dev/test/prod environments
3. Configure environment variables for each service:
   - Set `NODE_ENV` to `development`, `test`, or `production`
   - Add all required environment variables (see Environment Setup)
4. Set up auto-deploy triggers:
   - Dev service: `develop` branch
   - Test service: `test` branch
   - Prod service: `main` branch

#### Environment Variables on Railway

Ensure all environment variables from `.env.local` are set in Railway dashboard for each environment.

### Database Setup (NeonDB)

1. Create a new project in NeonDB
2. Copy the connection string to `DATABASE_URL`
3. Run migrations:
   ```bash
   npm run db:migrate
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Design Philosophy

This storefront follows a **Tactile UI** design approach:

- **Deformable Buttons**: Interactive elements that respond to user input
- **Liquid Glass Effects**: Modern glassmorphism design elements
- **Expressive Typography**: Carefully crafted type hierarchy
- **Smooth Micro-interactions**: Delightful animations and transitions
- **Contextual Minimalism**: Clean interface that adapts to context
- **Accessibility-First**: WCAG 2.1 AA compliant
- **AI-Assisted Anticipatory Features**: Smart, predictive user experiences

## Budget Considerations

Designed to operate within a **$5-30/month** budget:
- Railway Hobby Plan: ~$5-20/month
- NeonDB Free Tier: $0/month (with usage limits)
- Additional services: Minimal or free tier options

## Mobile-First & Performance

- Responsive design optimized for mobile devices
- Performance-focused with Core Web Vitals in mind
- Server-side rendering and static generation where appropriate
- Image optimization and lazy loading

## License

[Add your license here]

## Contributing

[Add contributing guidelines if applicable]
