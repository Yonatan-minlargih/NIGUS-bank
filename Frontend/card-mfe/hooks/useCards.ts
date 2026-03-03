// hooks/useCards.ts
import { useState, useEffect, useCallback } from "react";
import { cardApi } from "@/lib/cardApi";

export function useCards(accountId: number) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The function to fetch cards (we can call it multiple times)
  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cardApi.getCards(accountId);
      setCards(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  // Run once when component mounts or accountId changes
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Return fetchCards so parent can call it to refresh
  return { cards, loading, error, refetch: fetchCards };
}