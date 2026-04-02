import { requireParentSession } from "@/lib/auth";
import { getDashboardSnapshot, reorderTasks } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

interface ReorderTasksPayload {
  orderedTaskIds?: string[];
}

export async function POST(request: Request) {
  try {
    const session = await requireParentSession();
    const body = (await request.json()) as ReorderTasksPayload;
    const orderedTaskIds = Array.isArray(body.orderedTaskIds) ? body.orderedTaskIds : [];

    if (orderedTaskIds.length < 2) {
      return jsonError("Siralamak icin en az iki gorev gerekli.");
    }

    await reorderTasks(session.familyId, orderedTaskIds);
    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Gorev sirasi guncellenemedi", 500);
  }
}
