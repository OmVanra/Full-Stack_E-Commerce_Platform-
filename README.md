# 🛒 OmCart — Full-Stack E-Commerce Platform

A premium, modern, full-stack e-commerce application built with state-of-the-art web technologies. This application features a robust customer shopping experience and a comprehensive administrative dashboard.

[![Tech Stack](https://img.shields.io/badge/Stack-TanStack%20Start%20%7C%20React%2019%20%7C%20Supabase-blueviolet)](https://tanstack.com/router/v1/docs/start/overview)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-blue)](https://tailwindcss.com)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-green)](https://supabase.com)

---

## ✨ Features

### 🛍️ Customer Portal
- **Interactive Home Page**: Dynamic product slider, featured categories, and rich grid displays.
- **Product Details**: Comprehensive view of product info, specifications, reviews, and interactive image gallery.
- **Shopping Cart**: Fully functional state-managed cart to adjust quantities, remove items, and see live pricing calculations.
- **Checkout Process**: Step-by-step checkout process including shipping details, payment configurations, and order summaries.
- **User Authentication**: Secure Login/Signup/Signout powered by **Supabase Auth**.
- **Customer Orders**: Detailed order history tracker showing order status and purchase summaries.
- **User Profile**: Access and update user account preferences.

### 👑 Admin Control Panel
- **Metrics Dashboard**: Visual sales graphs and statistics utilizing **Recharts**.
- **Product Management**: Complete CRUD operations (Create, Read, Update, Delete) for products.
- **Order Management**: Monitor and transition order statuses (Pending, Processing, Shipped, Delivered, Cancelled) for customers.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React 19 + SSR + TanStack Router)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL, Auth, Migrations)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (next-gen high-performance engine)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev)
- **Charts**: [Recharts](https://recharts.org)

---

## 📂 Project Structure

```text
omcart/
├── .lovable/                 # Lovable environment configuration metadata
├── src/
│   ├── components/           # Reusable UI components (header, buttons, inputs, etc.)
│   ├── contexts/             # Global context providers (AuthContext, CartContext)
│   ├── hooks/                # Custom utility React hooks
│   ├── integrations/         # Supabase client configurations and types
│   ├── lib/                  # Helper utilities, error reporting, and config helpers
│   ├── routes/               # TanStack Router folder-based routing system
│   │   ├── __root.tsx        # Base root layout wrapper
│   │   ├── index.tsx         # Home page (Customer Portal)
│   │   ├── auth.tsx          # Login & Signup screen
│   │   ├── cart.tsx          # Shopping Cart page
│   │   ├── checkout.tsx      # Shipping/Payment Checkout flow
│   │   ├── orders.tsx        # Customer Order history
│   │   └── admin/            # Nested routes for Admin controls (dashboard, products, orders)
│   ├── server.ts             # SSR server entry point
│   ├── start.ts              # Client-side hydration entry point
│   └── styles.css            # Tailwind custom global stylesheet
├── supabase/
│   ├── migrations/           # SQL migration files for Database tables
│   └── config.toml           # Supabase CLI configuration
├── seed-products.js          # Helper script to populate product data
├── apply-migration.js        # Helper script to execute migrations locally
└── package.json              # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** (or **Bun** package manager) installed.

### ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OmVanra/Full-Stack_E-Commerce_Platform-.git
   cd Full-Stack_E-Commerce_Platform-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or using bun:
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on your credentials) containing the following variables:
   ```env
   SUPABASE_PROJECT_ID="your_supabase_project_id"
   SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
   SUPABASE_URL="https://your_supabase_project_id.supabase.co"
   VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
   VITE_SUPABASE_URL="https://your_supabase_project_id.supabase.co"
   ```

4. **Seed the database (Optional):**
   If you have a Supabase instance running and want to seed mock products:
   ```bash
   node seed-products.js
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   # or using bun:
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Starts the dev server with Hot Module Replacement (HMR).
- `npm run build`: Builds the production-ready bundle.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to verify code quality.
- `npm run format`: Standardizes code style via Prettier.
