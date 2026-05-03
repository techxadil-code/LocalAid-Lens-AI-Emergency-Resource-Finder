"use client";

import { DashboardFeed } from "@/components/dashboard-feed";
import { NavBar } from "@/components/nav-bar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Emergency Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time feed of emergency requests. Take charge and help save lives.
          </p>
        </div>
        <DashboardFeed />
      </main>
    </div>
  );
}
