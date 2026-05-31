# CLAUDE.md — inteq-app

## Project Overview

Furniture e-commerce store built with Next.js (App Router). Pakistani market — prices in Rs., Bahawalpur-based business.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode) — everything must be fully typed, no `any`
- **Styling:** Tailwind CSS v4 (imported via `@import "tailwindcss"` in globals.css)
- **State Management:** Redux Toolkit (RTK) with typed hooks
- **Package Manager:** npm (package-lock.json is source of truth; bun.lock is gitignored)

## Brand Constants

- Gold/Primary: `#E8B800`
- Teal/Secondary: `#3D6B6B`
- Defined in `constants/index.ts` — always reference constants, never hardcode new brand values

## Project Structure

```
app/                          # Next.js App Router pages
  layout.tsx                  # Root layout (Geist font)
  page.tsx                    # Homepage
  signin/page.tsx             # Login
  signup/page.tsx             # Registration
  categories/
    office-chairs/page.tsx    # Category listing
components/
  layout/                     # AnnouncementBar, Header, Footer
  sections/                   # Page sections (HeroSection, CategoryGrid, ProductCard, etc.)
  ui/                         # Reusable primitives (Button, Input)
constants/                    # Brand colors, site name
lib/                          # Utilities (cn helper)
types/                        # Shared type re-exports
public/                       # Static assets (sofa.png, backAero.png, SVGs)
```

## Architecture Rules

### State Management (Redux)

- Use **Redux Toolkit** — `createSlice`, `createAsyncThunk`, `configureStore`
- Store goes in `store/` directory:
  - `store/index.ts` — configureStore, export RootState, AppDispatch
  - `store/hooks.ts` — typed `useAppSelector`, `useAppDispatch` hooks
  - `store/slices/` — one file per slice (e.g., `cartSlice.ts`, `authSlice.ts`, `productsSlice.ts`)
- **Always use typed hooks** (`useAppSelector`, `useAppDispatch`) — never use raw `useSelector`/`useDispatch`
- Wrap app with `<Provider>` in a client component wrapper, not directly in `layout.tsx`
- Slice state interfaces must be explicitly defined and exported
- Use `PayloadAction<T>` for all reducer action types
- Async operations use `createAsyncThunk` with typed return and argument generics

### TypeScript

- Strict mode is on — no implicit any, no unchecked index access
- All component props must have explicit interfaces (not inline types)
- Export shared types from `types/` — component-specific types stay with the component
- Use `interface` for object shapes, `type` for unions/intersections/aliases
- API responses must have corresponding type definitions before use

### Components

- **Server Components by default** — only add `"use client"` when using hooks/interactivity
- Client components that need Redux must have `"use client"` directive
- Props interfaces are named `{ComponentName}Props`
- Default exports for all components
- Keep components focused — one responsibility per file
- Use `@/` path alias for all imports (configured in tsconfig)

### Styling

- Tailwind utility classes as the primary styling method
- Custom CSS only in `globals.css` for complex layouts (see footer as example)
- No CSS modules, no styled-components
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Use `cn()` from `lib/utils.ts` for conditional class merging

### Images

- Use Next.js `<Image>` for optimized images where possible
- Remote image domains configured in `next.config.ts` (figma.com, unsplash.com)
- Local assets in `public/` — reference as `/filename.ext`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Current State & Known Gaps

- Frontend-only — no backend, no API routes, no database
- Auth forms log to console (TODO: connect to auth service)
- `/cart` route does not exist (Header links to it)
- Most nav links are `href="#"` placeholders
- Only `/categories/office-chairs` has a real route — other categories are stubs
- Sidebar filters hold local state but don't filter products
- Pagination is visual only — same data on every page
- "ADD TO CART", wishlist, compare buttons have no handlers
- Newsletter subscribe clears input but makes no API call
- Footer uses Figma API asset URLs for images (may break if token expires)

## Code Conventions

- Named imports for non-default exports, barrel files (`index.ts`) in each component directory
- Event handlers named `handle{Event}` (e.g., `handleSubmit`, `handleChange`)
- No console.log in production code (existing ones are TODOs to replace)
- Prefer `const` arrow functions for internal helpers, `function` declarations for exported components
- No magic strings — extract to constants or enums
