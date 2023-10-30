"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function NavRoutes({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
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
      href: `/surveys`,
      label: 'Surveys',
      active: pathname.startsWith('/surveys'),
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
    <nav
      className={cn("hidden md:flex items-center space-x-4 mx-10 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-base font-medium transition-colors hover:text-primary',
            route.active ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
};