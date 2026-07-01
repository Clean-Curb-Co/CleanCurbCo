import type { AppRole } from "@/types/database";

export function isAdminRole(role?: AppRole | null) {
  return role === "admin" || role === "owner";
}
