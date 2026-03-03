"use client";

import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { DebitCard } from "@/components/debit-card";
import { CardActions } from "@/components/card-actions";
import { CardTransactions } from "@/components/card-transactions";
import { useCards } from "@/hooks/useCards";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";
import { cardApi } from "@/lib/cardApi";

export default function CardsPage() {
  const accountId = 1;
  const { cards, loading, error, refetch } = useCards(accountId);

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    accountId: 1,
    cardHolderName: "",
    category: "VISA",
    pin: "",
    cvv: "",
    spendingLimit: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);

    try {
      const payload = {
        ...formData,
        spendingLimit: parseFloat(formData.spendingLimit),
      };

      await cardApi.createCard(payload);
      alert(
        "Card created successfully!\n\n" +
        "Please visit your nearest Nigus Bank branch to collect your physical card and activate it."
      );
      setIsCreateOpen(false);
      setFormData({
        accountId: 1,
        cardHolderName: "",
        category: "VISA",
        pin: "",
        cvv: "",
        spendingLimit: "",
      });
      refetch();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create card");
    } finally {
      setCreateLoading(false);
    }
  };

  const [actionLoading, setActionLoading] = useState({
    freeze: false,
    block: false,
    pin: false,
    limit: false,
  });

  const selectedCard = cards[selectedCardIndex] || null;
  const selectedCardId = selectedCard?.id;

  const handleFreezeToggle = async () => {
    if (!selectedCardId) return;
    setActionLoading((prev) => ({ ...prev, freeze: true }));
    try {
      await cardApi.freezeCard(selectedCardId);
      alert(
        selectedCard.status === "FROZEN"
          ? "Card unfrozen successfully"
          : "Card frozen successfully"
      );
      refetch();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, freeze: false }));
    }
  };

  const handleBlockToggle = async () => {
    if (!selectedCardId) return;
    setActionLoading((prev) => ({ ...prev, block: true }));
    try {
      await cardApi.blockCard(selectedCardId);
      alert(
        selectedCard.status === "BLOCKED"
          ? "Already blocked card"
          : "Card blocked successfully"
      );
      refetch();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, block: false }));
    }
  };

const handleChangePin = async () => {
  if (!selectedCardId) {
    alert("No card selected");
    return;
  }
  if (selectedCard.status !== "ACTIVE") {
    alert(
      "Cannot change PIN on a " +
        selectedCard.status.toLowerCase() +
        " card.\n\n" +
        "Please reactivate the card first by visiting your nearest Nigus Bank branch or contacting support."
    );
    return;
  }
  const oldPin = prompt("Enter your current PIN:");
  if (!oldPin || !/^\d{4}$/.test(oldPin)) {
    alert("Current PIN must be exactly 4 digits.");
    return;
  }
  const newPin = prompt("Enter new 4-digit PIN:");
  if (!newPin || !/^\d{4}$/.test(newPin)) {
    alert("New PIN must be exactly 4 digits.");
    return;
  }
  setActionLoading((prev) => ({ ...prev, pin: true }));
  try {
    const response = await fetch("http://localhost:8084/cards/pin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardId: selectedCardId,
        oldPin,
        newPin,
      }),
    });
    if (response.ok) {
      alert("PIN changed successfully!");
    } else {
      // Read error message from response - this is the part that now works reliably
      let errorMessage = `Failed to change PIN (status ${response.status})`;
      try {
        const text = await response.text();
        if (text) {
          errorMessage = text.trim();
          // Try to parse JSON if possible
          if (text.includes("{")) {
            try {
              const data = JSON.parse(text);
              errorMessage = data.message || data.error || errorMessage;
            } catch {}
          }
        }
      } catch {}
      alert(errorMessage);
    }
  } catch (networkErr) {
    alert("Network error: " + (networkErr.message || "Cannot connect to server"));
  } finally {
    setActionLoading((prev) => ({ ...prev, pin: false }));
  }
};

const handleSetLimit = async () => {
  if (!selectedCardId) return;

  // Optional: disable for frozen/blocked cards (same as PIN)
  if (selectedCard.status !== "ACTIVE") {
    alert(
      "Cannot set spending limit on a " +
        selectedCard.status.toLowerCase() +
        " card.\n\n" +
        "Please reactivate the card first by visiting your nearest Nigus Bank branch or contacting support."
    );
    return;
  }

  const newLimit = prompt("Enter new spending limit (ETB):");
  const limitNum = parseFloat(newLimit || "");
  if (isNaN(limitNum) || limitNum <= 0) {
    alert("Invalid amount. Must be greater than 0.");
    return;
  }

  setActionLoading((prev) => ({ ...prev, limit: true }));

  try {
    await cardApi.setLimit(selectedCardId, limitNum);
    alert("Spending limit updated successfully");
    refetch();
  } catch (err: any) {
    let message = "Failed to update limit. Please try again.";

    if (err.message) {
      message = err.message;
    }

    if (err.response) {
      try {
        const data = await err.response.json();
        message = data.message || data.error || message;
      } catch {
        try {
          const text = await err.response.text();
          if (text) message = text.trim();
        } catch {}
      }
    }

    alert(message);
  } finally {
    setActionLoading((prev) => ({ ...prev, limit: false }));
  }
};

  const handleViewCvv = async () => {
    if (!selectedCardId) return;
    try {
      const cvv = await cardApi.getCvv(selectedCardId);
      alert(`Your CVV is: ${cvv}\n\n(This is shown for security. It will not be stored.)`);
    } catch (err: any) {
      alert("Failed to view CVV: " + (err.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="ml-56 flex flex-1 flex-col items-center justify-center">
          <p className="text-xl text-muted-foreground animate-pulse">Loading your cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="ml-56 flex flex-1 flex-col items-center justify-center">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="ml-56 flex flex-1 flex-col">
        <TopHeader />

        <main className="flex-1 p-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Cards</h1>

            <button
              onClick={() => setIsManageOpen(true)}
              className="group flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-base font-medium text-primary transition-all hover:bg-primary/20 hover:shadow-md active:scale-95"
            >
              <span>Manage All Cards</span>
              <span className="text-primary/70 transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-accent/50 p-12 text-center">
              <p className="text-xl font-medium text-foreground">No cards yet</p>
              <p className="mt-2 text-muted-foreground">
                Create your first card to get started!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex w-full flex-col gap-6 lg:flex-row lg:items-start">
                <div className="min-w-0 lg:flex-[2]">
  {selectedCard ? (
    <>
      <DebitCard
        cardNumber={selectedCard.maskedCardNumber}
        cardHolder={selectedCard.cardHolderName}
        expiry={selectedCard.expirationDate}
        status={selectedCard.status}
      />

      {/* Banner now in white space below the card */}
      {selectedCard.status !== "ACTIVE" && selectedCard.status && (
        <div className="mt-6 rounded-lg bg-yellow-500/20 p-4 text-center text-yellow-800 shadow-sm">
          <p className="font-medium">Card is {selectedCard.status}</p>
          <p className="mt-1 text-sm">
            To reactivate it or change PIN, please visit your nearest Nigus Bank branch or contact customer support.
          </p>
        </div>
      )}
    </>
  ) : (
    <p className="text-muted-foreground">Loading selected card...</p>
  )}
</div>

                <div className="lg:w-80 lg:flex-shrink-0">
<div className="lg:w-80 lg:flex-shrink-0">
  <CardActions
    onFreeze={handleFreezeToggle}
    onBlock={handleBlockToggle}
    onChangePin={handleChangePin}
    onSetLimit={handleSetLimit}
    loading={actionLoading}
    disabled={!selectedCard || !selectedCardId}
    status={selectedCard?.status || "ACTIVE"}
    selectedCardId={selectedCardId ?? 0}  // fallback to 0 if undefined
  />
</div>
                </div>
              </div>

              <CardTransactions />
            </>
          )}
        </main>
      </div>

      {/* Manage All Cards Drawer */}
      <Sheet open={isManageOpen} onOpenChange={setIsManageOpen}>
        <SheetContent
          side="right"
          className="w-[90%] max-w-2xl bg-background p-0 rounded-l-3xl shadow-2xl border-l border-border/50"
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-border bg-muted/30 px-6 py-5">
              <SheetTitle className="text-foreground text-2xl font-semibold">
                Manage All Cards
              </SheetTitle>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Your Cards ({cards.length})
                </h3>

                {cards.length === 0 ? (
                  <p className="text-muted-foreground">No cards found.</p>
                ) : (
                  <div className="space-y-3">
                    {cards.map((card: any, index: number) => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCardIndex(index)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5",
                          selectedCardIndex === index && "border-primary bg-primary/10 shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white text-xs font-bold">
                            {card.category}
                          </div>
                          <div>
                            <p className="font-medium tracking-wide">
                              {card.maskedCardNumber}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {card.cardHolderName} • {card.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          Expires {card.expirationDate}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border bg-muted/20 px-6 py-5">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-primary-foreground font-medium shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]">
                    <Plus className="h-5 w-5" />
                    Create New Card
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Create New Card</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardHolderName">Card Holder Name</Label>
                      <Input
                        id="cardHolderName"
                        name="cardHolderName"
                        value={formData.cardHolderName}
                        onChange={handleChange}
                        placeholder="Full name as on card"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="VISA">VISA</option>
                        <option value="MASTERCARD">MASTERCARD</option>
                        <option value="AMEX">AMEX</option>
                        <option value="PREPAID">PREPAID</option>
                        <option value="VIRTUAL">VIRTUAL</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN (4 digits)</Label>
                      <Input
                        id="pin"
                        name="pin"
                        type="password"
                        maxLength={4}
                        value={formData.pin}
                        onChange={handleChange}
                        placeholder="••••"
                        required
                        pattern="\d{4}"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV (3-4 digits)</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="•••"
                        required
                        pattern="\d{3,4}"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spendingLimit">Spending Limit (ETB)</Label>
                      <Input
                        id="spendingLimit"
                        name="spendingLimit"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.spendingLimit}
                        onChange={handleChange}
                        placeholder="5000.00"
                        required
                      />
                    </div>

                    {createError && (
                      <p className="text-sm text-red-500">{createError}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={createLoading}>
                      {createLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Card"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}