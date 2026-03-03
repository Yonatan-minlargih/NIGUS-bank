import Link from "next/link";
import {
  LogoIcon,
  CheckCircleIcon,
  ShieldIcon,
  ServerIcon,
  LockIcon,
  CompliantIcon,
  RocketIcon,
  KeyIcon,
  GlobeIcon,
  TwitterIcon,
} from "@/components/icons";

function Navigation() {
  return (
    <nav className="flex justify-between items-center px-[5%] py-6 bg-background">
      <div className="flex items-center gap-3 font-bold text-xl text-foreground">
        <div
          className="flex items-center"
          style={{ color: "var(--nigus-green)" }}
        >
          <LogoIcon />
        </div>
        <span>
          <span style={{ color: "var(--nigus-orange)" }}>{"NIGUS"}</span>
          {" Bank"}
        </span>
      </div>
      <div className="hidden md:flex gap-8 font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">
          {"Features"}
        </a>
        <a href="#about" className="hover:text-foreground transition-colors">
          {"About"}
        </a>
        <a href="#support" className="hover:text-foreground transition-colors">
          {"Support"}
        </a>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/login"
          className="font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          {"Login"}
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
        >
          {"Open Account"}
        </Link>
      </div>
    </nav>
  );
}

function HeroContent() {
  return (
    <div className="flex-1 max-w-[500px]">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide mb-8"
        style={{ backgroundColor: "var(--nigus-orange)", color: "white" }}
      >
        <CheckCircleIcon width="14" height="14" /> {"NOW LIVE IN ADDIS ABABA"}
      </div>
      <h1
        className="text-7xl leading-tight mb-8 font-bold tracking-tight text-balance"
        style={{ color: "var(--nigus-green)" }}
      >
        {"The Future of"}
        <br />
        {"Banking "}
        <span style={{ color: "var(--nigus-orange)" }}>{"in"}</span>
        <br />
        <span style={{ color: "var(--nigus-orange)" }}>{"Ethiopia"}</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
        {
          "Experience secure, modular, and lightning-fast digital finance powered by advanced micro-frontend architecture."
        }
      </p>
      <div className="flex gap-4 mb-8">
        <Link
          href="/register"
          className="px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
        >
          {"Get Started"}
        </Link>
        <a
          href="#features"
          className="px-8 py-3 rounded-lg font-semibold border-2 transition-colors hover:bg-secondary"
          style={{
            borderColor: "var(--nigus-green)",
            color: "var(--nigus-green)",
          }}
        >
          {"Learn More"}
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        <strong style={{ color: "var(--nigus-green)" }}>{"10k+"}</strong>
        {" active users this month"}
      </p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div
      className="relative w-[90%] max-w-[600px] bg-background rounded-xl border-4 border-foreground/80 overflow-hidden"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
      }}
    >
      <div className="bg-secondary p-3 flex gap-2 border-b border-border">
        <span className="w-3 h-3 rounded-full bg-destructive" />
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "#f59e0b" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "#10b981" }}
        />
      </div>
      <div className="p-8 bg-background min-h-[300px]">
        <div className="h-4 bg-secondary rounded-lg mb-4 w-[30%]" />
        <div className="h-4 bg-secondary rounded-lg mb-4 w-[50%]" />
        <div className="bg-secondary/60 rounded-lg h-[200px] mt-5 flex items-center justify-center relative">
          <span
            className="font-bold text-sm tracking-widest"
            style={{ color: "var(--nigus-green)" }}
          >
            {"DASHBOARD PREVIEW"}
          </span>
        </div>
        <div className="h-4 bg-secondary rounded-lg mt-8 w-full" />
      </div>
      <div
        className="absolute -bottom-5 -left-10 bg-background rounded-xl py-4 px-5 flex items-center gap-4"
        style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
      >
        <div
          className="p-2.5 rounded-lg flex"
          style={{ backgroundColor: "#dcfce7", color: "var(--nigus-green)" }}
        >
          <ShieldIcon />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold tracking-wide">
            {"TRANSFER SENT"}
          </span>
          <span className="font-extrabold text-foreground">
            {"+ ETB 24,500.00"}
          </span>
        </div>
      </div>
    </div>
  );
}

function TrustBanner() {
  return (
    <section
      className="py-12 px-[5%] text-center"
      style={{ backgroundColor: "var(--nigus-green)" }}
    >
      <p
        className="text-sm font-bold tracking-widest mb-8"
        style={{ color: "rgba(255,255,255,0.9)" }}
      >
        {"TRUSTED BY LEADING FINANCIAL INSTITUTIONS & SECURITY STANDARDS"}
      </p>
      <div className="flex flex-wrap justify-center gap-8 lg:gap-16 bg-black/15 py-4 px-8 rounded-lg max-w-[1000px] mx-auto">
        {[
          { icon: <ShieldIcon />, label: "PCI-DSS Level 1" },
          { icon: <ServerIcon />, label: "CBE Partner" },
          { icon: <LockIcon />, label: "AES-256 Secure" },
          { icon: <CompliantIcon />, label: "NBE Compliant" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 font-semibold text-lg"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-3 gap-16 py-24 px-[5%] max-w-[1200px] mx-auto bg-background"
      id="features"
    >
      {[
        {
          icon: <RocketIcon />,
          title: "Micro-frontend Speed",
          desc: "Modular architecture ensures zero downtime and lightning-fast loading speeds across the continent.",
        },
        {
          icon: <KeyIcon />,
          title: "Bank-Grade Security",
          desc: "End-to-end encryption with biometric authentication keeps your financial data under lock and key.",
        },
        {
          icon: <GlobeIcon />,
          title: "Local Integration",
          desc: "Native support for Ethiopian payment gateways and local financial regulations built right in.",
        },
      ].map((f) => (
        <div key={f.title} className="flex flex-col">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
            style={{ backgroundColor: "var(--nigus-green)" }}
          >
            {f.icon}
          </div>
          <h3
            className="text-xl font-semibold mb-3"
            style={{ color: "var(--nigus-green)" }}
          >
            {f.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="py-16 px-[5%] mt-auto"
      style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div className="flex items-center font-bold text-xl gap-2">
          <LogoIcon />
          <span>
            <span style={{ color: "var(--nigus-orange)" }}>{"NIGUS"}</span>
            {" Bank"}
          </span>
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="opacity-80 hover:opacity-100 transition-opacity"
            style={{ color: "white" }}
          >
            {"Privacy Policy"}
          </a>
          <a
            href="#"
            className="opacity-80 hover:opacity-100 transition-opacity"
            style={{ color: "white" }}
          >
            {"Terms of Service"}
          </a>
        </div>
        <div>
          <a
            href="#"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors inline-flex"
            style={{ color: "white" }}
          >
            <TwitterIcon />
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-sm opacity-70">
        <p>
          {
            "© 2026 NIGUS Bank. All rights reserved. Licensed by the National Bank of Ethiopia."
          }
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Navigation />
      <section className="flex flex-col lg:flex-row items-center justify-between py-20 px-[5%] bg-background gap-12">
        <HeroContent />
        <div className="flex-1 flex justify-end relative">
          <DashboardMockup />
        </div>
      </section>
      <TrustBanner />
      <Features />
      <Footer />
    </div>
  );
}
