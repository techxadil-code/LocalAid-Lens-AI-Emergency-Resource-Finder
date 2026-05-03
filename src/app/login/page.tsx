"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Chrome } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.1),transparent)]" />
      
      <Card className="w-full max-w-md relative overflow-hidden border-none shadow-2xl shadow-violet-500/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
        <CardHeader className="text-center pt-10">
          <div className="flex justify-center mb-4">
            <div className="size-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/20 animate-pulse">
              <Heart className="text-white fill-white size-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Volunteer Portal</CardTitle>
          <CardDescription className="text-base mt-2">
            Join the offbeat response team to help coordinate resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 px-8">
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-medium rounded-xl gap-3 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            onClick={() => signInWithGoogle()}
          >
            <Chrome className="size-5 text-violet-600" />
            Continue with Google
          </Button>
          
          <p className="text-xs text-center text-slate-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
