"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from "@/components/icons";
import { signup } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await signup({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: `+251${phoneNumber}`,
      });

      if (res.jwt) {
        login(res.jwt);
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      let msg = "Registration failed. Please try again.";
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          msg = parsed.message || err.message;
        } catch {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2 text-balance">{"Create your account"}</h2>
        <p className="text-muted-foreground">{"Join Ethiopia's premium digital banking platform today."}</p>
      </div>

      <form onSubmit={handleRegister}>
        {success && (
          <div className="mb-4 p-4 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: "rgba(41, 141, 90, 0.1)", color: "var(--nigus-green)" }}>
            <CheckCircleIcon />
            {"Account created successfully! Redirecting to login..."}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="block font-semibold text-sm text-foreground mb-2">{"First Name"}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
              style={{ "--tw-ring-color": "var(--nigus-green)" } as React.CSSProperties}
              placeholder="e.g. Amha"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-sm text-foreground mb-2">{"Last Name"}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
              style={{ "--tw-ring-color": "var(--nigus-green)" } as React.CSSProperties}
              placeholder="e.g. Kifle"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-semibold text-sm text-foreground mb-2">{"Email Address"}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <MailIcon />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
              style={{ "--tw-ring-color": "var(--nigus-green)" } as React.CSSProperties}
              placeholder="email@example.com"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-semibold text-sm text-foreground mb-2">{"Phone Number"}</label>
          <div className="flex">
            <div className="flex items-center px-4 border border-input border-r-0 rounded-l-lg bg-secondary text-muted-foreground text-sm">
              {"+251"}
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-4 py-3 border border-input border-l-0 rounded-r-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
              style={{ "--tw-ring-color": "var(--nigus-green)" } as React.CSSProperties}
              placeholder="9xx xxx xxxx"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-semibold text-sm text-foreground mb-2">{"Password"}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
              style={{ "--tw-ring-color": "var(--nigus-green)" } as React.CSSProperties}
              placeholder="Min. 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-semibold text-sm text-foreground mb-2">{"Confirm Password"}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <CheckCircleIcon />
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
              style={{ "--tw-ring-color": "var(--nigus-green)" } as React.CSSProperties}
              placeholder="Re-enter your password"
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mt-6 mb-6">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded"
            style={{ accentColor: "var(--nigus-green)" }}
            required
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
            {"I agree to the "}
            <a href="#" className="font-semibold hover:underline" style={{ color: "var(--nigus-green)" }}>{"Terms of Service"}</a>
            {" and "}
            <a href="#" className="font-semibold hover:underline" style={{ color: "var(--nigus-green)" }}>{"Privacy Policy"}</a>
            {"."}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !agreed}
          className="w-full py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 mb-6"
          style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {"Already have an account? "}
        <Link href="/login" className="font-bold hover:underline" style={{ color: "var(--nigus-green)" }}>
          {"Log in here"}
        </Link>
      </p>
    </AuthLayout>
  );
}
