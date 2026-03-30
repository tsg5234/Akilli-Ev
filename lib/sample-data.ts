import { randomUUID } from "node:crypto";
import type { TaskRecord, TimeBlock } from "@/lib/types";

type SampleTaskTemplate = {
  title: string;
  icon: string;
  points: number;
  timeBlock: TimeBlock;
};

export const SAMPLE_TASK_TEMPLATES: SampleTaskTemplate[] = [
  {
    title: "Dişlerini fırçala",
    icon: "🪥",
    points: 10,
    timeBlock: "her_zaman"
  },
  {
    title: "Yüzünü yıka",
    icon: "🫧",
    points: 10,
    timeBlock: "her_zaman"
  },
  {
    title: "Yatağını topla",
    icon: "🛏️",
    points: 10,
    timeBlock: "her_zaman"
  },
  {
    title: "Odanı topla",
    icon: "🧺",
    points: 10,
    timeBlock: "her_zaman"
  },
  {
    title: "Kahvaltını yap",
    icon: "🥣",
    points: 10,
    timeBlock: "her_zaman"
  },
  {
    title: "Saçlarını yap",
    icon: "🪮",
    points: 10,
    timeBlock: "her_zaman"
  }
];

export function buildSampleTasks(
  familyId: string,
  assignedTo: string[],
  createdAt: string
): TaskRecord[] {
  return SAMPLE_TASK_TEMPLATES.map((task) => ({
    id: randomUUID(),
    family_id: familyId,
    title: task.title,
    icon: task.icon,
    points: task.points,
    assigned_to: assignedTo,
    schedule_type: "gunluk",
    days: [],
    special_dates: [],
    time_block: task.timeBlock,
    created_at: createdAt
  }));
}
