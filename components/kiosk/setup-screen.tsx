"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, KeyRound, Sparkles, Users } from "lucide-react";

interface SetupScreenProps {
  working: boolean;
  onSubmit: (payload: {
    familyName: string;
    parentName: string;
    pin: string;
    includeSampleData: boolean;
  }) => Promise<void>;
}

export function SetupScreen({ working, onSubmit }: SetupScreenProps) {
  const [familyName, setFamilyName] = useState("Güler Ailesi");
  const [parentName, setParentName] = useState("Tanju");
  const [pin, setPin] = useState("");
  const [includeSampleData, setIncludeSampleData] = useState(true);

  return (
    <div className="app-surface flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-strong grid w-full max-w-6xl gap-8 overflow-hidden rounded-[2.8rem] p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-10"
      >
        <div
          className="relative overflow-hidden rounded-[2.4rem] p-8 text-white"
          style={{ backgroundImage: "linear-gradient(145deg, #38BDF8, #8B5CF6 48%, #22C55E)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.32),transparent_26%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.16),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white/90">
                <Sparkles className="h-4 w-4" />
                Tablet modu icin hazir
              </span>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-black leading-tight tracking-[-0.04em] lg:text-6xl">
                  Aile gorev panosunu dakikalar icinde kurun.
                </h1>
                <p className="max-w-lg text-lg text-white/76">
                  Cocuklar profilini secsin, gorevler gorunsun, puanlar aninda eklensin.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Users, title: "Aile profilleri", text: "Ebeveyn ve cocuk rolleri" },
                { icon: HeartHandshake, title: "Odul sistemi", text: "Puanla talep ve onay" },
                { icon: KeyRound, title: "PIN korumasi", text: "Yonetim ebeveyn kontrolunde" }
              ].map((item) => (
                <div key={item.title} className="rounded-[1.9rem] border border-white/10 bg-white/12 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                  <item.icon className="mb-4 h-6 w-6 text-amber-300" />
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-white/72">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

          <form
          className="space-y-5 rounded-[2.2rem] bg-white/82 p-6 text-slate-900 shadow-panel"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit({ familyName, parentName, pin, includeSampleData });
          }}
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Ilk kurulum
            </p>
            <h2 className="text-3xl font-black tracking-[-0.03em]">Aile bilgilerini girin</h2>
            <p className="text-sm text-slate-600">
              Bu bilgilerle kiosk deneyimi ve yonetim paneli hazir hale gelir.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Aile adi</span>
              <input
                value={familyName}
                onChange={(event) => setFamilyName(event.target.value)}
                className="w-full rounded-[1.6rem] border border-slate-200 bg-white px-4 py-4 text-lg outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.14)]"
                placeholder="Aile adi"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ebeveyn adi</span>
              <input
                value={parentName}
                onChange={(event) => setParentName(event.target.value)}
                className="w-full rounded-[1.6rem] border border-slate-200 bg-white px-4 py-4 text-lg outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.14)]"
                placeholder="Ebeveyn adi"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">PIN</span>
              <input
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                className="w-full rounded-[1.6rem] border border-slate-200 bg-white px-4 py-4 text-lg tracking-[0.4em] outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.14)]"
                placeholder="1234"
              />
            </label>

            <label className="flex items-center justify-between rounded-[1.9rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <div className="font-semibold text-slate-900">Ornek veriler olustur</div>
                <div className="text-sm text-slate-600">
                  Esra, Poyraz ve Aden otomatik eklensin.
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeSampleData}
                onChange={(event) => setIncludeSampleData(event.target.checked)}
                className="h-6 w-6 rounded border-slate-300 text-teal-500"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={working}
            className="w-full rounded-[1.9rem] bg-[linear-gradient(135deg,#22c55e,#38bdf8)] px-6 py-5 text-lg font-black text-white shadow-[0_18px_34px_rgba(34,197,94,0.24)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {working ? "Kuruluyor..." : "Aile panosunu baslat"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
