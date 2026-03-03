"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Wallet, Briefcase, Loader2 } from "lucide-react";
import { apiClient, Account } from "@/lib/api";

interface AccountCardProps {
  title: string;
  lastFour: string;
  balance: string;
  icon: React.ReactNode;
}

function AccountCard({ title, lastFour, balance, icon }: AccountCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-bank-green-card p-5 text-primary-foreground transition-transform hover:scale-[1.02]">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-primary-foreground/80">
            {title}
          </p>
          <p className="mt-1 font-mono text-xs tracking-widest text-primary-foreground/60">
            {"**** "}
            {lastFour}
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground/10">
          {icon}
        </div>
      </div>

      {/* Balance */}
      <div className="mt-6">
        <span className="text-2xl font-bold tracking-tight">{balance}</span>
        <span className="ml-2 text-sm font-medium text-primary-foreground/70">
          ETB
        </span>
      </div>
    </div>
  );
}

function getAccountIcon(type: string) {
  switch (type) {
    case "SAVING":
      return <PiggyBank className="h-4 w-4 text-primary-foreground/70" />;
    case "CHECKING":
      return <Wallet className="h-4 w-4 text-primary-foreground/70" />;
    case "BUSINESS":
      return <Briefcase className="h-4 w-4 text-primary-foreground/70" />;
    default:
      return <Wallet className="h-4 w-4 text-primary-foreground/70" />;
  }
}

function getAccountLabel(type: string) {
  switch (type) {
    case "SAVING":
      return "Savings Account";
    case "CHECKING":
      return "Checking Account";
    case "BUSINESS":
      return "Business Account";
    case "FIXED_DEPOSIT":
      return "Fixed Deposit Account";
    default:
      return "Account";
  }
}

export function AccountCards() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getAccounts();
        setAccounts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load accounts");
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-40 items-center justify-center rounded-xl bg-muted"
          >
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-destructive/50 bg-destructive/10">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-card">
        <p className="text-muted-foreground">
          No accounts found. Create your first account to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          title={getAccountLabel(account.accountType)}
          lastFour={account.accountNumber.slice(-4)}
          balance={account.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          icon={getAccountIcon(account.accountType)}
        />
      ))}
    </div>
  );
}
