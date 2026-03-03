"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LogoIcon, UserIcon, ShieldIcon, LogOutIcon } from "@/components/icons";

export default function DashboardPage() {
  const { user, isLoading, logout, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: "var(--nigus-green)",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-muted-foreground">{"Loading your dashboard..."}</p>
        </div>
      </div>
    );
  }

  if (!token) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-secondary/50">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-background border-b border-border">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div style={{ color: "var(--nigus-green)" }}>
            <LogoIcon />
          </div>
          <span className="font-bold text-xl text-foreground">
            <span style={{ color: "var(--nigus-orange)" }}>{"NIGUS"}</span>
            {" Bank"}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon />
            <span className="text-foreground font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <LogOutIcon />
            {"Sign Out"}
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {"Welcome back"}
            {user ? `, ${user.firstName}` : ""}
            {"!"}
          </h1>
          <p className="text-muted-foreground">
            {"Here's an overview of your account."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "var(--nigus-green)",
                  color: "white",
                }}
              >
                <ShieldIcon width="18" height="18" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {"Account Status"}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user?.isPremium ? "Premium" : "Standard"}
            </p>
          </div>
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "var(--nigus-orange)",
                  color: "white",
                }}
              >
                <ShieldIcon width="18" height="18" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {"2FA Security"}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "var(--nigus-green)",
                  color: "white",
                }}
              >
                <UserIcon />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {"Member Since"}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Quick Actions - Navigation to Other Services */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {"Banking Services"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background rounded-xl p-6 border border-border hover:border-[var(--nigus-green)] hover:shadow-lg transition-all group cursor-pointer no-underline"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-[var(--nigus-green)] transition-colors">
                {"Accounts"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {"View and manage your bank accounts"}
              </p>
            </a>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background rounded-xl p-6 border border-border hover:border-[var(--nigus-orange)] hover:shadow-lg transition-all group cursor-pointer no-underline"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--nigus-orange)", color: "white" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-[var(--nigus-orange)] transition-colors">
                {"Transactions"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {"Send, receive, and track payments"}
              </p>
            </a>

            <a
              href="http://localhost:3003"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background rounded-xl p-6 border border-border hover:border-[var(--nigus-green)] hover:shadow-lg transition-all group cursor-pointer no-underline"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-[var(--nigus-green)] transition-colors">
                {"Cards"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {"Manage your debit and credit cards"}
              </p>
            </a>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background rounded-xl p-6 border border-border hover:border-[var(--nigus-orange)] hover:shadow-lg transition-all group cursor-pointer no-underline"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "#1f2937", color: "white" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-gray-600 transition-colors">
                {"Admin Portal"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {"Administrative dashboard access"}
              </p>
            </a>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-background rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {"Profile Information"}
            </h2>
          </div>
          <div className="p-6">
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                    {"First Name"}
                  </label>
                  <p className="text-foreground font-medium mt-1">
                    {user.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                    {"Last Name"}
                  </label>
                  <p className="text-foreground font-medium mt-1">
                    {user.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                    {"Email"}
                  </label>
                  <p className="text-foreground font-medium mt-1">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                    {"Phone Number"}
                  </label>
                  <p className="text-foreground font-medium mt-1">
                    {user.phoneNumber || "Not set"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                    {"Address"}
                  </label>
                  <p className="text-foreground font-medium mt-1">
                    {user.address || "Not set"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {"Loading profile information..."}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
