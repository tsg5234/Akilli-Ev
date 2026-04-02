import { requireParentSession } from "@/lib/auth";
import { getDashboardSnapshot, saveRewardSystemConfig, updateFamilySettings } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import type { FamilySettingsPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const session = await requireParentSession();
    const body = (await request.json()) as FamilySettingsPayload;

    await updateFamilySettings(session.familyId, {
      name: body.name?.trim(),
      theme: body.theme,
      audio_enabled: body.audioEnabled,
      child_sleep_time: body.childSleepTime?.trim(),
      parent_sleep_time: body.parentSleepTime?.trim(),
      day_reset_time: body.dayResetTime?.trim()
    });

    if (body.rewardMode || body.valueLabel || typeof body.valuePerPoint === "number") {
      await saveRewardSystemConfig(session.familyId, {
        mode: body.rewardMode,
        valueLabel: body.valueLabel,
        valuePerPoint: body.valuePerPoint
      });
    }

    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Ayarlar güncellenemedi", 500);
  }
}
