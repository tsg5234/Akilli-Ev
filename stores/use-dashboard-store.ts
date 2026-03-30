"use client";

import { create } from "zustand";
import type {
  DashboardPayload,
  RewardFormPayload,
  TaskFormPayload,
  UserFormPayload
} from "@/lib/types";

interface ToastState {
  kind: "basari" | "bilgi" | "hata";
  message: string;
}

interface CelebrationState {
  userId: string;
  taskTitle: string;
  points: number;
  key: number;
}

interface DashboardStore {
  data: DashboardPayload | null;
  activeProfileId: string | null;
  pendingTaskKeys: string[];
  loading: boolean;
  working: boolean;
  error: string | null;
  toast: ToastState | null;
  celebration: CelebrationState | null;
  loginOpen: boolean;
  adminOpen: boolean;
  loadDashboard: () => Promise<void>;
  setActiveProfile: (profileId: string) => void;
  openLogin: () => void;
  closeLogin: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  clearToast: () => void;
  clearCelebration: () => void;
  loginParent: (pin: string) => Promise<boolean>;
  logoutParent: () => Promise<void>;
  completeTask: (
    taskId: string,
    userId: string,
    dateKey: string,
    taskTitle: string,
    points: number
  ) => Promise<void>;
  requestReward: (rewardId: string, userId: string) => Promise<void>;
  saveUser: (payload: UserFormPayload) => Promise<void>;
  saveTask: (payload: TaskFormPayload) => Promise<void>;
  saveReward: (payload: RewardFormPayload) => Promise<void>;
  resolveRedemption: (
    redemptionId: string,
    status: "onaylandi" | "reddedildi"
  ) => Promise<void>;
  adjustPoints: (userId: string, delta: number, note: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  updateFamilySettings: (payload: {
    name?: string;
    theme?: "acik" | "koyu";
    audioEnabled?: boolean;
    childSleepTime?: string;
    parentSleepTime?: string;
    dayResetTime?: string;
  }) => Promise<void>;
}

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || "İşlem başarısız.");
  }

  return payload;
}

function pickDefaultProfile(data: DashboardPayload | null) {
  if (!data?.users.length) {
    return null;
  }

  return data.users.find((user) => user.role === "çocuk")?.id ?? data.users[0]?.id ?? null;
}

function withDashboardState(
  set: (
    partial:
      | Partial<DashboardStore>
      | ((state: DashboardStore) => Partial<DashboardStore>)
  ) => void,
  data: DashboardPayload
) {
  set((state) => {
    const existingActive = data.users.some((user) => user.id === state.activeProfileId)
      ? state.activeProfileId
      : pickDefaultProfile(data);

    return {
      data,
      activeProfileId: existingActive
    };
  });
}

function getTaskActionKey(taskId: string, userId: string, dateKey: string) {
  return `${taskId}:${userId}:${dateKey}`;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  data: null,
  activeProfileId: null,
  pendingTaskKeys: [],
  loading: true,
  working: false,
  error: null,
  toast: null,
  celebration: null,
  loginOpen: false,
  adminOpen: false,
  async loadDashboard() {
    set({ loading: true, error: null });

    try {
      const data = await requestJson<DashboardPayload>("/api/dashboard");
      withDashboardState(set, data);
      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Veriler yüklenemedi."
      });
    }
  },
  setActiveProfile(profileId) {
    set({
      activeProfileId: profileId,
      toast: { kind: "bilgi", message: "Profil seçildi." }
    });
  },
  openLogin() {
    set({ loginOpen: true });
  },
  closeLogin() {
    set({ loginOpen: false });
  },
  openAdmin() {
    set({ adminOpen: true });
  },
  closeAdmin() {
    set({ adminOpen: false });
  },
  clearToast() {
    set({ toast: null });
  },
  clearCelebration() {
    set({ celebration: null });
  },
  async loginParent(pin) {
    set({ working: true, error: null });

    try {
      await requestJson<{ success: boolean }>("/api/auth/parent-login", {
        method: "POST",
        body: JSON.stringify({ pin })
      });

      const data = await requestJson<DashboardPayload>("/api/dashboard");
      withDashboardState(set, data);
      set({
        working: false,
        loginOpen: false,
        adminOpen: true,
        toast: { kind: "basari", message: "Ebeveyn modu açıldı." }
      });
      return true;
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Giriş yapılamadı."
        }
      });
      return false;
    }
  },
  async logoutParent() {
    set({ working: true });

    try {
      await requestJson<{ success: boolean }>("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({})
      });

      const data = await requestJson<DashboardPayload>("/api/dashboard");
      withDashboardState(set, data);
      set({
        working: false,
        adminOpen: false,
        toast: { kind: "bilgi", message: "Ebeveyn oturumu kapatıldı." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Çıkış yapılamadı."
        }
      });
    }
  },
  async completeTask(taskId, userId, dateKey, taskTitle, points) {
    const taskKey = getTaskActionKey(taskId, userId, dateKey);

    if (get().pendingTaskKeys.includes(taskKey)) {
      return;
    }

    set((state) => ({
      working: true,
      error: null,
      pendingTaskKeys: [...state.pendingTaskKeys, taskKey]
    }));

    try {
      const data = await requestJson<DashboardPayload>(`/api/tasks/${taskId}/toggle`, {
        method: "POST",
        body: JSON.stringify({ userId, dateKey })
      });

      withDashboardState(set, data);
      set((state) => ({
        working: false,
        pendingTaskKeys: state.pendingTaskKeys.filter((key) => key !== taskKey),
        celebration: {
          userId,
          taskTitle,
          points,
          key: (state.celebration?.key ?? 0) + 1
        },
        toast: { kind: "basari", message: "Aferin! Görev işlendi." }
      }));
    } catch (error) {
      set((state) => ({
        working: false,
        pendingTaskKeys: state.pendingTaskKeys.filter((key) => key !== taskKey),
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Görev güncellenemedi."
        }
      }));
    }
  },
  async requestReward(rewardId, userId) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>(`/api/rewards/${rewardId}/redeem`, {
        method: "POST",
        body: JSON.stringify({ userId })
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Ödül talebi gönderildi." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Ödül talebi gönderilemedi."
        }
      });
    }
  },
  async saveUser(payload) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>("/api/users", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Kullanıcı kaydedildi." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Kullanıcı kaydedilemedi."
        }
      });
    }
  },
  async saveTask(payload) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Görev kaydedildi." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Görev kaydedilemedi."
        }
      });
    }
  },
  async saveReward(payload) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>("/api/rewards", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Ödül kaydedildi." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Ödül kaydedilemedi."
        }
      });
    }
  },
  async resolveRedemption(redemptionId, status) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>(
        `/api/redemptions/${redemptionId}/status`,
        {
          method: "POST",
          body: JSON.stringify({ status })
        }
      );
      withDashboardState(set, data);
      set({
        working: false,
        toast: {
          kind: "basari",
          message: status === "onaylandi" ? "Ödül onaylandı." : "Ödül reddedildi."
        }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Talep güncellenemedi."
        }
      });
    }
  },
  async adjustPoints(userId, delta, note) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>("/api/points/adjust", {
        method: "POST",
        body: JSON.stringify({ userId, delta, note })
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Puan düzenlendi." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Puan düzenlenemedi."
        }
      });
    }
  },
  async resetProgress() {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>("/api/family/reset-progress", {
        method: "POST",
        body: JSON.stringify({})
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Test verileri sıfırlandı." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Test verileri sıfırlanamadı."
        }
      });
    }
  },
  async updateFamilySettings(payload) {
    set({ working: true });

    try {
      const data = await requestJson<DashboardPayload>("/api/family/settings", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      withDashboardState(set, data);
      set({
        working: false,
        toast: { kind: "basari", message: "Aile ayarları kaydedildi." }
      });
    } catch (error) {
      set({
        working: false,
        toast: {
          kind: "hata",
          message: error instanceof Error ? error.message : "Aile ayarları kaydedilemedi."
        }
      });
    }
  }
}));
