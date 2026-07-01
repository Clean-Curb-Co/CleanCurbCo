import type { AppRole } from "@/types/database";

export function isAdminRole(role?: AppRole | null) {
  return role === "admin" || role === "owner";
}

export function isOwnerRole(role?: AppRole | null) {
  return role === "owner";
}

export function isFieldRole(role?: AppRole | null) {
  return role === "technician" || isAdminRole(role);
}

export function defaultRouteForRole(role?: AppRole | null) {
  if (isAdminRole(role)) return "/admin";
  if (role === "technician") return "/field/today";
  return "/portal";
}

export function canRoleAccessPath(role: AppRole | null | undefined, path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (isAdminRole(role)) return true;
  if (role === "technician") return path.startsWith("/field");
  return path.startsWith("/portal") || path.startsWith("/account-setup");
}
