"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary/50 data-[state=unchecked]:bg-input",
      "hover:data-[state=checked]:bg-primary/60 hover:data-[state=unchecked]:bg-input/80",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-300 ease-in-out",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        "group-hover:scale-110"
      )}
    />
    <div className={cn(
      "absolute inset-0 rounded-full transition-all duration-300",
      "group-hover:shadow-[0_0_8px_hsl(var(--muted))]",
      "data-[state=checked]:shadow-[0_0_10px_hsl(var(--primary))] "
    )}/>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
