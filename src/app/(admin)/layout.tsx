"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const link = (document.querySelector("link[rel='icon']") as HTMLLinkElement)
      ?? Object.assign(document.createElement("link"), { rel: "icon" });
    link.href = "/favicon-admin.png";
    document.head.appendChild(link);
    return () => { link.href = "/favicon.png"; };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
