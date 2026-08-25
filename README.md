# VIC ROYAL BEAUTY — Luxury Hair Storefront

A production-ready, high-performance single-vendor hair e-commerce storefront for **VIC ROYAL BEAUTY** (wigs, raw human hair bundles, HD lace closures, frontals, extensions, and luxury accessories). Built with Next.js 16 (App Router), Drizzle ORM + Neon PostgreSQL, Motion (`motion/react`), Embla Carousel, and direct WhatsApp order hand-off.

---

## 💎 Features & Architecture

### 🛍️ Storefront Experience
- **Debounced Live Search**: Instant hero search querying product names, category names, and search tags.
- **Continuous Auto-Scroll Hero Banner**: Motion-driven hero carousel using local media (`/hero/hero-1.png`, `/hero/hero-2.png`, `/hero/hero-3.png`).
- **Asymmetric Showcase Grid**: 12-column staggered layout displaying signature hair products.
- **Sticky Scroll-Story Section**: Smooth scroll-linked `scale` and `rotate` transforms using `useScroll` + `useTransform`.
- **Live Filter & Sorting**: Filter by **Newest Arrivals**, **Price: Low to High**, **Price: High to Low**, and **New Arrivals Only ✨**.
- **Mobile Responsive Cart Drawer**: 100% viewport width mobile optimization with smooth touch controls.
- **WhatsApp Checkout Handoff**: Cart snapshot saved to database (`pending` status) + mandatory review step before transferring to WhatsApp with pre-filled order details.
- **Floating Animated WhatsApp Button**: Pinned chat trigger using `/icons8-whatsapp.gif` with `mix-blend-multiply` and *"Chat with Us"* label.

### 🔐 Admin Management Console (`/admin`)
- **Self-Locking Auth**: Single-admin registration at `/auth/admin/register` self-locks after the owner account is created.
- **Product Management**: Create, edit, and delete products, toggle **New Arrival**, **Best Seller**, and **Featured** flags, and upload images.
- **Dynamic Categories**: Add or remove categories on the fly; newly created categories automatically appear in the site header and generate dedicated shop pages.
- **Order Management**: Track customer leads and update sale statuses (`pending`, `contacted`, `fulfilled`, `abandoned`).
- **Banner & Review Management**: Admin CRUD for hero slides and verified client reviews.
- **SEO Protection**: Admin routes excluded from search indexing via `robots.ts`.

---

## 🎨 Brand Color Palette

| Token Name | Hex Code | Purpose |
|---|---|---|
| **Background Dark** | `#0A0A0A` | Primary dark surface & background |
| **Deep Maroon / Plum** | `#2B0A1F` | Card borders, secondary surfaces & depth |
| **Primary Magenta Pink** | `#E6007E` | Main CTA buttons, active badges & accents |
| **Lighter Pink** | `#FF4FA0` | Price tags, text highlights & hover states |
| **Foreground Text** | `#FFFFFF` | Crisp contrast text |
| **WhatsApp Green** | `#25D366` | Floating chat & WhatsApp hand-off CTA |

> All prices are stored in whole naira and displayed with trailing `₦` symbol (e.g. `180,000₦`).

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (or Node.js 18+)
- Neon Serverless PostgreSQL Database Connection URL

### 1. Environment Configuration
Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER="2348000000000"
JWT_SECRET="your_secure_admin_jwt_secret"
UPLOADTHING_TOKEN="your_uploadthing_token"
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Initialize & Seed Database
Initialize database tables and seed 30 real hair products:

```bash
bun scripts/seed.ts
```

### 4. Run Development Server
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
.
├── app/
│   ├── admin/               # Admin Dashboard (Products, Orders, Categories, Hero, Reviews)
│   ├── api/                 # Next.js API Route Handlers
│   ├── auth/admin/          # Self-locking Admin Register & Login pages
│   ├── category/[slug]/     # Dynamic Category Listing Page
│   ├── product/[slug]/      # Product Detail Page
│   ├── globals.css          # Tailwind CSS v4 & Global Brand Styles
│   ├── layout.tsx           # Root Layout with CartProvider, Header, Footer & Floating WhatsApp
│   ├── page.tsx             # Storefront Landing Page
│   └── robots.ts            # Robots.txt search crawler configuration
├── components/
│   ├── cart/                # Cart Drawer & Checkout Triggers
│   ├── category/            # Live Category Grid & Sorting Select
│   ├── checkout/            # Checkout Form & Mandatory Review Step
│   ├── home/                # Hero Carousel, Search, Grids & Scroll Sections
│   ├── layout/              # Storefront Header & Footer
│   ├── product/             # Product Cards & Detail Views
│   └── ui/                  # Motion Buttons & Floating WhatsApp Trigger
├── constants.ts             # Centralized Brand Tokens & App Parameters
├── db/                      # Drizzle ORM Client & Table Schemas
│   ├── index.ts
│   └── schema/
├── lib/                     # Auth, Currency Formatting & WhatsApp Helpers
├── public/                  # Static Media, Hero Banners & Seed Images
├── scripts/                 # Line-count Auditor, DB Init & Seeding Scripts
└── types/                   # TypeScript Interfaces (0 inline types in components)
```

---

## 📐 Code Quality & Constraints
- **Strict 200 LOC Ceiling**: Every component, route handler, and helper file is strictly under 200 lines of code. Run audit via `bun scripts/verify-line-count.ts`.
- **Zero Inline Types**: All TypeScript definitions live in dedicated files inside `types/`.
- **Motion Design Rules**: Compositor-friendly properties (`opacity`, `transform`) only; respects `prefers-reduced-motion`.
