# Nuxt 4 Fullstack Starter

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

A production-ready Nuxt 4 starter template with TypeScript, ESLint, Nuxt UI, Supabase, PWA support, and Google Analytics pre-configured. Clone and start building immediately.

## Features

- ⚡ **Nuxt 4** - Latest version with all modern features
- 📘 **TypeScript** - Full type safety out of the box (strict mode)
- 🎨 **Nuxt UI** - Beautiful, accessible components built on Tailwind CSS
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔐 **Supabase** - Authentication and database ready
- 📱 **PWA** - Installable, offline-ready Progressive Web App
- 📊 **Google Analytics** - Analytics tracking configured (nuxt-gtag)
- 🗃️ **Pinia** - State management with TypeScript support
- 🧪 **Testing** - Comprehensive testing setup:
  - **Vitest** - Unit and component tests
  - **Nuxt Test Utils** - Nuxt-specific testing utilities
  - **Playwright** - End-to-end testing
  - **Coverage** - Code coverage reporting with v8
- ✅ **ESLint** - Code quality and consistency (@nuxt/eslint)
- 🔧 **Vite** - Fast build tool and dev server
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🎯 **Iconify** - Icon library (Lucide & Simple Icons)
- 🛠️ **Nuxt DevTools** - Development tools for debugging
- 🚀 **Production Ready** - Optimized for deployment

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd nuxt4-fullstack-starter

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials (see Setup section below)
# Then start the dev server
pnpm dev
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Feature Flags
# Set to 'false' to disable Supabase (default: enabled if SUPABASE_URL is set)
ENABLE_SUPABASE=true

# Supabase Configuration
# Get these from: https://app.supabase.com → Your Project → Settings → API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here

# Google Analytics
# Get this from: https://analytics.google.com → Admin → Data Streams
GTAG_ID=G-XXXXXXXXXX
```

#### Getting Supabase Credentials

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the **Project URL** → `SUPABASE_URL`
5. Copy the **anon/public** key → `SUPABASE_KEY`

#### Getting Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a property or select an existing one
3. Go to **Admin** → **Data Streams**
4. Select your web stream
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`) → `GTAG_ID`

> **Note**: 
> - Set `ENABLE_SUPABASE=false` to completely disable Supabase (module won't load, no Supabase code will run)
> - The app will work without these credentials, but Supabase and Google Analytics features won't function until configured
> - When Supabase is disabled, all Supabase-related code is excluded from the build

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

Visit the demo pages to see Supabase and Google Analytics in action:
- `/demo/supabase` - Authentication and database examples
- `/demo/analytics` - Google Analytics event tracking examples

## PWA Customization

The PWA is configured in `nuxt.config.ts` under the `pwa` section. Customize:

- **Manifest**: Update `name`, `short_name`, `theme_color`, `background_color` in `nuxt.config.ts`
- **Icons**: Add your own icons to `public/`:
  - `pwa-192x192.png` (192x192px)
  - `pwa-512x512.png` (512x512px)
- **Offline**: Edit `public/offline.html` for custom offline page

The PWA works in both SSR and static modes. Icons are placeholders - replace them with your own.

## Supabase

Two ways to use Supabase:

1. **Module** (`@nuxtjs/supabase`) - Provides composables like `useSupabaseClient()` and `useSupabaseUser()`
2. **Plugin** (`app/plugins/supabase.client.ts`) - Direct client access via `$supabaseClient`

Both use `runtimeConfig` for credentials. The plugin is conditional based on `ENABLE_SUPABASE`.

## Testing

This project includes comprehensive testing setup with three types of tests:

### Unit Tests
Unit tests run in a Node.js environment and are perfect for testing pure functions and utilities.

```bash
pnpm test:unit
```

Example: `test/unit/example.test.ts`

### Component Tests
Component tests use Nuxt Test Utils with happy-dom for fast, isolated component testing.

```bash
pnpm test:nuxt
```

Example: `test/nuxt/component.test.ts`

### E2E Tests
End-to-end tests use Playwright to test the full application in a real browser.

```bash
pnpm test:e2e
```

Example: `tests/example.spec.ts`

### Running All Tests

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## State Management with Pinia

This project uses [Pinia](https://pinia.vuejs.org/) for state management. Stores are auto-imported from the `app/stores/` directory.

### Example Store

```typescript
// app/stores/example.ts
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

### Using Stores

Stores are auto-imported, so you can use them directly in your components:

```vue
<script setup lang="ts">
const exampleStore = useExampleStore()
</script>
```

## Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors automatically
- `pnpm typecheck` - Run TypeScript type checking

### Testing
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:unit` - Run unit tests only
- `pnpm test:nuxt` - Run Nuxt component tests only
- `pnpm test:e2e` - Run end-to-end tests with Playwright
- `pnpm test:e2e:ui` - Run E2E tests with Playwright UI

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

### Deployment

This template is ready to deploy to any platform that supports Nuxt:

- **Vercel**: Connect your repository, add environment variables, and deploy
- **Netlify**: Connect your repository, add environment variables, and deploy
- **Cloudflare Pages**: Connect your repository, add environment variables, and deploy

Make sure to add your environment variables in your deployment platform's settings.

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Project Structure

```
├── app/
│   ├── components/     # Vue components
│   ├── pages/          # Application pages
│   │   └── demo/       # Demo pages for Supabase and Analytics
│   ├── plugins/        # Nuxt plugins (Supabase client)
│   ├── stores/         # Pinia stores (auto-imported)
│   ├── assets/         # CSS and static assets
│   └── app.vue         # Root component
├── test/
│   ├── unit/           # Unit tests (Vitest)
│   └── nuxt/           # Component tests (Nuxt Test Utils)
├── tests/              # E2E tests (Playwright)
├── public/             # Static files (PWA icons, offline.html)
├── .env.example        # Environment variables template
├── nuxt.config.ts      # Nuxt configuration
├── vitest.config.ts    # Vitest configuration
├── playwright.config.ts # Playwright configuration
└── package.json        # Dependencies
```

## Tech Stack

### Core Framework
- **Nuxt 4** - Vue.js framework for building modern web applications
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed superset of JavaScript

### UI & Styling
- **Nuxt UI** - Component library built on Tailwind CSS
- **Tailwind CSS** - Utility-first CSS framework
- **Iconify** - Universal icon framework (Lucide & Simple Icons)

### Backend & Database
- **Supabase** - Open source Firebase alternative (PostgreSQL, Auth, Storage)

### State Management
- **Pinia** - Vue state management library

### Analytics
- **Google Analytics** - Web analytics service (via nuxt-gtag)

### Testing
- **Vitest** - Fast unit test framework powered by Vite
- **@nuxt/test-utils** - Testing utilities for Nuxt applications
- **@vue/test-utils** - Official Vue.js testing utilities
- **Playwright** - End-to-end testing framework
- **happy-dom** - Lightweight DOM implementation for testing
- **@vitest/coverage-v8** - Code coverage provider

### Code Quality & Tooling
- **ESLint** - JavaScript/TypeScript linter (@nuxt/eslint)
- **TypeScript** - Static type checking
- **Vite** - Next generation frontend build tool
- **pnpm** - Fast, disk space efficient package manager
- **Nuxt DevTools** - Development tools for debugging

## Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Nuxt Test Utils Documentation](https://nuxt.com/docs/getting-started/testing)
- [Vite Documentation](https://vitejs.dev/)
- [pnpm Documentation](https://pnpm.io/)
- [PWA with Vite](https://vite-pwa-org.netlify.app/)
