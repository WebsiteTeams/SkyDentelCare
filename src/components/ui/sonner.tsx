"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="light"
    position="top-right"
    toastOptions={{
      classNames: {
        toast: "!rounded-lg !border-border !bg-white !text-charcoal !shadow-soft",
        title: "!font-semibold !text-navy",
      },
    }}
    {...props}
  />
)

export { Toaster }
