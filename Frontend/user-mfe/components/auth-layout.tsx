"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  LogoIcon,
  CheckCircleIcon,
  ShieldIcon,
  SupportIcon,
} from "@/components/icons";

function AuthSidebar() {
  return (
    <div
      className="hidden lg:flex w-[450px] flex-col p-12"
      style={{ backgroundColor: "var(--nigus-green)" }}
    >
      <Link href="/" className="flex items-center gap-3 mb-16 no-underline">
        <div className="text-foreground">
          <LogoIcon width="20" height="20" />
        </div>
        <span className="text-foreground font-bold text-xl">
          <span style={{ color: "var(--nigus-orange)" }}>NIGUS</span> Bank
        </span>
      </Link>
      <div className="flex-1 flex flex-col">
        <h1 className="text-foreground text-5xl font-bold leading-tight mb-6 tracking-tight">
          {"Experience"}
          <br />
          {"Premium"}
          <br />
          <span style={{ color: "var(--nigus-orange)" }}>
            {"Digital Banking."}
          </span>
        </h1>
        <p className="text-foreground/90 text-lg leading-relaxed mb-12">
          {
            "Join over 2 million Ethiopians who trust NIGUS Bank for their daily financial needs. Fast, secure, and reliable."
          }
        </p>
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-foreground/15 flex items-center justify-center shrink-0 text-foreground">
              <CheckCircleIcon width="14" height="14" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-1">
                {"Instant Account Opening"}
              </h4>
              <p className="text-foreground/80 text-xs leading-relaxed">
                {"Get your account number in under 2 minutes."}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-foreground/15 flex items-center justify-center shrink-0 text-foreground">
              <ShieldIcon width="14" height="14" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-1">
                {"Secure ETB Transfers"}
              </h4>
              <p className="text-foreground/80 text-xs leading-relaxed">
                {"Bank-grade security for all your nationwide transfers."}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-foreground/15 flex items-center justify-center shrink-0 text-foreground">
              <SupportIcon width="14" height="14" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm mb-1">
                {"24/7 Premium Support"}
              </h4>
              <p className="text-foreground/80 text-xs leading-relaxed">
                {"Our team is always here to help you via chat or phone."}
              </p>
            </div>
          </div>
        </div>
        <div
          className="mt-auto rounded-xl p-6"
          style={{ backgroundColor: "var(--nigus-dark-green)" }}
        >
          <p className="text-foreground/90 text-sm leading-relaxed mb-4">
            {
              '"NIGUS Bank has completely changed how I manage my business finances in Addis. The interface is intuitive and the speed is unmatched."'
            }
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-foreground"
              style={{ backgroundColor: "#63987e" }}
            >
              {"A"}
            </div>
            <div>
              <strong className="text-foreground text-sm block">
                {"Abiy Ahmed"}
              </strong>
              <span className="text-foreground/70 text-xs">{"PM"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthFooter() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex justify-center gap-6 text-xs font-bold tracking-wide">
        <span
          className="border-b-2 pb-1"
          style={{
            color: "var(--nigus-green)",
            borderColor: "var(--nigus-green)",
          }}
        >
          {"ENGLISH"}
        </span>
        <span className="text-muted-foreground cursor-pointer">
          {"AMHARIC"}
        </span>
        <span className="text-muted-foreground cursor-pointer">
          {"AFAN OROMO"}
        </span>
      </div>
      <div className="flex justify-between items-center border-t border-border pt-6 text-xs text-muted-foreground">
        <p>{"© 2026 NIGUS Bank Ethiopia. All rights reserved."}</p>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {"Help"}
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {"Legal"}
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {"Contact"}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AuthSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[480px]">{children}</div>
        </div>
        <AuthFooter />
      </div>
    </div>
  );
}
