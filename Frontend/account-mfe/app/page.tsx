"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { BankSidebar } from "@/components/bank-sidebar";
import { BankHeader } from "@/components/bank-header";
import { AccountCards } from "@/components/account-cards";
import { AccountOverview } from "@/components/account-overview";
import { useAccountAuth } from "@/lib/account-auth-context";

export default function AccountsPage() {
  const { isAuthenticated, isLoading, user } = useAccountAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to access your accounts.
          </p>
          <Link
            href="http://localhost:3000/login"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-bank-green-light"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <BankSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <BankHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Accounts
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <Link
              href="/create-account"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-bank-green-light"
            >
              <Plus className="h-4 w-4" />
              Create Account
            </Link>
          </div>

          {/* Account Cards */}
          <AccountCards />

          {/* Account Overview Table */}
          <div className="mt-6">
            <AccountOverview />
          </div>
        </main>
      </div>
    </div>
  );
}
