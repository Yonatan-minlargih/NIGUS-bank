"use client"

import { Snowflake, Hash, Eye, TrendingDown, ChevronRight, Menu, Lock } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cardApi } from "@/lib/cardApi"

const actions = [
  { label: "Freeze Card", icon: Snowflake, key: "freeze" },
  { label: "Block Card", icon: Lock, key: "block" },
  { label: "Change PIN", icon: Hash, key: "pin" },
  { label: "View CVV", icon: Eye, key: "viewCvv" },
  { label: "Set Spending Limit", icon: TrendingDown, key: "limit" },
]

interface CardActionsProps {
  onFreeze: () => void
  onBlock: () => void
  onChangePin: () => void
  onSetLimit: () => void
  loading: { freeze: boolean; block: boolean; pin: boolean; limit: boolean }
  disabled?: boolean
  status?: string
  selectedCardId?: number  // required for getCvv
}

function ActionButton({
  action,
  onClick,
  isLoading,
  disabled,
}: {
  action: (typeof actions)[0]
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
}) {
  return (
    <Button
      variant="outline"
      className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-border px-4 py-3.5 text-left transition-all hover:bg-accent active:scale-[0.98] disabled:opacity-60"
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <action.icon className="h-5 w-5" />}
        </div>
        <span className="flex-1 text-sm font-semibold">{action.label}</span>
      </div>
      <ChevronRight className="h-4 w-4 opacity-60" />
    </Button>
  )
}

export function CardActions({
  onFreeze,
  onBlock,
  onChangePin,
  onSetLimit,
  loading = { freeze: false, block: false, pin: false, limit: false },
  disabled = false,
  status = "ACTIVE",
  selectedCardId,
}: CardActionsProps) {
  const [cvvLoading, setCvvLoading] = useState(false);
  const [cvv, setCvv] = useState<string | null>(null);

  const actionHandlers = {
    freeze: onFreeze,
    block: onBlock,
    pin: onChangePin,
    limit: onSetLimit,
    viewCvv: async () => {
      if (!selectedCardId) {
        alert("No card selected");
        return;
      }
      if (status !== "ACTIVE") {
        alert("Cannot view CVV on a non-active card");
        return;
      }

      setCvvLoading(true);
      try {
        const fetchedCvv = await cardApi.getCvv(selectedCardId);
        setCvv(fetchedCvv);

        // Auto-hide after 10 seconds
        setTimeout(() => setCvv(null), 10000);
      } catch (err: any) {
        alert("Failed to view CVV: " + (err.message || "Unknown error"));
      } finally {
        setCvvLoading(false);
      }
    },
  }

  const isPinDisabled = disabled || status !== "ACTIVE";

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Card Actions
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              onClick={actionHandlers[action.key as keyof typeof actionHandlers]}
              isLoading={action.key === "viewCvv" ? cvvLoading : loading[action.key as keyof typeof loading] ?? false}
              disabled={
                (action.key === "pin" || action.key === "limit")
                  ? (disabled || status !== "ACTIVE")
                  : disabled
              }
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Card Actions</span>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Card Actions</SheetTitle>
            </SheetHeader>
            <div className="mt-6 grid gap-3">
              {actions.map((action) => (
                <ActionButton
                  key={action.label}
                  action={action}
                  onClick={actionHandlers[action.key as keyof typeof actionHandlers]}
                  isLoading={action.key === "viewCvv" ? cvvLoading : loading[action.key as keyof typeof loading] ?? false}
                  disabled={
                    (action.key === "pin" || action.key === "limit")
                      ? (disabled || status !== "ACTIVE")
                      : disabled
                  }
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* CVV Modal - smaller text */}
      <Dialog open={!!cvv} onOpenChange={() => setCvv(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Card CVV</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-4xl sm:text-5xl font-mono tracking-widest text-primary">{cvv}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              This will hide in 10 seconds for security
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}