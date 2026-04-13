import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Nur Edge-kompatible Config – kein Prisma-Import
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/admin/:path*"],
};
