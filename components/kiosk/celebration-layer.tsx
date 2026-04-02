"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, PartyPopper, Sparkles, Star } from "lucide-react";
import { AvatarDisplay } from "@/components/kiosk/avatar-display";

interface CelebrationLayerProps {
  open: boolean;
  userName: string;
  userAvatar: string;
  taskTitle: string;
  points: number;
  totalPoints: number;
  onDone: () => void;
}

const particles = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: 50 + ((index % 7) - 3) * 18,
  top: 10 + (index % 4) * 12,
  rotate: -120 + index * 16,
  x: (index % 2 === 0 ? -1 : 1) * (30 + index * 6),
  y: -120 - (index % 5) * 20
}));

function hashSeed(value: string) {
  return Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function pickBySeed<T>(items: T[], seed: number, offset = 0) {
  return items[(seed + offset) % items.length];
}

function getCelebrationCopy(userName: string, taskTitle: string, points: number, totalPoints: number) {
  const seed = hashSeed(`${userName}-${taskTitle}-${points}-${totalPoints}`);

  const kicker = pickBySeed(
    ["Mis gibi tamamlandı", "Bir adım daha bitti", "Harika gidiyorsun", "Bugün çok güzel akıyor"],
    seed
  );

  const headline = pickBySeed(
    [
      `${userName}, bunu da hallettin`,
      `${userName}, şahane gidiyorsun`,
      `${userName}, yine çok iyiydin`,
      `${userName}, eline sağlık`
    ],
    seed,
    1
  );

  const body = pickBySeed(
    [
      `"${taskTitle}" bitti. Bu turda +${points} puan kazandın.`,
      `"${taskTitle}" tamam. +${points} puan daha senin oldu.`,
      `"${taskTitle}" işaretlendi. Küçük küçük gidip çok güzel topluyorsun.`,
      `"${taskTitle}" güzelce halloldu. +${points} puan eklendi.`
    ],
    seed,
    2
  );

  const footer = pickBySeed(
    [
      `Toplamın şimdi ${totalPoints} puan.`,
      `Şu an toplam ${totalPoints} puandasın.`,
      `${totalPoints} puana ulaştın.`,
      `Puan hanende şimdi ${totalPoints} var.`
    ],
    seed,
    3
  );

  return { kicker, headline, body, footer };
}

export function CelebrationLayer({
  open,
  userName,
  userAvatar,
  taskTitle,
  points,
  totalPoints,
  onDone
}: CelebrationLayerProps) {
  const copy = getCelebrationCopy(userName, taskTitle, points, totalPoints);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timeout);
  }, [open, onDone]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key={`${userName}-${taskTitle}-${points}-${totalPoints}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] overflow-hidden"
        >
          <div className="absolute inset-0 bg-slate-950/18 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_45%)]" />
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--active-soft-strong)] blur-[120px]" />

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1, 1, 0.8],
                x: particle.x,
                y: particle.y,
                rotate: particle.rotate
              }}
              transition={{ duration: 1.15, ease: "easeOut", delay: particle.id * 0.018 }}
              className="absolute left-1/2 top-1/2"
              style={{ marginLeft: `${particle.left}px`, marginTop: `${particle.top}px` }}
            >
              {particle.id % 3 === 0 ? (
                <Star className="h-8 w-8 fill-amber-300 text-amber-300" />
              ) : particle.id % 2 === 0 ? (
                <Sparkles className="h-8 w-8 text-sky-200" />
              ) : (
                <PartyPopper className="h-8 w-8 text-emerald-200" />
              )}
            </motion.div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.84, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.84 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="relative w-[min(92vw,34rem)] overflow-hidden rounded-[2.8rem] text-white"
              style={{
                backgroundImage: "linear-gradient(150deg, var(--active-primary) 0%, var(--active-secondary) 72%, var(--active-accent) 145%)",
                boxShadow: "0 32px 90px var(--active-glow)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-white/16 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-3rem] left-[-2rem] h-36 w-36 rounded-full bg-amber-200/20 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="relative px-8 py-9 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border border-white/28 bg-white/16 text-[2.9rem] shadow-[0_18px_34px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                  <AvatarDisplay avatar={userAvatar} name={userName} />
                </div>

                <div className="mt-5 text-sm font-black uppercase tracking-[0.24em] text-white/70">
                  {copy.kicker}
                </div>
                <div className="mt-2 text-[2.4rem] font-black tracking-[-0.05em] leading-[0.95] sm:text-[2.8rem]">
                  {copy.headline}
                </div>
                <div className="mx-auto mt-3 max-w-[26rem] text-base leading-relaxed text-white/82 sm:text-[1.05rem]">
                  {copy.body}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-bold text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                    {taskTitle}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-200/18 px-4 py-2 text-sm font-black text-amber-100 ring-1 ring-amber-200/26">
                    <Star className="h-4 w-4 fill-current" />+{points} puan
                  </div>
                </div>

                  <div className="mt-6 rounded-[1.8rem] bg-black/12 px-5 py-4 backdrop-blur-xl">
                    <div className="flex items-center justify-center gap-2 text-amber-200">
                      <Star className="h-5 w-5 fill-amber-200" />
                      <Sparkles className="h-5 w-5" />
                      <PartyPopper className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-base font-semibold text-white/90">{copy.footer}</div>
                    <div className="mt-2 text-5xl font-black tracking-[-0.08em] text-white">{totalPoints}</div>
                  </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
