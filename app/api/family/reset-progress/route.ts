import { requireParentSession } from "@/lib/auth";
import { getDashboardSnapshot, resetFamilyProgress } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST() {
  try {
    const session = await requireParentSession();
    await resetFamilyProgress(session.familyId);
    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Test verisi sıfırlanamadı", 500);
  }
}
