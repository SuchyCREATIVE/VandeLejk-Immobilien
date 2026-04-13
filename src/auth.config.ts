import type { NextAuthConfig } from "next-auth";

// Edge-kompatible Basis-Config (kein Prisma, kein Node.js)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn         = !!auth?.user;
      const mustChange         = !!(auth as { user?: { mustChangePassword?: boolean } })?.user?.mustChangePassword;
      const isAdminPath        = nextUrl.pathname.startsWith("/admin");
      const isLoginPage        = nextUrl.pathname === "/admin/login";
      const isVergessenPage    = nextUrl.pathname.startsWith("/admin/vergessen");
      const isResetPage        = nextUrl.pathname.startsWith("/admin/reset-passwort");
      const isChangePassPage   = nextUrl.pathname === "/admin/passwort-aendern";

      if (isLoginPage || isVergessenPage || isResetPage) {
        if (isLoggedIn && !mustChange) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }
      if (!isAdminPath) return true;
      if (!isLoggedIn)  return Response.redirect(new URL("/admin/login", nextUrl));
      if (mustChange && !isChangePassPage) return Response.redirect(new URL("/admin/passwort-aendern", nextUrl));
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id                = user.id;
        token.role              = (user as { role?: string }).role;
        token.mustChangePassword = (user as { mustChangePassword?: boolean }).mustChangePassword ?? false;
      }
      if (trigger === "update" && session?.mustChangePassword === false) {
        token.mustChangePassword = false;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const u = session.user as { id?: string; role?: string; mustChangePassword?: boolean };
        u.id                = token.id   as string;
        u.role              = token.role as string;
        u.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
  providers: [],
};
