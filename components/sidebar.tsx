"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Logo } from "@/components/logo"

export const Sidebar = () => {
  const pathname = usePathname();

  const routes = [
    {
      href: `/dashboard`,
      label: 'Dashboard',
      active: pathname.startsWith('/dashboard'),
    },
    {
      href: `/orders`,
      label: 'Orders',
      active: pathname.startsWith('/orders'),
    },
    {
      href: `/companies`,
      label: 'Companies',
      active: pathname.startsWith('/companies'),
    },
    {
      href: `/profiles`,
      label: 'Profiles',
      active: pathname.startsWith('/profiles'),
    },
  ]

  return (
    <div className="h-full overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col p-6">
        <Logo />
        <ul className="flex flex-col mt-20 text-center gap-y-10">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-2xl font-medium transition-colors hover:text-primary',
                route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
              )}
            >
              {route.label}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )
}