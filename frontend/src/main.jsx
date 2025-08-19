// index.jsx
import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { setAuthTokenProvider } from "./auth/tokenProvider.js";

// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 1 },
  },
});

// lazy-loaded components
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
console.log(import.meta.env.VITE_API_URL);

// Wrap each route element with Suspense
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

function WireClerkTokenProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();
  useEffect(() => {
    setAuthTokenProvider(async (opt = {}) => {
      const t = await getToken({ skipCache: !!opt?.skipCache });
      return t || null;
    });
  }, [getToken, isSignedIn]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <WireClerkTokenProvider>
        <QueryClientProvider client={queryClient}>
          <App>
            <RouterProvider router={router} />
            <ToastContainer position="bottom-right" />
          </App>
        </QueryClientProvider>
      </WireClerkTokenProvider>
    </ClerkProvider>
  </StrictMode>
);
