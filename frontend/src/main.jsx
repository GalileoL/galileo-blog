// index.jsx
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

// ✅ React Query 推荐的默认配置（减少抖动）
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ✅ 改成懒加载
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PostListPage = lazy(() => import("./pages/PostListPage.jsx"));
const SinglePostPage = lazy(() => import("./pages/SinglePostPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const WritePage = lazy(() => import("./pages/WritePage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error("Missing Publishable Key");

// ✅ 用 Suspense 包住各个 route 元素
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/posts",
        element: (
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <PostListPage />
          </Suspense>
        ),
      },
      {
        path: "/posts/:slug",
        element: (
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <SinglePostPage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/write",
        element: (
          <Suspense fallback={<div className="p-8">Loading editor…</div>}>
            <WritePage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<div className="p-8">Loading…</div>}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <App>
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" />
        </App>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
