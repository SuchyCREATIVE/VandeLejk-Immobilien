"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, MessageSquareQuote, Building2, Settings, LogOut, Users } from "lucide-react";

const NAV = [
  { href: "/admin",               icon: LayoutDashboard,    label: "Übersicht",       adminOnly: false },
  { href: "/admin/kundenstimmen", icon: MessageSquareQuote, label: "Kundenstimmen",   adminOnly: false },
  { href: "/admin/immobilien",    icon: Building2,           label: "Immobilien",      adminOnly: false },
  { href: "/admin/einstellungen", icon: Settings,            label: "Einstellungen",   adminOnly: true  },
  { href: "/admin/benutzer",      icon: Users,               label: "Benutzer",        adminOnly: true  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path    = usePathname();
  const { data: session } = useSession();
  const isLogin = path === "/admin/login";
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  if (isLogin) return <>{children}</>;

  const visibleNav = NAV.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex bg-[#f5f4f1]">
      {/* ─── Sidebar ─── */}
      <aside className="w-56 bg-anthrazit-dark flex flex-col shrink-0">
        <div className="px-6 py-7 border-b border-white/10">
          <div className="relative w-28 h-7">
            <Image src="/Logo/SVG/VandeLejk-Logo-weiss.svg" alt="VandeLejk" fill className="object-contain object-left" />
          </div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-white/30 mt-2">Administration</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-0.5">
          {visibleNav.map((item) => {
            const active = item.href === "/admin"
              ? path === "/admin"
              : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide transition-colors rounded-sm ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6 border-t border-white/10 pt-4">
          {session?.user && (
            <p className="px-3 mb-3 text-[10px] text-white/30 truncate">
              {session.user.name} · {isAdmin ? "Admin" : "Redakteur"}
            </p>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-wide text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut size={15} />
            Abmelden
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
