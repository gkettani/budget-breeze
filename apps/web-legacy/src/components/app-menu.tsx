import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { Icons } from "~/components/icons";
import { MobileNav } from "~/components/mobile-nav";
import { cn } from "~/lib/utils";
import type { MainNavItem } from "~/types";

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function AppMenu({ items, children }: MainNavProps) {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex gap-6">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className='h-6 w-6' />
      </Link>
      {items?.length ? (
        <nav className="hidden gap-2 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors sm:text-sm px-2 py-1 border border-white",
                item.href.endsWith(router.pathname)
                  ? "bg-muted border-inherit rounded-md"
                  : "text-foreground/70 hover:text-foreground",
                item.disabled && "cursor-not-allowed opacity-80",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.xmark /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  );
}
