"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy initialization of Convex client to avoid build-time errors
function getConvexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    // Return a placeholder during build - will be replaced at runtime
    return "https://placeholder.convex.cloud";
  }
  return url;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  // Create Convex client lazily inside the component
  const convex = useMemo(() => {
    return new ConvexReactClient(getConvexUrl());
  }, []);

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ec4899", // Pink to match brand
          colorBackground: "#ffffff",
          colorText: "#1f2937",
          colorInputBackground: "#f9fafb",
          borderRadius: "12px",
        },
        elements: {
          formButtonPrimary:
            "bg-pink-500 hover:bg-pink-600 text-white font-medium",
          card: "shadow-xl border border-pink-100",
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton:
            "border border-gray-200 hover:bg-gray-50",
          formFieldInput:
            "border-gray-200 focus:border-pink-500 focus:ring-pink-500",
          footerActionLink: "text-pink-500 hover:text-pink-600",
        },
      }}
    >
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ConvexProvider>
    </ClerkProvider>
  );
}
