"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "~/components/icons";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

type UserEmailAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const userAuthSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof userAuthSchema>

export function UserEmailAuth({ className, ...props }: UserEmailAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("callbackUrl") ?? "/app",
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    return toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }

  return (
    <div className={cn("", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4 flex-col md:flex-row lg:w-full">
          <div className="w-96">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Get Started
          </button>
        </div>
      </form>
    </div>
  );
}
