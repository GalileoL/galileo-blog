# Galileo Blog

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

# backend
cd backend && npm i
npm run dev

# frontend (in another terminal)
cd ../frontend && npm i
npm run dev
```

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories based on the provided `.env.example` files. Ensure you set the required variables like MongoDB URI, Clerk keys, and ImageKit credentials.

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
│   │
│   ├── controllers/                # Business logic
│   │   ├── comment.controller.js   # Comment CRUD operations
│   │   ├── post.controller.js      # Post CRUD, ImageKit upload auth
│   │   ├── user.controller.js      # User saved posts management
│   │   └── webhook.controller.js   # Clerk webhook handling (Svix verify)
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── comment.model.js        # Comment schema (user, post, desc)
│   │   ├── post.model.js           # Post schema (title, slug, content, etc.)
│   │   └── user.model.js           # User schema (Clerk integration)
│   │
│   ├── routes/                     # Express route definitions
│   │   ├── comment.route.js        # Comment API routes
│   │   ├── post.route.js           # Post API routes
│   │   ├── user.route.js           # User API routes
│   │   └── webhook.route.js        # Webhook API routes
│   │
│   ├── middlewares/                # Custom middleware
│   │   └── increaseVisit.js        # Post view counter middleware
│   │
│   └── lib/                        # Utility modules
│       └── connectDB.js            # MongoDB connection setup
│
└── frontend/                       # React + Vite client application
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── README.md
    │
    ├── public/                     # Static assets
    │   ├── favicon.ico
    │   ├── logo.png
    │   ├── *.svg                   # Social media icons
    │   └── *.jpeg                  # Featured post images
    │
    └── src/                        # React source code
        ├── main.jsx                # React app entry point
        ├── App.jsx                 # Root component
        ├── App.css
        ├── index.css
        │
        ├── assets/                 # Static assets
        │   └── react.svg
        │
        ├── components/             # Reusable components
        │   ├── index.js            # Barrel exports
        │   │
        │   ├── imagekit/           # ImageKit integration
        │   │   ├── IKImage.jsx     # ImageKit image component
        │   │   └── IKUpload.jsx    # ImageKit upload component
        │   │
        │   ├── skeletons/          # Loading skeletons
        │   │   ├── FeaturePostsSkeleton.jsx
        │   │   ├── PostListSkeleton.jsx
        │   │   └── Skeleton.jsx
        │   │
        │   └── ui/                 # UI components
        │       ├── Comment.jsx     # Individual comment display
        │       ├── Comments.jsx    # Comments list & form
        │       ├── FeaturePosts.jsx # Featured posts showcase
        │       ├── MainCategories.jsx # Category navigation
        │       ├── NaviBar.jsx     # Top navigation
        │       ├── PostList.jsx    # Infinite scroll post list
        │       ├── PostListItem.jsx # Single post item
        │       ├── PostMenuActions.jsx # Save/Feature/Delete actions
        │       ├── Search.jsx      # Search functionality
        │       └── SideMenu.jsx    # Mobile navigation menu
        │
        ├── layouts/                # Layout components
        │   ├── index.js            # Barrel exports
        │   └── MainLayout.jsx      # Main app layout
        │
        └── pages/                  # Page components (routes)
            ├── index.js            # Barrel exports
            ├── HomePage.jsx        # Landing page
            ├── LoginPage.jsx       # Authentication page
            ├── NotFoundPage.jsx    # 404 error page
            ├── PostListPage.jsx    # Posts listing with filters
            ├── RegisterPage.jsx    # User registration
            ├── SinglePostPage.jsx  # Individual post view
            └── WritePage.jsx       # Rich text post editor
```

---

## Frontend Highlights

- **TanStack Query** for queries & mutations
  - optimistic updates + rollback on error (feature/save)
  - invalidation on settle for eventual consistency
- **React Quill** lazy-loaded via `React.lazy` + `Suspense` to reduce first load
- **ImageKit uploads** with progress/abort; recommended to enable LQIP + responsive `srcset`
- **Skeletons/placeholders** to improve perceived performance

---

## Security & Hardening

- Sanitize HTML content with **DOMPurify** before rendering/storing
- Add **Helmet**, **CORS whitelist**, and **express-rate-limit** in production
- **Mongoose schema validation** and indexes
  - `User.clerkUserId` unique index
  - `Post.slug` unique index
