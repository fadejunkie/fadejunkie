"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn } = useAuthActions();

  const initialTab = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, password, flow: tab === "signup" ? "signUp" : "signIn" });
      router.push("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">FadeJunkie</h1>
          <p className="text-sm text-muted-foreground mt-1">The barber community</p>
        </div>

        <Card className="p-6 shadow-sm">
          <Tabs value={tab} onValueChange={setTab} className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="signin" className="flex-1">Sign in</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign up</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={tab === "signup" ? "email" : "username"}
            />
            <Input
              label="Password"
              type="password"
              placeholder={tab === "signup" ? "Create a password" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={tab === "signup" ? "new-password" : "current-password"}
            />

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              {tab === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {tab === "signup" ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setTab("signin")} className="text-foreground font-medium hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to fadejunkie?{" "}
                <button onClick={() => setTab("signup")} className="text-foreground font-medium hover:underline">
                  Create account
                </button>
              </>
            )}
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
