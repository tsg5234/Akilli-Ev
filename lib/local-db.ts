import "server-only";

import { compareSync, hashSync } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { getParentSession } from "@/lib/auth";
import { buildSampleTasks } from "@/lib/sample-data";
import {
  getActiveTimeBlock,
  getDateKey,
  getTurkishDateLabel,
  getWeekDays
} from "@/lib/schedule";
import type {
  CompletionRecord,
  DashboardPayload,
  FamilyRecord,
  PointEventRecord,
  RedemptionRecord,
  RewardFormPayload,
  RewardRecord,
  SetupPayload,
  TaskFormPayload,
  TaskRecord,
  UserFormPayload,
  UserRecord
} from "@/lib/types";

interface LocalFamilyRecord extends FamilyRecord {
  parent_pin_hash: string;
}

interface LocalState {
  family: LocalFamilyRecord | null;
  users: UserRecord[];
  tasks: TaskRecord[];
  completions: CompletionRecord[];
  rewards: RewardRecord[];
  redemptions: RedemptionRecord[];
  pointEvents: PointEventRecord[];
}

declare global {
  var evProgramLocalState: LocalState | undefined;
}

function nowIso() {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createDemoState(): LocalState {
  const createdAt = nowIso();
  const familyId = randomUUID();
  const fatherId = randomUUID();
  const motherId = randomUUID();
  const childOneId = randomUUID();
  const childTwoId = randomUUID();
  const allUserIds = [fatherId, motherId, childOneId, childTwoId];

  return {
    family: {
      id: familyId,
      name: "Güler Ailesi",
      theme: "acik",
      audio_enabled: true,
      child_sleep_time: "22:00",
      parent_sleep_time: "00:00",
      day_reset_time: "00:00",
      created_at: createdAt,
      parent_pin_hash: hashSync("1234", 10)
    },
    users: [
      {
        id: fatherId,
        family_id: familyId,
        name: "Tanju",
        role: "ebeveyn",
        avatar: "👨",
        color: "#2DD4BF",
        birthdate: null,
        points: 0,
        created_at: createdAt
      },
      {
        id: motherId,
        family_id: familyId,
        name: "Esra",
        role: "ebeveyn",
        avatar: "👩",
        color: "#FB7185",
        birthdate: null,
        points: 0,
        created_at: createdAt
      },
      {
        id: childOneId,
        family_id: familyId,
        name: "Poyraz",
        role: "çocuk",
        avatar: "🦁",
        color: "#60A5FA",
        birthdate: "2016-05-14",
        points: 0,
        created_at: createdAt
      },
      {
        id: childTwoId,
        family_id: familyId,
        name: "Aden",
        role: "çocuk",
        avatar: "🦄",
        color: "#22C55E",
        birthdate: "2019-09-02",
        points: 0,
        created_at: createdAt
      }
    ],
    tasks: buildSampleTasks(familyId, allUserIds, createdAt),
    completions: [],
    rewards: [
      {
        id: randomUUID(),
        family_id: familyId,
        title: "Film gecesi seçimi",
        points_required: 120,
        approval_required: false,
        created_at: createdAt
      },
      {
        id: randomUUID(),
        family_id: familyId,
        title: "Hafta sonu dondurma",
        points_required: 180,
        approval_required: true,
        created_at: createdAt
      }
    ],
    redemptions: [],
    pointEvents: []
  };
}

function getState() {
  globalThis.evProgramLocalState ??= createDemoState();
  return globalThis.evProgramLocalState;
}

function toSnapshot(state: LocalState, authenticated: boolean): DashboardPayload {
  return {
    setupRequired: false,
    family: state.family
      ? {
          id: state.family.id,
          name: state.family.name,
          theme: state.family.theme,
          audio_enabled: state.family.audio_enabled,
          child_sleep_time: state.family.child_sleep_time,
          parent_sleep_time: state.family.parent_sleep_time,
          day_reset_time: state.family.day_reset_time,
          created_at: state.family.created_at
        }
      : null,
    session: {
      authenticated,
      role: authenticated ? "ebeveyn" : null
    },
    users: clone(state.users),
    tasks: clone(state.tasks),
    completions: clone(state.completions),
    rewards: clone(state.rewards),
    redemptions: clone(state.redemptions),
    pointEvents: clone(
      [...state.pointEvents].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 60)
    ),
    today: {
      dateKey: getDateKey(new Date(), state.family),
      label: getTurkishDateLabel(new Date(), state.family),
      weekday: new Intl.DateTimeFormat("tr-TR", {
        timeZone: "Europe/Istanbul",
        weekday: "long"
      }).format(new Date()),
      activeTimeBlock: getActiveTimeBlock(new Date(), state.family)
    },
    week: getWeekDays(new Date(), state.family)
  };
}

function requireFamily() {
  const family = getState().family;

  if (!family) {
    throw new Error("Aile kaydı bulunamadı.");
  }

  return family;
}

export async function getLocalDashboardSnapshot() {
  const session = await getParentSession();
  const state = getState();
  const authenticated = Boolean(session?.familyId && session.familyId === state.family?.id);
  return toSnapshot(state, authenticated);
}

export async function bootstrapLocalApp({
  familyName,
  parentName,
  pin,
  includeSampleData
}: SetupPayload) {
  const createdAt = nowIso();
  const familyId = randomUUID();
  const fatherId = randomUUID();
  const motherId = randomUUID();
  const childOneId = randomUUID();
  const childTwoId = randomUUID();
  const sampleUserIds = [fatherId, motherId, childOneId, childTwoId];

  globalThis.evProgramLocalState = {
    family: {
      id: familyId,
      name: familyName,
      theme: "acik",
      audio_enabled: true,
      child_sleep_time: "22:00",
      parent_sleep_time: "00:00",
      day_reset_time: "00:00",
      created_at: createdAt,
      parent_pin_hash: hashSync(pin, 10)
    },
    users: [
      {
        id: fatherId,
        family_id: familyId,
        name: parentName,
        role: "ebeveyn",
        avatar: "👨",
        color: "#2DD4BF",
        birthdate: null,
        points: 0,
        created_at: createdAt
      },
      ...(includeSampleData
        ? [
            {
              id: motherId,
              family_id: familyId,
              name: "Esra",
              role: "ebeveyn" as const,
              avatar: "👩",
              color: "#FB7185",
              birthdate: null,
              points: 0,
              created_at: createdAt
            },
            {
              id: childOneId,
              family_id: familyId,
              name: "Poyraz",
              role: "çocuk" as const,
              avatar: "🦁",
              color: "#60A5FA",
              birthdate: "2016-05-14",
              points: 0,
              created_at: createdAt
            },
            {
              id: childTwoId,
              family_id: familyId,
              name: "Aden",
              role: "çocuk" as const,
              avatar: "🦄",
              color: "#22C55E",
              birthdate: "2019-09-02",
              points: 0,
              created_at: createdAt
            }
          ]
        : [])
    ],
    tasks: includeSampleData ? buildSampleTasks(familyId, sampleUserIds, createdAt) : [],
    completions: [],
    rewards: includeSampleData
      ? [
          {
            id: randomUUID(),
            family_id: familyId,
            title: "Film gecesi seçimi",
            points_required: 120,
            approval_required: false,
            created_at: createdAt
          }
        ]
      : [],
    redemptions: [],
    pointEvents: []
  };

  return getLocalDashboardSnapshot();
}

export async function verifyLocalParentPin(pin: string) {
  const family = requireFamily();

  if (!compareSync(pin, family.parent_pin_hash)) {
    throw new Error("PIN hatalı.");
  }

  return {
    id: family.id,
    name: family.name,
    theme: family.theme,
    audio_enabled: family.audio_enabled,
    created_at: family.created_at
  };
}

export async function saveLocalUser(familyId: string, payload: UserFormPayload) {
  const state = getState();

  if (payload.id) {
    state.users = state.users.map((user) =>
      user.id === payload.id
        ? {
            ...user,
            name: payload.name,
            role: payload.role,
            avatar: payload.avatar,
            color: payload.color,
            birthdate: payload.birthdate || null
          }
        : user
    );
    return;
  }

  state.users.push({
    id: randomUUID(),
    family_id: familyId,
    name: payload.name,
    role: payload.role,
    avatar: payload.avatar,
    color: payload.color,
    birthdate: payload.birthdate || null,
    points: 0,
    created_at: nowIso()
  });
}

export async function saveLocalTask(familyId: string, payload: TaskFormPayload) {
  const task: TaskRecord = {
    id: payload.id || randomUUID(),
    family_id: familyId,
    title: payload.title,
    icon: payload.icon,
    points: payload.points,
    assigned_to: payload.assignedTo,
    schedule_type: payload.scheduleType,
    days: payload.days,
    special_dates: payload.specialDates,
    time_block: payload.timeBlock,
    created_at: payload.id
      ? getState().tasks.find((item) => item.id === payload.id)?.created_at || nowIso()
      : nowIso()
  };

  const state = getState();
  state.tasks = state.tasks.filter((item) => item.id !== task.id);
  state.tasks.push(task);
}

export async function saveLocalReward(familyId: string, payload: RewardFormPayload) {
  const reward: RewardRecord = {
    id: payload.id || randomUUID(),
    family_id: familyId,
    title: payload.title,
    points_required: payload.pointsRequired,
    approval_required: payload.approvalRequired,
    created_at: payload.id
      ? getState().rewards.find((item) => item.id === payload.id)?.created_at || nowIso()
      : nowIso()
  };

  const state = getState();
  state.rewards = state.rewards.filter((item) => item.id !== reward.id);
  state.rewards.push(reward);
}

export async function toggleLocalTaskCompletion(taskId: string, userId: string, dateKey: string) {
  const state = getState();
  const task = state.tasks.find((item) => item.id === taskId);
  const user = state.users.find((item) => item.id === userId);

  if (!task || !user) {
    throw new Error("Görev veya kullanıcı bulunamadı.");
  }

  const existing = state.completions.find(
    (item) => item.task_id === taskId && item.user_id === userId && item.completion_date === dateKey
  );

  if (existing) {
    state.completions = state.completions.filter((item) => item.id !== existing.id);
    user.points -= existing.points_earned;
    state.pointEvents.unshift({
      id: randomUUID(),
      family_id: user.family_id,
      user_id: userId,
      delta: -existing.points_earned,
      source: "gorev",
      task_id: taskId,
      reward_id: null,
      note: "Görev geri alındı",
      created_at: nowIso()
    });
    return { completed: false, points_change: -existing.points_earned, total_points: user.points };
  }

  const completion: CompletionRecord = {
    id: randomUUID(),
    family_id: user.family_id,
    user_id: userId,
    task_id: taskId,
    completion_date: dateKey,
    points_earned: task.points,
    created_at: nowIso()
  };

  state.completions.push(completion);
  user.points += task.points;
  state.pointEvents.unshift({
    id: randomUUID(),
    family_id: user.family_id,
    user_id: userId,
    delta: task.points,
    source: "gorev",
    task_id: taskId,
    reward_id: null,
    note: "Görev tamamlandı",
    created_at: nowIso()
  });

  return { completed: true, points_change: task.points, total_points: user.points };
}

export async function requestLocalReward(userId: string, rewardId: string) {
  const state = getState();
  const user = state.users.find((item) => item.id === userId);
  const reward = state.rewards.find((item) => item.id === rewardId);

  if (!user || !reward) {
    throw new Error("Kullanıcı veya ödül bulunamadı.");
  }

  if (user.points < reward.points_required) {
    throw new Error("Yeterli puan yok.");
  }

  const redemption: RedemptionRecord = {
    id: randomUUID(),
    family_id: user.family_id,
    user_id: userId,
    reward_id: rewardId,
    status: reward.approval_required ? "beklemede" : "onaylandi",
    requested_at: nowIso(),
    resolved_at: reward.approval_required ? null : nowIso()
  };

  state.redemptions.unshift(redemption);

  if (!reward.approval_required) {
    user.points -= reward.points_required;
    state.pointEvents.unshift({
      id: randomUUID(),
      family_id: user.family_id,
      user_id: userId,
      delta: -reward.points_required,
      source: "odul",
      task_id: null,
      reward_id: rewardId,
      note: "Ödül otomatik verildi",
      created_at: nowIso()
    });
  }

  return redemption;
}

export async function resolveLocalReward(redemptionId: string, status: "onaylandi" | "reddedildi") {
  const state = getState();
  const redemption = state.redemptions.find((item) => item.id === redemptionId);

  if (!redemption) {
    throw new Error("Talep bulunamadı.");
  }

  if (redemption.status !== "beklemede") {
    return redemption;
  }

  redemption.status = status;
  redemption.resolved_at = nowIso();

  if (status === "onaylandi") {
    const user = state.users.find((item) => item.id === redemption.user_id);
    const reward = state.rewards.find((item) => item.id === redemption.reward_id);

    if (!user || !reward) {
      throw new Error("Talep işlenemedi.");
    }

    if (user.points < reward.points_required) {
      throw new Error("Onay için yeterli puan yok.");
    }

    user.points -= reward.points_required;
    state.pointEvents.unshift({
      id: randomUUID(),
      family_id: user.family_id,
      user_id: user.id,
      delta: -reward.points_required,
      source: "odul",
      task_id: null,
      reward_id: reward.id,
      note: "Ödül onaylandı",
      created_at: nowIso()
    });
  }

  return redemption;
}

export async function adjustLocalPoints(userId: string, delta: number, note: string) {
  const state = getState();
  const user = state.users.find((item) => item.id === userId);

  if (!user) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  user.points += delta;
  state.pointEvents.unshift({
    id: randomUUID(),
    family_id: user.family_id,
    user_id: userId,
    delta,
    source: "manuel",
    task_id: null,
    reward_id: null,
    note,
    created_at: nowIso()
  });

  return { total_points: user.points };
}

export async function resetLocalProgress(familyId: string) {
  const state = getState();

  if (state.family?.id !== familyId) {
    throw new Error("Aile bulunamadı.");
  }

  state.users = state.users.map((user) => ({
    ...user,
    points: 0
  }));
  state.completions = [];
  state.redemptions = [];
  state.pointEvents = [];
}

export async function updateLocalFamilySettings(
  familyId: string,
  payload: Partial<{
    name: string;
    theme: "acik" | "koyu";
    audio_enabled: boolean;
    child_sleep_time: string;
    parent_sleep_time: string;
    day_reset_time: string;
  }>
) {
  const family = requireFamily();

  if (family.id !== familyId) {
    throw new Error("Aile bulunamadı.");
  }

  if (typeof payload.name === "string" && payload.name.trim()) {
    family.name = payload.name.trim();
  }

  if (payload.theme) {
    family.theme = payload.theme;
  }

  if (typeof payload.audio_enabled === "boolean") {
    family.audio_enabled = payload.audio_enabled;
  }

  if (typeof payload.child_sleep_time === "string" && payload.child_sleep_time.trim()) {
    family.child_sleep_time = payload.child_sleep_time.trim();
  }

  if (typeof payload.parent_sleep_time === "string" && payload.parent_sleep_time.trim()) {
    family.parent_sleep_time = payload.parent_sleep_time.trim();
  }

  if (typeof payload.day_reset_time === "string" && payload.day_reset_time.trim()) {
    family.day_reset_time = payload.day_reset_time.trim();
  }
}
