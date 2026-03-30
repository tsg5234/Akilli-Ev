import { requireParentSession } from "@/lib/auth";
import { getDashboardSnapshot, saveTask } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import type { TaskFormPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const session = await requireParentSession();
    const body = (await request.json()) as TaskFormPayload;

    if (!body.title?.trim() || !body.icon?.trim() || !body.assignedTo?.length) {
      return jsonError("Başlık, ikon ve atanan kişiler gerekli.");
    }

    await saveTask(session.familyId, {
      ...body,
      title: body.title.trim(),
      icon: body.icon.trim(),
      assignedTo: body.assignedTo,
      days: body.days ?? [],
      specialDates: body.specialDates ?? []
    });

    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Görev kaydedilemedi", 500);
  }
}
