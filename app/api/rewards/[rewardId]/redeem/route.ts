import { requireFamilySession } from "@/lib/auth";
import { getDashboardSnapshot, requestReward } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

interface Context {
  params: Promise<{
    rewardId: string;
  }>;
}

export async function POST(request: Request, context: Context) {
  try {
    const session = await requireFamilySession();
    const { rewardId } = await context.params;
    const body = (await request.json()) as { userId?: string };

    if (!body.userId?.trim()) {
      return jsonError("Kullanici secilmedi.");
    }

    await requestReward(session.familyId, body.userId.trim(), rewardId);
    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Odul talebi gonderilemedi.", 500);
  }
}
