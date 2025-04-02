import Link from "next/link";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className, "border-t bg-[#F3F4F7]")}>
      <div className="container flex flex-col items-center my-8 gap-2">
        <p className="font-heading text-primary text-2xl font-bold">
          Budget Breeze
        </p>
        <div className='flex justify-between gap-5'>
          <Button variant={'link'} asChild>
            <Link href="privacy">Privacy Policy</Link>
          </Button>
          <Button variant={'link'} asChild>
            <Link href="terms">Terms of Service</Link>
          </Button>
          <Button variant={'link'} asChild>
            <Link href="mailto:contact@budget-breeze.com">Contact us</Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-center text-sm">
          Made with &#x2764;&#xfe0f; by Ghali Kettani
        </p>
        <p className="text-muted-foreground text-center text-sm">
          © 2025 Budget Breeze
        </p>
      </div>
    </footer>
  );
}
