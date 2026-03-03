"use client";

import { useEffect, useState } from "react";
import { Filter, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient, Account } from "@/lib/api";

const columns = [
  "Account Name",
  "Type",
  "Interest Rate",
  "Open Date",
  "Status",
  "Balance",
];

function getAccountTypeLabel(type: string) {
  switch (type) {
    case "SAVING":
      return "Personal Savings";
    case "CHECKING":
      return "Standard Checking";
    case "BUSINESS":
      return "Business Checking";
    case "FIXED_DEPOSIT":
      return "Fixed Deposit";
    default:
      return type;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AccountOverview() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const blob = await apiClient.downloadAccountReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `account-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading report:", err);
      setError("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl bg-bank-table-bg">
        <div className="flex items-center justify-center px-6 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
          <span className="ml-2 text-primary-foreground">
            Loading accounts...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl bg-bank-table-bg">
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-bank-table-bg">
      {/* Table Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-bold text-primary-foreground">
          Global Account Overview
        </h2>
        <button className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-foreground/10">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-[10px] font-semibold tracking-wider text-primary-foreground/50 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, idx) => (
              <tr
                key={account.id}
                className={cn(
                  "border-b border-primary-foreground/5 transition-colors hover:bg-bank-table-row-alt",
                  idx % 2 === 0 ? "bg-bank-table-row" : "bg-bank-table-row-alt",
                )}
              >
                <td className="px-6 py-4 text-sm font-medium text-primary-foreground">
                  {account.accountName}
                </td>
                <td className="px-6 py-4 text-sm text-primary-foreground/70">
                  {getAccountTypeLabel(account.accountType)}
                </td>
                <td className="px-6 py-4 text-sm text-primary-foreground/70">
                  {account.interestRate}% p.a.
                </td>
                <td className="px-6 py-4 text-sm text-primary-foreground/70">
                  {formatDate(account.openedAt)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase",
                      account.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                        : account.status === "DORMANT"
                          ? "bg-orange-500/20 text-orange-300 ring-1 ring-orange-400/40"
                          : "bg-red-500/20 text-red-300 ring-1 ring-red-400/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mr-1.5 h-1.5 w-1.5 rounded-full",
                        account.status === "ACTIVE"
                          ? "bg-emerald-400"
                          : account.status === "DORMANT"
                            ? "bg-orange-400"
                            : "bg-red-400",
                      )}
                    />
                    {account.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-primary-foreground">
                  {account.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ETB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center border-t border-primary-foreground/10 px-6 py-4">
        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="flex items-center gap-2 text-sm font-medium text-primary-foreground/60 transition-colors hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {downloading
            ? "Downloading..."
            : "Download Comprehensive Report (PDF)"}
        </button>
      </div>
    </div>
  );
}
