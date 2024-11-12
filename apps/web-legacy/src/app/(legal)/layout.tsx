import Link from "next/link";
import { MainNav } from "~/components/main-nav";
import { SiteFooter } from "~/components/site-footer";
import { buttonVariants } from "~/components/ui/button";
import { marketingNav } from "~/config/pages";
import { getCurrentUser } from "~/lib/session";
import { cn } from "~/lib/utils";

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingNav} />
          <nav className='flex gap-4'>
            {user ? (
              <Link
                href="/app"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "px-4",
                )}
              >
                Dashboard
              </Link>
            ): (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "px-4",
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "px-4",
                  )}
                >
                  Get started free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
