import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
  { href: "/profile", label: "Profile" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            3 Zone Sports
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sports media platform</p>
        </div>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-slate-900" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
