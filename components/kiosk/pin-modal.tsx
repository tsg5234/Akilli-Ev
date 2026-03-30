"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PinModalProps {
  open: boolean;
  working: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<void>;
}

export function PinModal({ open, working, onClose, onSubmit }: PinModalProps) {
  const [pin, setPin] = useState("");

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Sil", "0", "Tamam"];

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/38 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              className="w-[min(92vw,480px)]"
            >
              <div className="glass-panel-strong rounded-[2.5rem] p-6">
                <div className="text-center">
                  <div className="text-sm font-bold uppercase tracking-[0.24em] text-sky-600">
                    Ebeveyn girisi
                  </div>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.03em]">PIN girin</h2>
                </div>

                <div className="mt-5 rounded-[1.9rem] bg-[linear-gradient(145deg,#0f172a,#1d4ed8)] px-4 py-5 text-center text-4xl tracking-[0.5em] text-white shadow-[0_20px_34px_rgba(29,78,216,0.28)]">
                  {(pin || "*".repeat(4)).padEnd(4, "*").slice(0, 4)}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {digits.map((digit) => (
                    <button
                      key={digit}
                      onClick={async () => {
                        if (digit === "Sil") {
                          setPin((current) => current.slice(0, -1));
                          return;
                        }

                        if (digit === "Tamam") {
                          await onSubmit(pin);
                          setPin("");
                          return;
                        }

                        setPin((current) => `${current}${digit}`.slice(0, 6));
                      }}
                      disabled={working}
                      className="touch-card rounded-[1.6rem] bg-white px-4 py-5 text-xl font-black text-slate-900 shadow-panel disabled:opacity-60"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setPin("");
                    onClose();
                  }}
                  className="mt-4 w-full rounded-[1.6rem] bg-slate-200 px-4 py-4 font-black text-slate-700"
                >
                  Vazgec
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
