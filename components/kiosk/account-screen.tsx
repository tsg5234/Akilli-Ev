"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { House, KeyRound, ShieldCheck, Sparkles } from "lucide-react";

interface AccountScreenProps {
  working: boolean;
  errorMessage?: string | null;
  onLogin: (payload: { username: string; password: string }) => Promise<void>;
  onRegister: (payload: { username: string; password: string }) => Promise<void>;
}

type Mode = "login" | "register";

export function AccountScreen({
  working,
  errorMessage,
  onLogin,
  onRegister
}: AccountScreenProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submitLabel = useMemo(() => {
    if (working) {
      return mode === "login" ? "Giris yapiliyor..." : "Hesap olusturuluyor...";
    }

    return mode === "login" ? "Hesaba gir" : "Hesap olustur";
  }, [mode, working]);

  const visibleError = localError || errorMessage;

  return (
    <div className="app-surface flex min-h-screen items-center justify-center px-4 py-8 lg:px-6">
      <motion.main
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="glass-panel-strong grid w-full max-w-[1280px] gap-6 overflow-hidden rounded-[2.8rem] p-4 sm:p-5 lg:grid-cols-[1.08fr_0.92fr] lg:p-6"
      >
        <section
          className="relative overflow-hidden rounded-[2.35rem] p-7 text-white sm:p-8 lg:p-10"
          style={{
            backgroundImage:
              "linear-gradient(140deg, #0f172a 0%, #14532d 38%, #0ea5e9 78%, #f59e0b 130%)"
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(250,204,21,0.28),transparent_22%),radial-gradient(circle_at_16%_84%,rgba(255,255,255,0.14),transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-bold tracking-[0.08em] text-white/88">
                <Sparkles className="h-4 w-4" />
                Aileye ozel kiosk deneyimi
              </span>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                  Ev panosu once hesapla acilsin, sonra sadece sizin aileniz gorunsun.
                </h1>
                <p className="max-w-xl text-base leading-7 text-white/76 sm:text-lg">
                  Artik acilis ekraninda dogrudan profiller degil, hesabiniza giris akisi
                  var. Her hesap kendi aile kurulumunu yapar ve sadece kendi profillerini
                  kullanir.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Hesap korumasi",
                  text: "URL acildiginda once username ve sifre ile giris yapilir."
                },
                {
                  icon: House,
                  title: "Aileye ozel alan",
                  text: "Her hesap kendi aile adini, profillerini ve gorevlerini kurar."
                },
                {
                  icon: KeyRound,
                  title: "PIN ikinci katman",
                  text: "Yonetim paneli icin ebeveyn PIN kilidi yine yerinde kalir."
                }
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.7rem] border border-white/12 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                >
                  <item.icon className="h-6 w-6 text-amber-300" />
                  <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/72">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2.35rem] bg-white/88 p-6 shadow-panel sm:p-7 lg:p-8">
          <div className="flex items-center gap-3 rounded-full bg-slate-100 p-1">
            {[
              { id: "login" as const, label: "Giris yap" },
              { id: "register" as const, label: "Hesap ac" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMode(item.id);
                  setLocalError(null);
                }}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-black transition ${
                  mode === item.id
                    ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setLocalError(null);

              if (mode === "register" && password !== confirmPassword) {
                setLocalError("Sifre tekrar alani esit degil.");
                return;
              }

              if (mode === "login") {
                await onLogin({ username, password });
                return;
              }

              await onRegister({ username, password });
            }}
          >
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-700">
                {mode === "login" ? "Hos geldin" : "Ilk adim"}
              </p>
              <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950">
                {mode === "login"
                  ? "Aile panona giris yap"
                  : "Hesabini ac, sonra aileni kur"}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Username alaninda sadece harf, rakam, nokta, tire ve alt cizgi
                kullanabilirsin.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Username</span>
              <input
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))
                }
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-lg outline-none transition focus:border-emerald-400 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"
                placeholder="ornek aile"
                autoComplete="username"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">Sifre</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-lg outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                placeholder="En az 6 karakter"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            {mode === "register" ? (
              <label className="block space-y-2">
                <span className="text-sm font-bold text-slate-700">Sifre tekrar</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-lg outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                  placeholder="Sifreni tekrar yaz"
                  autoComplete="new-password"
                />
              </label>
            ) : null}

            {visibleError ? (
              <div className="rounded-[1.4rem] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {visibleError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={working}
              className="w-full rounded-[1.7rem] bg-[linear-gradient(135deg,#0f172a,#14532d_46%,#0ea5e9)] px-6 py-5 text-lg font-black text-white shadow-[0_22px_40px_rgba(14,165,233,0.18)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitLabel}
            </button>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              {mode === "login"
                ? "Giris yaptiktan sonra sadece bu hesaba bagli aile ekrani acilir."
                : "Hesabi actiktan sonra seni aile kurulumu ekranina gotururuz; orada profil ve PIN ayarlarsin."}
            </div>
          </form>
        </section>
      </motion.main>
    </div>
  );
}
