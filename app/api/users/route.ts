import { requireParentSession } from "@/lib/auth";
import { getDashboardSnapshot, saveUser } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import type { UserFormPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const session = await requireParentSession();
    const body = (await request.json()) as UserFormPayload;

    if (!body.name?.trim() || !body.avatar?.trim() || !body.color?.trim()) {
      return jsonError("İsim, avatar ve renk gerekli.");
    }

    await saveUser(session.familyId, {
      ...body,
      name: body.name.trim(),
      avatar: body.avatar.trim(),
      color: body.color.trim(),
      visible_in_kiosk: true
    });

    return jsonOk(await getDashboardSnapshot());
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kullanıcı kaydedilemedi", 500);
  }
}
