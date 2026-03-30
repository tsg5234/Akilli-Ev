import { requireParentSession } from "@/lib/auth";
import { getDashboardSnapshot, updateFamilySettings } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const session = await requireParentSession();
    const body = (await request.json()) as {
      name?: string;
      theme?: "acik" | "koyu";
      audioEnabled?: boolean;
      childSleepTime?: string;
      parentSleepTime?: string;
      dayResetTime?: string;
    };

    await updateFamilySettings(session.familyId, {
      name: body.name?.trim(),
      theme: body.theme,
      audio_enabled: body.audioEnabled,
      child_sleep_time: body.childSleepTime?.trim(),
      parent_sleep_time: body.parentSleepTime?.trim(),
      day_reset_time: body.dayResetTime?.trim()
    });

    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Ayarlar güncellenemedi", 500);
  }
}
