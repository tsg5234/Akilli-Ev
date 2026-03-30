"use client";

let audioContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") {
    return null;
  }

  audioContext ??= new window.AudioContext();
  return audioContext;
}

export async function playSuccessAudio(name?: string) {
  const context = getContext();

  if (context) {
    if (context.state === "suspended") {
      await context.resume();
    }

    const now = context.currentTime;
    const frequencies = [523.25, 659.25, 783.99];

    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.16, now + index * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.16);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + index * 0.09);
      oscillator.stop(now + index * 0.09 + 0.18);
    });
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(
      name ? `Aferin ${name}` : "Aferin"
    );
    utterance.lang = "tr-TR";
    utterance.rate = 1;
    utterance.pitch = 1.12;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}
