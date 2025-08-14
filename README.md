# Galileo Blog

This project is for exercise purposes only and is not intended for production use.
Some features may not be fully implemented or tested.
And the data is just for demo purposes.

TBD: After information review by Alibaba Cloud and the internet filing process in China, the project will be launched for preview.

A full-stack blog platform built with **React + Vite**, **Node.js/Express**, **MongoDB (Mongoose)**, **Clerk** for auth, and **ImageKit** for media uploads. It features rich-text editing, infinite scrolling, save/feature posts, comments, and a hardened Clerk webhook pipeline.

> Demo stack highlights: TanStack Query for data fetching, optimistic updates, ImageKit uploads with progress/abort, and Svix-verified Clerk webhooks with idempotent upsert.

---

## Features

- 🔐 **Authentication** with Clerk (email/Google), protected routes, JWT on API calls
- 📝 **Rich text editor** (React Quill) with inline image/video insertion
- 🖼️ **Image/Video upload** via ImageKit (progress, abort; LQIP-ready)
- ♻️ **Data fetching** with TanStack Query (caching, mutations, optimistic updates)
- 🔎 **Infinite scrolling** on the post list
- ⭐ **Save** posts & **Feature** (pin) posts (admin only)
- 💬 **Comments** per post
- 🪝 **Clerk webhooks** (Svix signature verify, idempotent upsert)
- 🛡️ XSS sanitization ready (DOMPurify), Helmet/CORS/rate limit friendly

---

## Tech Stack

**Frontend:** React 19, Vite, React Router, TanStack Query, React Quill, Clerk React, Toastify, Tailwind utility classes, ImageKit  
**Backend:** Node.js, Express, Mongoose, Clerk (server), Svix (webhook verify), ImageKit SDK  
**DB:** MongoDB Atlas (Mongoose models & indexes)

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Clerk application (Frontend Publishable Key & Backend Secret Key)
- ImageKit account (urlEndpoint, publicKey, privateKey)

### Clone & install

```bash
git clone https://github.com/GalileoL/galileo-blog
cd galileo-blog

# Backend setup
cd backend && npm i
npm run dev                          # Development with .env.development
npm start:prod                       # Production with .env.production

# Frontend setup (in another terminal)
cd ../frontend && npm i

# Choose your build tool:
# Option 1: Vite (recommended for development)
npm run dev:vite                     # Development server with Vite
npm run build:vite                   # Production build with Vite
npm run preview:vite                 # Preview production build

# Option 2: Webpack (with optimizations)
npm run dev:webpack                  # Development server with Webpack
npm run build:webpack:dev            # Development build
npm run build:webpack:prod           # Production build with bundle analyzer
npm run build:webpack:dll            # Generate DLL for vendor libraries (optional)
```

### Environment Variables

Create environment files in both `backend` and `frontend` directories:

**Backend:**

- `.env.development` - for development mode
- `.env.production` - for production mode

**Frontend:**

- `.env.development` - for development mode
- `.env.production` - for production mode

Use the provided `.env.example` files as templates. Ensure you set the required variables like MongoDB URI, Clerk keys, and ImageKit credentials.

### API Endpoints

#### Posts

- `POST /api/posts` – create a post (auth)
- `GET /api/posts?page=1&limit=10` – list with pagination
- `GET /api/posts/:slug` – post detail
- `DELETE /api/posts/:id` – delete (owner/admin)
- `PATCH /api/posts/feature` – toggle "featured" (admin)

#### Comments

- `GET /api/comments/:postId` – list comments
- `POST /api/comments/:postId` – create comment (auth)
- `DELETE /api/comments/:commentId` – delete (owner/admin)

#### Users

- `GET /api/users/saved` – list saved post IDs (auth)
- `PATCH /api/users/save` – toggle save (auth)

#### Webhooks (Clerk)

- `POST /api/webhooks/clerk` – Clerk webhook endpoint (use raw body)

---

## Project Structure

```
galileo-blog/
├── README.md
├── LICENSE
│
├── backend/                        # Node.js/Express API server
│   ├── package.json
│   ├── index.js                    # Express app entry point
│   ├── .env.development            # Development environment
│   ├── .env.production             # Production environment
│   ├── controllers/                # Business logic
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # Express route definitions
│   ├── middlewares/                # Custom middleware
│   └── lib/                        # Utility modules
│
└── frontend/                       # React client application
    ├── package.json
    ├── index.html
    ├── .env.development            # Development environment
    ├── .env.production             # Production environment
    │
    ├── vite.config.js              # Vite configuration
    ├── webpack.base.config.js      # Webpack base configuration
    ├── webpack.dev.config.js       # Webpack development configuration
    ├── webpack.prod.config.js      # Webpack production configuration
    ├── webpack.dll.config.js       # Webpack DLL configuration
    │
    ├── dist-vite/                  # Vite build output
    ├── dist-webpack/               # Webpack build output
    │
    ├── public/                     # Static assets
    └── src/                        # React source code
        ├── components/             # Reusable components
        ├── pages/                  # Page components (routes)
        └── layouts/                # Layout components
```

---

## Frontend Highlights

- **TanStack Query** for queries & mutations
  - optimistic updates + rollback on error (feature/save)
  - invalidation on settle for eventual consistency
- **React Quill** lazy-loaded via `React.lazy` + `Suspense` to reduce first load
- **ImageKit uploads** with progress/abort; recommended to enable LQIP + responsive `srcset`
- **Skeletons/placeholders** to improve perceived performance
- **Dual Build System Support**:
  - **Vite** for fast development and modern builds
  - **Webpack** with advanced optimizations:
    - Bundle analyzer for production builds
    - DLL configuration for vendor library caching (optional)
    - Separate development and production configurations
    - CSS minimization and code splitting

---

## Security & Hardening

- Sanitize HTML content with **DOMPurify** before rendering/storing
- Add **Helmet**, **CORS whitelist**, and **express-rate-limit** in production
- **Mongoose schema validation** and indexes
  - `User.clerkUserId` unique index
  - `Post.slug` unique index
