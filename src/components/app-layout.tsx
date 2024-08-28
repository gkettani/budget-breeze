import { useSession } from "next-auth/react";
import { AppMenu } from "~/components/app-menu";
import { Toaster } from "~/components/ui/toaster";
import { UserAccountNav } from "~/components/user-account-nav";
import { appMenu } from "~/config/pages";
import { cn } from "~/lib/utils";

export default function AppLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string,
}) {
  const { data: session } = useSession();
  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-6">
          <AppMenu items={appMenu}/>
          <UserAccountNav
            user={{
              name: session?.user?.name ?? "",
              image: session?.user?.image ?? "",
              email: session?.user?.email ?? "",
            }}
          />
        </div>
      </header>
      <div className={cn("container mx-auto py-10", className)}>
        {children}
      </div>
      <Toaster />
    </div>
  );
}
