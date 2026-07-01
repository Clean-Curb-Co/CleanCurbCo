"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <button
      className="button button-outline"
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
    >
      <LogOut size={18} aria-hidden="true" />
      {isSubmitting ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
