import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // White on teal is 3.3:1, which only meets WCAG AA at the large-text size set by `cta`.
        default: "bg-navy text-white hover:bg-navy/90",
        cta: "bg-teal text-white hover:bg-navy",
        destructive: "bg-navy text-white hover:bg-navy/90",
        outline: "border border-input bg-background text-navy hover:bg-ice",
        secondary: "bg-ice text-navy hover:bg-ice/70",
        ghost: "text-navy hover:bg-ice",
        link: "text-navy underline decoration-teal decoration-2 underline-offset-4",
        inverse: "bg-white text-navy hover:bg-ice",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 gap-1.5 px-3",
        lg: "h-12 px-6",
        // 19px bold qualifies as WCAG large text.
        cta: "min-h-14 rounded-full px-8 text-[1.1875rem] font-bold",
        pill: "h-11 rounded-full px-6",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
