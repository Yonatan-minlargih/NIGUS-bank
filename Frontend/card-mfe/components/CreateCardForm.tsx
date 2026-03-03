"use client";

import { useState } from "react";
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
import { cardApi } from "@/lib/cardApi";
import { Loader2 } from "lucide-react";

interface CreateCardFormProps {
  onCardCreated?: () => void; // callback to refresh card list after success
}

export function CreateCardForm({ onCardCreated }: CreateCardFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    accountId: 1, // ← hardcoded for now, later from logged-in user
    cardHolderName: "",
    category: "VISA",
    pin: "",
    cvv: "",
    spendingLimit: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Convert spendingLimit to number
      const payload = {
        ...formData,
        spendingLimit: parseFloat(formData.spendingLimit),
      };

      await cardApi.createCard(payload);
      alert("Card created successfully!");
      setOpen(false);

      // Reset form
      setFormData({
        accountId: 1,
        cardHolderName: "",
        category: "VISA",
        pin: "",
        cvv: "",
        spendingLimit: "",
      });

      // Refresh card list in parent
      if (onCardCreated) onCardCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Create New Card
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Card Holder Name */}
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

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => handleChange(e as any)}
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

          {/* PIN */}
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

          {/* CVV */}
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

          {/* Spending Limit */}
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

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
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
  );
}