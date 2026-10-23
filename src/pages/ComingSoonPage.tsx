
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Laptop,
  Mail,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
  LockKeyhole,
  KeyRound,
  Phone,
  Zap,
  Monitor,
} from "lucide-react";

interface ComingSoonPageProps {
  onUnlock?: () => void;
}

const DAY = 24 * 60 * 60 * 1000;

// Set this to your actual launch date and time.
// This example is 30 days after October 17, 2026 (IST).
const LAUNCH_DATE = new Date("2026-11-16T00:00:00+05:30").getTime();

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getCountdown = (): Countdown => {
  const remaining = Math.max(0, LAUNCH_DATE - Date.now());

  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / (60 * 60 * 1000)),
    minutes: Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((remaining % (60 * 1000)) / 1000),
  };
};

const CountdownUnit = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => (
  <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-2 py-4 text-center shadow-lg shadow-black/10 sm:px-4 sm:py-5">
    <div
      className="text-3xl font-bold tabular-nums tracking-tight text-white sm:text-5xl"
      aria-label={`${value} ${label.toLowerCase()}`}
    >
      {String(value).padStart(2, "0")}
    </div>
    <div className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs sm:tracking-[0.22em]">
      {label}
    </div>
  </div>
);

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  onUnlock,
}) => {
  const [countdown, setCountdown] = useState<Countdown>(getCountdown);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown());

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const launched =
    countdown.days === 0 &&
    countdown.hours === 0 &&
    countdown.minutes === 0 &&
    countdown.seconds === 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    // Connect this to your backend/email marketing service.
    // A successful API response should trigger setSubscribed(true).
    setSubscribed(true);
  };

  const handleUnlockSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passcode.trim() !== "time4preview") {
      setPassError(true);
      return;
    }

    if (onUnlock) {
      onUnlock();
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("preview", "time4preview");
    window.location.href = url.toString();
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080B16] text-white selection:bg-violet-500 selection:text-white">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute -right-32 top-48 h-96 w-96 rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        <a href="#" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/25">
            <Laptop className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight sm:text-xl">
              Time4<span className="text-violet-400">Laptop</span>
            </div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">
              Premium technology store
            </div>
          </div>
        </a>

        <a
          href="mailto:contact@time4laptop.com"
          className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-white/[0.08] hover:text-white sm:inline-flex"
        >
          <Mail className="h-4 w-4 text-violet-400" />
          Contact us
        </a>

        <a
          href="mailto:contact@time4laptop.com"
          aria-label="Email Time4Laptop"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 sm:hidden"
        >
          <Mail className="h-4 w-4" />
        </a>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:py-14">
        {/* Left: headline and countdown */}
        <section className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.09] px-3.5 py-2 text-[10px] font-semibold tracking-wide text-violet-200 sm:text-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {launched
              ? "WE'RE READY — LAUNCH DAY"
              : "SOMETHING EXCITING IS ON ITS WAY"}
            <Sparkles className="ml-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />
          </div>

          <h1 className="text-4xl font-black leading-[1.12] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
            Your next
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              upgrade
            </span>{" "}
            is closer
            <br className="hidden sm:block" /> than ever.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:mx-0">
            A smarter destination for premium laptops, certified refurbished
            devices, essential accessories, and tech you can trust. We&apos;re
            putting the finishing touches on your new shopping experience.
          </p>

          {/* Countdown */}
          <div className="mx-auto mt-9 max-w-xl lg:mx-0">
            <div className="mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300 sm:text-sm lg:justify-start">
              <Clock3 className="h-4 w-4 text-violet-400" />
              {launched ? "We're live!" : "The launch countdown"}
            </div>

            {launched ? (
              <div
                className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-center sm:text-left"
                role="status"
              >
                <p className="text-xl font-bold text-emerald-300">
                  The wait is over.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Time4Laptop launch day is here. Get in touch for updates.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-4 gap-2 sm:gap-3"
                role="timer"
                aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes and ${countdown.seconds} seconds until launch`}
              >
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Minutes" />
                <CountdownUnit value={countdown.seconds} label="Seconds" />
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 sm:text-xs lg:justify-start">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Countdown to our scheduled launch · Indian Standard Time</span>
            </div>
          </div>

          {/* Email signup */}
          <div className="mx-auto mt-9 max-w-xl lg:mx-0">
            <div className="mb-3 text-sm font-semibold text-slate-200">
              Get early access to launch offers
            </div>

            {subscribed ? (
              <div
                role="status"
                className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-4 text-left"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    You&apos;re on the list!
                  </p>
                  <p className="mt-1 break-all text-xs leading-5 text-slate-400">
                    Your email is {email}. Connect the form to your email
                    service to send real launch notifications.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/20 sm:flex-row"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    aria-label="Email address"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-300 active:scale-[0.98]"
                >
                  Notify me
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-3 text-[11px] leading-5 text-slate-500">
              Launch updates and exclusive offers. No unnecessary spam.
            </p>
          </div>
        </section>

        {/* Right: laptop showcase */}
        <section
          aria-label="Time4Laptop product showcase"
          className="mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div className="relative mx-auto max-w-lg">
            <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-[75px]" />

            {/* Main laptop card */}
            <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.025] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold text-white sm:text-sm">
                    The future of shopping
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    Premium tech. Better choices.
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1.5 text-[9px] font-semibold text-emerald-300 sm:text-[10px]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  QUALITY FIRST
                </div>
              </div>

              {/* CSS-drawn laptop illustration */}
              <div className="relative my-6 flex min-h-[210px] items-center justify-center overflow-hidden rounded-2xl border border-violet-300/10 bg-gradient-to-br from-[#17152f] via-[#10162c] to-[#0a2332] px-5 py-7 sm:my-8 sm:min-h-[275px]">
                <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/10 sm:h-64 sm:w-64" />
                <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 sm:h-48 sm:w-48" />

                <div className="relative w-full max-w-[290px]">
                  <div className="relative mx-auto w-[86%] rounded-t-xl border-[3px] border-b-0 border-slate-500/80 bg-gradient-to-br from-slate-600 to-slate-900 p-1.5 pb-2 shadow-[0_0_40px_rgba(139,92,246,0.18)] sm:rounded-t-2xl sm:border-4 sm:p-2 sm:pb-3">
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-t-md bg-gradient-to-br from-[#34246d] via-[#352a88] to-[#087f8c] sm:rounded-t-lg">
                      <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-cyan-300/30 blur-2xl" />
                      <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-fuchsia-400/30 blur-2xl" />
                      <div className="relative text-center">
                        <Monitor className="mx-auto mb-2 h-8 w-8 text-white/90 sm:h-10 sm:w-10" strokeWidth={1.2} />
                        <div className="text-lg font-black tracking-tight sm:text-2xl">
                          TIME4<span className="text-cyan-200">LAPTOP</span>
                        </div>
                        <div className="mt-1 text-[7px] font-medium uppercase tracking-[0.28em] text-white/70 sm:text-[9px]">
                          Your next-level experience
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative mx-auto h-2 w-full rounded-b-[50%] bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 sm:h-3" />
                  <div className="mx-auto h-1 w-[22%] rounded-b-lg bg-slate-500/80 sm:h-1.5" />
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 backdrop-blur-md sm:bottom-4 sm:left-4 sm:px-3">
                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                  <span className="text-[9px] font-semibold text-white sm:text-[10px]">
                    Performance meets value
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center sm:p-4">
                  <ShieldCheck className="mx-auto h-5 w-5 text-violet-300" />
                  <div className="mt-2 text-[10px] font-bold text-slate-200 sm:text-xs">
                    Verified tech
                  </div>
                  <div className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                    Quality checked
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center sm:p-4">
                  <Check className="mx-auto h-5 w-5 text-emerald-300" />
                  <div className="mt-2 text-[10px] font-bold text-slate-200 sm:text-xs">
                    Warranty options
                  </div>
                  <div className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                    Shop with confidence
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center sm:p-4">
                  <Truck className="mx-auto h-5 w-5 text-cyan-300" />
                  <div className="mt-2 text-[10px] font-bold text-slate-200 sm:text-xs">
                    Delivery
                  </div>
                  <div className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                    Convenient shopping
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-center gap-2 text-center text-[10px] text-slate-500 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Built for people who love great technology.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-black/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:flex-row sm:px-8 sm:text-left lg:px-12">
          <div className="text-[11px] leading-5 text-slate-500 sm:text-xs">
            <span>© {new Date().getFullYear()} Time4Laptop.</span>{" "}
            All rights reserved.
            <span className="mt-1 block text-slate-600">
              Premium laptops. A smarter way to shop.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <a
              href="mailto:contact@time4laptop.com"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              Call us
            </a>
            <button
              type="button"
              onClick={() => {
                setShowUnlockModal(true);
                setPassError(false);
                setPasscode("");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-violet-400/30 hover:text-white"
            >
              <LockKeyhole className="h-3.5 w-3.5" />
              Client preview
            </button>
          </div>
        </div>
      </footer>

      {/* Preview modal */}
      {showUnlockModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowUnlockModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            className="relative my-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#111426] p-6 shadow-2xl shadow-black/50 sm:p-8"
          >
            <button
              type="button"
              aria-label="Close preview dialog"
              onClick={() => setShowUnlockModal(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <KeyRound className="h-5 w-5" />
            </div>

            <h2
              id="preview-title"
              className="text-xl font-bold tracking-tight text-white"
            >
              Preview the store
            </h2>
            <p className="mt-2 pr-5 text-sm leading-6 text-slate-400">
              Enter your preview access code to continue to the store.
            </p>

            <form onSubmit={handleUnlockSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="preview-passcode"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Preview passcode
                </label>
                <input
                  id="preview-passcode"
                  type="password"
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Enter your access code"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPassError(false);
                  }}
                  className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/20 ${
                    passError
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-violet-400"
                  }`}
                  aria-invalid={passError}
                  aria-describedby={passError ? "passcode-error" : undefined}
                />

                {passError && (
                  <p
                    id="passcode-error"
                    role="alert"
                    className="mt-2 text-xs text-rose-400"
                  >
                    Incorrect passcode. Please try again.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  Unlock store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoonPage;
