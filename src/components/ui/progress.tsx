import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const progressBarVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "bg-blue-100 dark:bg-blue-500/30",
        neutral: "bg-gray-100 dark:bg-gray-500/40",
        warning: "bg-yellow-100 dark:bg-yellow-500/30",
        error: "bg-red-100 dark:bg-red-500/30",
        success: "bg-emerald-100 dark:bg-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const BarVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "bg-blue-500 dark:bg-blue-500",
        neutral: "bg-gray-500 dark:bg-gray-500",
        warning: "bg-yellow-500 dark:bg-yellow-500",
        error: "bg-red-500 dark:bg-red-500",
        success: "bg-emerald-500 dark:bg-emerald-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ProgressBarProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressBarVariants> {};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      progressBarVariants({ variant }),
      "relative h-2 w-full overflow-hidden rounded-full",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(BarVariants({ variant }), "h-full w-full flex-1 transition-all rounded")}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
