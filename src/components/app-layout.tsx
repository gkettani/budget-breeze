import { useSession } from "next-auth/react";
import { AppMenu } from "~/components/app-menu";
import { Toaster } from "~/components/ui/toaster";
import { UserAccountNav } from "~/components/user-account-nav";
import { appMenu } from "~/config/pages";
import { cn } from "~/lib/utils";
import { Icons } from "./icons";

export default function AppLayout({
  children,
  className,
  isLoading,
}: {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) {
  const { data: session } = useSession();
  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-6">
          <AppMenu items={appMenu} />
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
        {isLoading ? (
          <Icons.spinner className="m-auto h-6 w-6 animate-spin text-primary mt-64" />
        ) : (
          <>{children}</>
        )}
      </div>
      <Toaster />
    </div>
  );
}
