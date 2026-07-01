"use client";

import { usePathname } from "next/navigation";

export function ChromeFrame({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hidePublicChrome = pathname.startsWith("/field");

  return (
    <>
      {hidePublicChrome ? null : header}
      {children}
      {hidePublicChrome ? null : footer}
    </>
  );
}
