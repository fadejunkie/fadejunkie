"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";

const OWNER_EMAIL = "tatis.anthony@gmail.com";

export default function CCLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="text-[#888] font-mono text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CCSignIn />;
  }

  return <CCOwnerGate>{children}</CCOwnerGate>;
}

function CCSignIn() {
  const { signIn } = useAuthActions();

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-xl font-semibold mb-2">Control Center</h1>
        <p className="text-[#888] text-sm mb-4">Owner access required.</p>
        <button
          onClick={() => void signIn("google")}
          className="px-4 py-2 bg-white text-[#0e0e0e] rounded text-sm font-medium hover:bg-[#e0e0e0] transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

function CCOwnerGate({ children }: { children: React.ReactNode }) {
  const viewer = useQuery(api.users.currentUser);

  if (viewer === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="text-[#888] font-mono text-sm">Verifying access...</p>
      </div>
    );
  }

  if (!viewer || viewer.email?.toLowerCase() !== OWNER_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-xl font-semibold mb-2">Access Denied</h1>
          <p className="text-[#888] text-sm">This area is restricted to the project owner.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
