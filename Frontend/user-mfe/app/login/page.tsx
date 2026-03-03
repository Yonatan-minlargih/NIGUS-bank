"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";
import { signin, verifyOtp } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signin({ email, password });

      if (res.twoFactorRequired) {
        setStep(2);
        setTimeLeft(59);
      } else if (res.jwt) {
        login(res.jwt);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const otpString = otp.join("");
      const res = await verifyOtp({ email, otp: otpString });

      if (res.jwt) {
        login(res.jwt);
        if (typeof window !== "undefined") {
          // For the user_service app itself, keep token in localStorage via useAuth.
          // For the account_service app on port 3001, pass the token via URL so it can read it on first load.
          const encodedToken = encodeURIComponent(res.jwt);
          window.location.href = `http://localhost:3001?token=${encodedToken}`;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      await signin({ email, password });
      setTimeLeft(59);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === 1 ? (
        <>
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2 text-balance">
              {"Welcome Back"}
            </h2>
            <p className="text-muted-foreground">
              {"Sign in to your account to continue."}
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block font-semibold text-sm text-foreground mb-2">
                {"Email Address"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <UserIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
                  style={
                    {
                      "--tw-ring-color": "var(--nigus-green)",
                    } as React.CSSProperties
                  }
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block font-semibold text-sm text-foreground mb-2">
                {"Password"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-input rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
                  style={
                    {
                      "--tw-ring-color": "var(--nigus-green)",
                    } as React.CSSProperties
                  }
                  placeholder="Enter your password"
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

            <div className="mb-8">
              <span className="text-sm text-muted-foreground">
                {"New to NIGUS Bank? "}
                <Link
                  href="/register"
                  className="font-bold hover:underline"
                  style={{ color: "var(--nigus-green)" }}
                >
                  {"Create an account"}
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 mb-6"
              style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2 text-balance">
              {"Enter Verification Code"}
            </h2>
            <p className="text-muted-foreground">
              {"We've sent a 6-digit code to "}
              <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 my-8 justify-between">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e.key)}
                  className="w-14 h-16 border border-input rounded-lg text-2xl text-center font-semibold text-foreground bg-background focus:outline-none focus:ring-2 transition-colors"
                  style={
                    {
                      "--tw-ring-color": "var(--nigus-green)",
                    } as React.CSSProperties
                  }
                  required
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 mb-8"
              style={{ backgroundColor: "var(--nigus-green)", color: "white" }}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {"Didn't receive code? "}
            {timeLeft > 0 ? (
              <span
                className="font-semibold"
                style={{ color: "var(--nigus-green)" }}
              >
                {"Resend code in 0:"}
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="font-semibold bg-transparent border-none cursor-pointer disabled:opacity-50"
                style={{ color: "var(--nigus-green)" }}
              >
                {"Resend code"}
              </button>
            )}
          </p>
        </>
      )}
    </AuthLayout>
  );
}
