import { createParentSession } from "@/lib/auth";
import { verifyParentPin } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: string };
    const pin = body.pin?.trim() ?? "";

    if (!pin) {
      return jsonError("PIN girin.");
    }

    const family = await verifyParentPin(pin);
    await createParentSession({
      familyId: family.id,
      role: "ebeveyn"
    });

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Giriş yapılamadı", 401);
  }
}
