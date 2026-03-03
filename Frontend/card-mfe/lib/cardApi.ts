// lib/cardApi.ts
const API_BASE = "http://localhost:8084";

export const cardApi = {
  // 1. Get all cards for one account
getCards: async (accountId: number, signal?: AbortSignal) => {
  const res = await fetch(`${API_BASE}/cards/account/${accountId}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
},

  // 2. Create a new card
  createCard: async (data: any) => {
    const res = await fetch(`${API_BASE}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create card");
    return res.json();
  },

  // 3. Freeze card
  freezeCard: async (cardId: number) => {
    const res = await fetch(`${API_BASE}/cards/freeze/${cardId}`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to freeze card, Blocked card can not be frozen");
    return res.ok;
  },

  // 4. Block card
  blockCard: async (cardId: number) => {
    const res = await fetch(`${API_BASE}/cards/block/${cardId}`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to block card");
    return res.ok;
  },

  // 5. Change PIN
  changePin: async (cardId: number, oldPin: string, newPin: string) => {
    const res = await fetch(`${API_BASE}/cards/pin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, oldPin, newPin }),
    });
    if (!res.ok) throw new Error("Failed to change PIN");
    return res.ok;
  },

  // 6. Update spending limit
  setLimit: async (cardId: number, spendingLimit: number) => {
    const res = await fetch(`${API_BASE}/cards/limit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, spendingLimit }),
    });
    if (!res.ok) throw new Error("Failed to update limit");
    return res.ok;
  },
  getCvv: async (cardId: number) => {
  const res = await fetch(`${API_BASE}/cards/${cardId}/cvv`);
  if (!res.ok) throw new Error(await res.text() || "Failed to fetch CVV");
  const data = await res.json();
  return data.cvv;
},
};