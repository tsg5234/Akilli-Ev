import { requireAccountSession, updateSessionFamily } from "@/lib/auth";
import { bootstrapApp } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import type { SetupPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const session = await requireAccountSession();
    const body = (await request.json()) as SetupPayload;

    if (!body.familyName?.trim() || !body.parentName?.trim() || !body.pin?.trim()) {
      return jsonError("Aile adi, ebeveyn adi ve PIN gerekli.");
    }

    if (body.pin.trim().length < 4) {
      return jsonError("PIN en az 4 haneli olmali.");
    }

    const result = await bootstrapApp(
      {
        accountId: session.accountId,
        username: session.username,
        familyId: session.familyId,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken
      },
      {
        familyName: body.familyName.trim(),
        parentName: body.parentName.trim(),
        pin: body.pin.trim(),
        includeSampleData: Boolean(body.includeSampleData)
      }
    );

    await updateSessionFamily(session, result.familyId);

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kurulum yapilamadi.", 500);
  }
}
