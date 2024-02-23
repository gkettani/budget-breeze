import Link from "next/link";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center my-12 gap-2">
        <p className="font-heading text-primary text-2xl font-bold">
          Budget Breeze
        </p>
        <p className="text-muted-foreground text-center text-sm">
          Copyright © 2024 Budget Breeze, Inc.
        </p>
        <div className='flex justify-between gap-5'>
          <Button variant={'link'} asChild>
            <Link href="#">Legal Stuff</Link>
          </Button>
          <Button variant={'link'} asChild>
            <Link href="#">Privacy Policy</Link>
          </Button>
          <Button variant={'link'} asChild>
            <Link href="#">Terms of Service</Link>
          </Button>
          <Button variant={'link'} asChild>
            <Link href="#">Manage Cookies</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
